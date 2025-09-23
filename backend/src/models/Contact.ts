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
      index: true,
    },
    source: {
      type: String,
      default: "website_contact_form",
      index: true, // IMPROVED: Add index for analytics
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
      index: true, // CRITICAL: Index for data isolation
    },
    followUpDate: {
      type: Date,
      index: true, // IMPROVED: Index for follow-up queries
    },
    // ADDED: Priority field for lead management
    priority: {
      type: String,
      default: "normal",
      index: true,
    },
    leadScore: {
      type: Number,
      default: 50,
    },
    lastContactedAt: {
      type: Date,
      index: true,
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

// IMPROVED: Performance indexes for common queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1, createdAt: -1 }); // Status with time sorting
ContactSchema.index({ assignedToClinic: 1, status: 1 }); // Clinic isolation + status
ContactSchema.index({ priority: 1, status: 1 }); // Priority management
ContactSchema.index({ createdAt: -1 }); // Chronological queries
ContactSchema.index({ followUpDate: 1, status: 1 }); // Follow-up management
ContactSchema.index({ leadScore: -1 }); // Lead scoring queries
ContactSchema.index({ source: 1, createdAt: -1 }); // Source analytics

// CRITICAL: Add compound index for dashboard queries
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

// ADDED: Text search index for name, email, clinic
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

// IMPROVED: Compound indexes for complex queries
ContactSchema.index({
  assignedToClinic: 1,
  status: 1,
  priority: -1,
  createdAt: -1,
}); // Clinic dashboard queries

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
