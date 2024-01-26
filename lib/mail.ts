import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "whatever@codelam.tech",
    to: email,
    subject: "Confirm Your Emil 🎉🎉",
    html: `<p>Click <a href="${confirmLink}">Here</a>To Confirm Email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "whatever@codelam.tech",
      to: email,
      subject: "Reset your password",
      text: `Click here to reset password: ${resetLink}`,
    });
  } catch (error) {
    return console.log(error);
  }
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "memo@codelam.tech",
    to: email,
    subject: "Two Factor Authentication",
    html: `<p>Your two factor authentication code is: ${token}</p>`,
  });
};
