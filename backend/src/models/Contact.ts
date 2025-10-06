// backend/src/models/Contact.ts - FIXED VERSION
import mongoose, { Document, Schema } from "mongoose";
import { Contact as IContact, ContactStatus } from "@topsmile/types";

const ContactSchema = new Schema<IContact & Document>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clinic: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "new",
    },
    source: {
      type: String,
      default: "website_contact_form",
    },
    notes: {
      type: String,
      trim: true,
    },
    // FIXED: Proper clinic association for data isolation
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedToClinic: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
    followUpDate: {
      type: Date,
    },
    priority: {
      type: String,
      default: "normal",
    },
    leadScore: {
      type: Number,
      default: 50,
    },
    lastContactedAt: {
      type: Date,
    },
    conversionDetails: {
      convertedAt: Date,
      convertedBy: Schema.Types.ObjectId,
      conversionNotes: String,
      conversionValue: Number,
    },
    metadata: {
      utmSource: String,
      utmMedium: String,
      utmCampaign: String,
      utmTerm: String,
      utmContent: String,
      referrer: String,
      ipAddress: String,
      userAgent: String,
    },
    // Soft delete fields
    deletedAt: Date,
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // Merge tracking
    mergedInto: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  },
  {
    timestamps: true,
  }
);

// Optimized indexes - removed redundant single-field indexes
// Compound index covers: assignedToClinic, status, priority, createdAt queries
ContactSchema.index(
  {
    assignedToClinic: 1,
    status: 1,
    priority: -1,
    createdAt: -1,
  },
  {
    name: "clinic_dashboard_query",
    background: true,
  }
);

// Follow-up queries
ContactSchema.index({ followUpDate: 1, status: 1 });

// Text search
ContactSchema.index(
  {
    name: "text",
    email: "text",
    clinic: "text",
    specialty: "text",
  },
  {
    name: "contact_text_search",
  }
);

// ADDED: Pre-save middleware for data validation
ContactSchema.pre("save", function (this: IContact & Document, next) {
  // Auto-assign clinic based on assignedTo user if not set
  if (this.assignedTo && !this.assignedToClinic) {
    // Note: This would require populating the user to get their clinic
    // For now, we'll handle this in the service layer
  }

  // Update lastContactedAt when status changes to 'contacted'
  if (this.isModified("status") && this.status === "contacted") {
    this.lastContactedAt = new Date();
  }

  // Auto-fill conversion details when status becomes 'converted'
  if (
    this.isModified("status") &&
    this.status === "converted" &&
    !this.conversionDetails?.convertedAt
  ) {
    if (!this.conversionDetails) {
      this.conversionDetails = {
        convertedAt: new Date(),
        convertedBy: this.assignedTo as any,
        conversionNotes: "",
      };
    } else {
      this.conversionDetails.convertedAt = new Date();
    }
  }

  next();
});

// ADDED: Static methods for common queries
ContactSchema.statics.findByClinic = function (clinicId: string) {
  return this.find({ assignedToClinic: clinicId }).sort({ createdAt: -1 });
};

ContactSchema.statics.findActiveLeads = function (clinicId?: string) {
  const query: any = {
    status: { $in: ["new", "contacted", "qualified"] },
  };
  if (clinicId) {
    query.assignedToClinic = clinicId;
  }
  return this.find(query).sort({ priority: -1, createdAt: -1 });
};

ContactSchema.statics.findOverdueFollowUps = function (clinicId?: string) {
  const query: any = {
    followUpDate: { $lt: new Date() },
    status: { $nin: ["converted", "closed"] },
  };
  if (clinicId) {
    query.assignedToClinic = clinicId;
  }
  return this.find(query).sort({ followUpDate: 1 });
};

export const Contact = mongoose.model<IContact & Document>(
  "Contact",
  ContactSchema
);
