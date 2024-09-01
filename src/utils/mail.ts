import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "noreply.myecom@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Sends an email using the specified parameters.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email's subject.
 * @param {string} html - The email's HTML content.
 * @return {Promise<void>} A promise that resolves when the email is sent.
 */
export const sendMail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  const mailOptions = {
    from: '"My Ecom" <noreply.myecom@gmail.com>',
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Sends an email using a template.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email's subject.
 * @param {string} templateName - The name of the template file.
 * @param {Object} variables - The variables to be used in the template.
 * @return {Promise<void>} A promise that resolves when the email is sent.
 */
export const sendMailWithTemplate = async (
  to: string,
  subject: string,
  templateName: string,
  variables: { [key: string]: any }
): Promise<void> => {
  const directory = path.join(__dirname, `../views/${templateName}.ejs`);

  await ejs.renderFile(directory, variables, async (err, template) => {
    if (err) {
      throw err;
    } else {
      const mailOptions = {
        from: '"My Ecom" <noreply.myecom@gmail.com>',
        to,
        subject,
        html: template,
      };
      await transporter.sendMail(mailOptions);
    }
  });
};
