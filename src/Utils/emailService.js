import nodemailer from 'nodemailer';
import dotenv from 'dotenv';




dotenv.config();


const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

export const sendEmail = (to, subject, html) => {
    // Generic - can send ANY email

    try {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: html
        };

        // send the email
        const info = transporter.sendMail(mailOption);

        console.log('Email sent successfully', info.messageId);

        return { success: true, messageId: info.messageId }

    } catch (error) {
        console.error('Error sending email');
        throw error;  // Re-throw so controller can handle it

    }
};

export const sendResetCodeToEmail = async (recipientEmail, resetCode) => {
    // Specific - uses sendEmail() under the hood

    try {
        const subject = 'Your Cinema Booking Password Reset Code';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .content {
                        background-color: white;
                        padding: 30px;
                        border-radius: 5px;
                    }
                    .code {
                        font-size: 32px;
                        font-weight: bold;
                        color: #007bff;
                        text-align: center;
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                        letter-spacing: 5px;
                        margin: 20px 0;
                    }
                    .warning {
                        color: #dc3545;
                        font-weight: bold;
                        margin-top: 20px;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>You have requested to reset your password for your Cinema Booking account. Use the code below to complete the process:</p>
                        
                        <div class="code">${resetCode}</div>
                        
                        <p>This code will expire in <strong>1 hour</strong>.</p>
                        
                        <p class="warning">⚠️ Security Warning:</p>
                        <ul>
                            <li>Never share this code with anyone</li>
                            <li>Our team will never ask for this code</li>
                            <li>If you didn't request this reset, please ignore this email</li>
                        </ul>
                        
                        <p>If you have any questions, please contact our support team.</p>
                        
                        <div class="footer">
                            <p>This is an automated email from Cinema Booking System</p>
                            <p>Please do not reply to this email</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        return sendEmail(recipientEmail, subject, html);
    } catch (error) {
        console.error('Error sending password reset email:', error.message);
        throw error;

    }
};



