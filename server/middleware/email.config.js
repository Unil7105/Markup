import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "prajapati.unil26@gmail.com",
    pass: "selp inke oljx ofwy",
  },
});


