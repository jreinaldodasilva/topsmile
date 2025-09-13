import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Contact } from '../models/Contact';
import { EmailError } from '../types/errors';

interface ContactEmailData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
  id: string;
}

class EmailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

  private createTransporter(): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    if (this.transporter) return this.transporter;

    if (process.env.NODE_ENV === "production") {
      if (!process.env.SENDGRID_API_KEY) {
        throw new EmailError("SENDGRID_API_KEY is required in production");
      }

      this.transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateLimit: 14, // SendGrid allows 15 emails/second
      } as SMTPTransport.Options);
    } else {
      // Development transporter (Ethereal)
      if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
        this.transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_PASS,
          },
        } as SMTPTransport.Options);
      } else {
        // Fallback: Console transport (for local dev only)
        this.transporter = nodemailer.createTransport({
          streamTransport: true,
          newline: "unix",
          buffer: true,
        } as SMTPTransport.Options);
      }
    }

    return this.transporter!;
  }

  async sendContactEmails(contact: ContactEmailData): Promise<void> {
    try {
      const transporter = this.createTransporter();

      const adminEmailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
        to: process.env.ADMIN_EMAIL || 'contato@topsmile.com',
        subject: `🦷 Nova solicitação TopSmile - ${contact.clinic}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
            <div style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">TopSmile</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Nova solicitação de contato</p>
            </div>

            <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #3949ab;">
                <h3 style="color: #1a237e; margin: 0 0 15px 0; font-size: 18px;">Informações do Lead</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">ID:</td><td style="padding: 8px 0;">#${contact.id}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Nome:</td><td style="padding: 8px 0;">${contact.name}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">E-mail:</td><td style="padding: 8px 0;"><a href="mailto:${contact.email}" style="color: #3949ab;">${contact.email}</a></td></tr>
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Clínica:</td><td style="padding: 8px 0;">${contact.clinic}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Especialidade:</td><td style="padding: 8px 0;">${contact.specialty}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Telefone:</td><td style="padding: 8px 0;"><a href="tel:${contact.phone}" style="color: #3949ab;">${contact.phone}</a></td></tr>
                </table>
              </div>

              <div style="background: #ecfccb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #84cc16;">
                <p style="margin: 0; color: #365314;"><strong>Status:</strong> Novo | <strong>Prioridade:</strong> Alta</p>
                <p style="margin: 5px 0 0 0; color: #365314; font-size: 14px;"><strong>Recebido em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.ADMIN_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/contacts/${contact.id}"
                   style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Gerenciar Lead
                </a>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px;">
              <p>TopSmile - Sistema de Gestão Odontológica</p>
            </div>
          </div>
        `
      };

      const userEmailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
        to: contact.email,
        subject: '🦷 Obrigado pelo interesse no TopSmile!',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
            <div style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600;">TopSmile</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Sistema de Gestão Odontológica</p>
            </div>

            <div style="padding: 30px; background: white; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1a237e; margin: 0 0 20px 0;">Olá, ${contact.name}! 👋</h2>

              <p style="color: #334155; line-height: 1.6; margin: 0 0 20px 0;">
                Obrigado pelo seu interesse no <strong>TopSmile</strong>! Recebemos sua solicitação de contato e nossa equipe entrará em contato <strong>em até 24 horas</strong>.
              </p>

              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3949ab;">
                <h3 style="color: #3949ab; margin: 0 0 15px 0; font-size: 16px;">📋 Resumo da sua solicitação:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 5px 0; font-weight: 600; color: #475569;">Clínica:</td><td style="padding: 5px 0;">${contact.clinic}</td></tr>
                  <tr><td style="padding: 5px 0; font-weight: 600; color: #475569;">Especialidade:</td><td style="padding: 5px 0;">${contact.specialty}</td></tr>
                  <tr><td style="padding: 5px 0; font-weight: 600; color: #475569;">Telefone:</td><td style="padding: 5px 0;">${contact.phone}</td></tr>
                  <tr><td style="padding: 5px 0; font-weight: 600; color: #475569;">Protocolo:</td><td style="padding: 5px 0;"><strong>#${contact.id}</strong></td></tr>
                </table>
              </div>

              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #059669; margin: 0 0 10px 0; font-size: 16px;">🚀 Próximos passos:</h3>
                <ul style="color: #047857; margin: 0; padding-left: 20px;">
                  <li>Nossa equipe analisará suas necessidades</li>
                  <li>Entraremos em contato para agendar uma demonstração</li>
                  <li>Apresentaremos uma proposta personalizada</li>
                </ul>
              </div>

              <p style="color: #334155; line-height: 1.6;">
                Enquanto isso, convidamos você a conhecer mais sobre nossos recursos em nosso site.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}"
                   style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-right: 10px;">
                  Visitar TopSmile
                </a>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/features"
                   style="background: transparent; color: #3949ab; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; border: 2px solid #3949ab;">
                  Ver Recursos
                </a>
              </div>
            </div>

            <div style="text-align: center; padding: 20px; color: #64748b; font-size: 12px; line-height: 1.4;">
              <p style="margin: 0 0 10px 0;">Este é um e-mail automático. Se você não solicitou este contato, pode ignorar esta mensagem.</p>
              <p style="margin: 0;"><strong>Protocolo de atendimento:</strong> #${contact.id} | <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        `
      };

      await Promise.all([
        transporter.sendMail(adminEmailOptions),
        transporter.sendMail(userEmailOptions)
      ]);

    } catch (error) {
      console.error('Failed to send contact emails:', error);
      throw new EmailError('Failed to send contact emails');
    }
  }
}

export const emailService = new EmailService();
