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

export const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: '"My Ecom" <noreply.myecom@gmail.com>',
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
export const sendMailWithTemplate = async (
  to: string,
  subject: string,
  templateName: string,
  variables: { [key: string]: any }
) => {
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
