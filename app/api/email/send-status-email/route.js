import { NextResponse } from "next/server";
import { transporter } from "@/lib/nodemailer";
import approvalEmailTemplate from "@/templates/approvalEmail.template";

export async function POST(req) {
  try {
    const {
      email,
      name,
      role,
      status,
      message,
      actionUrl,
    } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"Sportz" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Approval Notification",
      html: approvalEmailTemplate({
        name,
        role,
        status,
        message,
        actionUrl,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Approval email sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}