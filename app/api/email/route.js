import { transporter } from '@/lib/nodemailer';
import verificationOtpTemplate from '@/templates/verificationOtp.template';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const { email, name, otp } = await req.json();

    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}