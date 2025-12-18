import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like SendGrid, etc.
    auth: {
      user: process.env.EMAIL_USERNAME, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your App Password
    },
  });

  // Define email options
  const mailOptions = {
    from: `"NextStep Team" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // We will send HTML content
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;