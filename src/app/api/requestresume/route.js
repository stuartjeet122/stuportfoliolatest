import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email } = await req.json();

  // Basic validation
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email is required.' }), { status: 400 });
  }

  // Email validation using a regular expression
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email format.' }), { status: 400 });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Replace with your SMTP host
    port: parseInt(process.env.SMTP_PORT, 10), // Replace with your SMTP port
    auth: {
      user: process.env.SMTP_USER, // Replace with your email
      pass: process.env.SMTP_PASS, // Replace with your email password
    },
  });

  // Prepare the email with a responsive HTML body
  const mailOptions = {
    from: email, // Sender's email (the user's email)
    to: 'stuartjeetoo@gmail.com', // Replace with your own email address
    subject: `Resume Request from ${email}`,
    text: `A request for the resume has been made from the email: ${email}`,
    html: `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; padding: 20px; background-color: #fdfdfd; border-radius: 10px; border: 1px solid #eaeaea; max-width: 600px; margin: auto;">
        <h2 style="color: #4a90e2; text-align: center; font-size: 24px; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Resume Request</h2>
        <div style="margin: 20px 0;">
          <p style="font-size: 18px; color: #333;">A request for the resume has been made from the following email:</p>
          <p style="font-size: 18px; color: #4a90e2;">${email}</p>
        </div>
        <div style="border-top: 2px solid #4a90e2; margin: 20px 0;"></div>
        <footer style="margin-top: 20px; font-size: 14px; text-align: center; color: #888;">
          <p style="margin: 0;">This request was sent from your resume request form.</p>
        </footer>
      </div>
      <style>
        @media only screen and (max-width: 600px) {
          div {
            padding: 10px;
          }
          h2 {
            font-size: 20px;
          }
          p {
            font-size: 16px;
          }
        }
      </style>
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Resume request sent successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send request. Please try again later.' }), { status: 500 });
  }
}
