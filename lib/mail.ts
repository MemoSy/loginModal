import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "mahmud@codelam.tech",
    to: email,
    subject: "قم بتأكيد بريدك الإلكتروني 🎉🎉",
    html: `<p>إضغط <a href="${confirmLink}">هنا </a>لتفعيل الإيميل.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "mahmud@codelam.tech",
      to: email,
      subject: "اعد ضبط كلمه السر",
      text: `انقر هنا لإعادة تعيين كلمة المرور: ${resetLink}`,
    });
  } catch (error) {
    return console.log(error);
  }
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "memo@codelam.tech",
    to: email,
    subject: "المصادقة الثنائية ",
    html: `<p>رمز المصادقة الثنائي الخاص بك هو: ${token}</p>`,
  });
};
