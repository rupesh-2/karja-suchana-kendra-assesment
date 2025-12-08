const nodemailer = require('nodemailer');

// Email service configuration
// In production, use environment variables for SMTP credentials
const createTransporter = () => {
  // For development, use Ethereal Email (fake SMTP for testing)
  // In production, configure with real SMTP (Gmail, SendGrid, etc.)
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: Use console logging (or Ethereal for testing)
    return {
      sendMail: async (options) => {
        console.log('📧 Email would be sent:');
        console.log('   To:', options.to);
        console.log('   Subject:', options.subject);
        console.log('   Body:', options.text || options.html);
        if (options.attachments) {
          console.log('   Attachments:', options.attachments.length);
        }
        return { messageId: 'dev-' + Date.now() };
      },
    };
  }
};

const transporter = createTransporter();

class EmailService {
  static async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to,
        subject,
        html,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendPasswordResetEmail(userEmail, resetToken, resetUrl) {
    const subject = 'Password Reset Request';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the button below to reset it:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  static async sendNewUserEmail(userEmail, username, temporaryPassword = null) {
    const subject = 'Welcome to the Application';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome, ${username}!</h2>
          <p>Your account has been created successfully.</p>
          ${temporaryPassword ? `<p><strong>Your temporary password is: ${temporaryPassword}</strong></p><p>Please change your password after logging in.</p>` : ''}
          <p>You can now log in to the application.</p>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  static async sendRoleChangeEmail(userEmail, username, oldRole, newRole) {
    const subject = 'Your Role Has Been Updated';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Role Update Notification</h2>
          <p>Hello ${username},</p>
          <p>Your role has been updated from <strong>${oldRole}</strong> to <strong>${newRole}</strong>.</p>
          <p>Please log out and log back in to see the changes take effect.</p>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }

  static async sendOTPEmail(userEmail, otp) {
    const subject = 'Your Two-Factor Authentication Code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 4px; margin: 20px 0; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Two-Factor Authentication</h2>
          <p>Your verification code is:</p>
          <div class="otp-code">${otp}</div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, html);
  }
}

module.exports = EmailService;

