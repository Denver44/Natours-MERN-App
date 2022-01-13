import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1 Create a transporter
  // Transporter is a service which actually send the email, nodejs will not send the send the mail it the gmail which sends the email

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options

  const mailOptions = {
    from: 'denver <denver@travlespace.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  // 3. Actually Send the email
  await transporter.sendMail(mailOptions);
};
export default sendEmail;

// NOTES :

// In Gmail App we have to enable "Less secure app"
// Send Grid and MailGun are Good Service to send Email
// MailTrap we have used For Dev purpose
