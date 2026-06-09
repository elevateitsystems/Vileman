import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const appName = process.env.APP_NAME;
    const appPassword = process.env.APP_PASSWORD;
    const recipientEmail = process.env.RECEPT_EMAIL;

    if (!appName || !appPassword || !recipientEmail) {
      console.error("Missing email environment variables.");
      return NextResponse.json(
        { error: "Email configuration is not set up on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: appName, pass: appPassword },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 30px 15px;
          }
          .container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #fce8f3;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          }
          .logo-container {
            text-align: center;
            margin-bottom: 28px;
          }
          .logo-image {
            max-height: 60px;
            width: auto;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #fce8f3;
            padding-bottom: 20px;
            margin-bottom: 28px;
          }
          .header h1 {
            color: #ec4899;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1px;
            margin: 0;
            text-transform: uppercase;
          }
          .field-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #9ca3af;
            margin-bottom: 6px;
          }
          .field-value {
            font-size: 15px;
            color: #111827;
            margin-bottom: 24px;
          }
          .field-value a {
            color: #ec4899;
            text-decoration: none;
          }
          .message-box {
            background-color: #fdf2f8;
            border-left: 3px solid #ec4899;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            font-size: 14px;
            color: #374151;
            line-height: 1.8;
            white-space: pre-wrap;
          }
          .divider {
            border: none;
            border-top: 1px solid #f5f5f5;
            margin: 0 0 24px;
          }
          .footer {
            text-align: center;
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid #fce8f3;
            font-size: 11px;
            color: #9ca3af;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="container">

          <div class="logo-container">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/img/build/logo1.png" alt="Logo" class="logo-image" />
          </div>

          <div class="header">
            <h1>New Contact Message</h1>
          </div>

          <div class="field-label">Your Name</div>
          <div class="field-value">${name}</div>
          <hr class="divider" />

          <div class="field-label">Email Address</div>
          <div class="field-value">
            <a href="mailto:${email}">${email}</a>
          </div>
          <hr class="divider" />

          <div class="field-label">Message</div>
          <div class="message-box">${message}</div>

          <div class="footer">
            Reply directly to this email to respond to ${name}.<br/>
            ${new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"${name}" <${appName}>`,
      to: recipientEmail,
      subject: `New message from ${name}`,
      html: htmlContent,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send message." },
      { status: 500 }
    );
  }
}