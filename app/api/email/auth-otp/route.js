import { transporter } from '@/lib/nodemailer';
import verificationOtpTemplate from '@/templates/verificationOtp.template';
import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const { email, name, otp } = await req.json();

    await transporter.sendMail({
      from: `"Sportz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: verificationOtpTemplate({name,otp}),
    });

    return NextResponse.json({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}