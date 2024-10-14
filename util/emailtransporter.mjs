import nodemailer from "nodemailer";

export const emailtransporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'osvaldo.mills61@ethereal.email',
      pass: 'YfjN1d9s6Smpd6GSa4'
  }
});
