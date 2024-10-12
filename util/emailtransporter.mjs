import nodemailer from "nodemailer";

export const emailtransporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "fredrick.frami@ethereal.email",
    pass: "hZQN6cBFsn28SYD345",
  },
});
