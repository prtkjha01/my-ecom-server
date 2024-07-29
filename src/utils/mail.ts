import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "noreply.myecom@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: '"My Ecom" <noreply.myecom@gmail.com>',
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

export default sendMail;
