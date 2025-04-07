const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendVerificationEmail = async (email, otp, firstName) => {
    const mailOptions = {
        from: `"Pharma Health" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Email Verification for Pharma Health',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4CAF50;">Pharma Health</h1>
                    <p style="font-size: 18px; color: #333;">Email Verification</p>
                </div>
                <div style="padding: 20px;">
                    <p>Hello ${firstName},</p>
                    <p>Thank you for registering with Pharma Health. To complete your registration, please use the verification code below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 24px; letter-spacing: 8px; font-weight: bold; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</div>
                    </div>
                    <p>This code will expire in 10 minutes. If you did not request this verification, please ignore this email.</p>
                    <p>Best regards,<br>The Pharma Health Team</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
                    <p>© ${new Date().getFullYear()} Pharma Health. All rights reserved.</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports.sendPasswordResetEmail = async (email, resetUrl, firstName) => {
    const mailOptions = {
        from: `"Pharma Health" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Password Reset for Pharma Health',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4CAF50;">Pharma Health</h1>
                    <p style="font-size: 18px; color: #333;">Password Reset</p>
                </div>
                <div style="padding: 20px;">
                    <p>Hello ${firstName},</p>
                    <p>You requested a password reset for your Pharma Health account. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
                    <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                    <p style="word-break: break-all; font-size: 14px; color: #666;">${resetUrl}</p>
                    <p>Best regards,<br>The Pharma Health Team</p>
                </div>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
                    <p>© ${new Date().getFullYear()} Pharma Health. All rights reserved.</p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};