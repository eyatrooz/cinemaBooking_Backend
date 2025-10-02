import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    try {

        //create trasnpoter
        const trasnpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // test email:
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Test Email From Cinema Booking App",
            html: `
                                  <h2>Test Email</h2>
                <p>If you receive this, your email configuration is working!</p>
                        <p>Sent at: ${new Date().toLocaleString()}</p>
            `
        };

        // send the email
        const info = await trasnpoter.sendMail(mailOption);
        console.log("Email sent successfully");
        console.log('Check your inbox:', process.env.EMAIL_USER);


    } catch (error) {
        console.error('Email sending failed:');
        console.error('Error:', error.message);
    };
};

testEmail();