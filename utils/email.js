import path from 'path';
import nodemailer from 'nodemailer';
import pug from 'pug';
import htmlToText from 'html-to-text';

// Here we are creating a email class
// This class is robust we can send welcome email or forgot password email
// TO send mail we need to thing user to whom we send email and the URL like for forget password we want to send the reset password link

const __dirname = path.resolve(path.dirname(''));

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `denver <${process.env.EMAIL_HOST_ID}>`;
  }

  // eslint-disable-next-line class-methods-use-this
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Send Grid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // This will send the actual email
  async send(template, subject) {
    // 1 Render the HTML Based on a PUG template
    const html = pug.renderFile(`${__dirname}/views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url, // FIX THIS NOT REDIRECTING TO URL WHEN CLICKING ON BUTTON
      subject,
    });

    // 2 Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html), // THis will convert html to text
    };

    // 3 Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    // This template is the name of our template which we will send
    // The subject which we want to send with that
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset link (valid for only 10 minutes)'
    );
  }
}

export default Email;
