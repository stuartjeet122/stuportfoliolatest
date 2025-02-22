import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST() {
  // Configure nodemailer using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Set your SMTP host in .env
    port: parseInt(process.env.SMTP_PORT, 10), // Set your SMTP port in .env
    auth: {
      user: process.env.SMTP_USER, // Set your SMTP username in .env
      pass: process.env.SMTP_PASS, // Set your SMTP password in .env
    },
  });

  // Prepare the email
  const mailOptions = {
    from: process.env.SMTP_USER, // Sender's email
    to: 'stuartjeetoo@gmail.com', // Your email address
    subject: 'Portfolio Credentials', // Updated subject line
    text: 'Your credentials are:\nUsername: stuartadmin\nPassword: Stuart123@',
    html: `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; padding: 20px; background-color: #fdfdfd; border-radius: 10px; border: 1px solid #eaeaea; max-width: 600px; margin: auto;">
        <h2 style="color: #4a90e2; text-align: center; font-size: 24px; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Portfolio Credentials</h2>
        <div style="margin: 20px 0; text-align: center;">
          <p style="font-size: 18px; color: #333;"><strong>Username:</strong> <span style="color: #4a90e2;">stuartadmin</span></p>
          <p style="font-size: 18px; color: #333;"><strong>Password:</strong> <span style="color: #4a90e2;">Stuart123@</span></p>
        </div>
      </div>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Credentials sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send credentials. Please try again later.' }, { status: 500 });
  }
}
