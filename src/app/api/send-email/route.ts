import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, reference, amount, category, group } = await request.json();

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Resend API Key is not configured in environment variables.");
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
    }

    // Format the email HTML body beautifully with inline CSS styles
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
          <h2 style="color: #10b981; margin: 0; font-size: 24px; font-weight: 800;">MSSN Ikeja Area Council</h2>
          <p style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0; font-weight: 700;">Holiday Training Course (HTC '26)</p>
        </div>
        
        <div style="padding: 5px 0; margin-bottom: 20px;">
          <p style="margin-top: 0; font-size: 16px; color: #1e293b; font-weight: 500;">Assalamu Alaykum <strong>${name}</strong>,</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 0;">
            Congratulations! Your registration for the <strong>Holiday Training Course (HTC '26)</strong> is officially complete and your payment has been verified. Below are your registration details:
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9;">
          <tr>
            <td style="padding: 12px 16px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Registration Reference:</td>
            <td style="padding: 12px 16px; font-weight: 700; text-align: right; color: #0f172a; font-family: monospace; border-bottom: 1px solid #e2e8f0;">${reference}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Category:</td>
            <td style="padding: 12px 16px; font-weight: 700; text-align: right; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${category}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; color: #64748b; border-bottom: 1px solid #e2e8f0;">Amount Paid:</td>
            <td style="padding: 12px 16px; font-weight: 700; text-align: right; color: #0f172a; border-bottom: 1px solid #e2e8f0;">₦${amount.toLocaleString()}</td>
          </tr>
          ${group && group !== "None" ? `
          <tr>
            <td style="padding: 12px 16px; color: #64748b;">Assigned House:</td>
            <td style="padding: 12px 16px; font-weight: 800; text-align: right; color: #10b981;">Group ${group}</td>
          </tr>` : ''}
        </table>

        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
          <p style="margin: 0; font-size: 15px; color: #065f46; font-weight: 800; letter-spacing: 0.5px;">
            Camp Theme: "The Credible Maestro"
          </p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #047857; font-weight: 600;">
            Sat. 25th – Mon. 27th July, 2026
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857;">
            Time: 8:00 AM – 4:00 PM Daily (Non-Residential)
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857; font-weight: 500;">
            Venue: Al-Hikmat Nursery & Primary School, Ikeja
          </p>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.6; text-align: center; margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          Please present this confirmation email or your reference code (<strong>${reference}</strong>) upon arrival at the venue for quick check-in and room placement. We look forward to welcoming you!
        </p>
      </div>
    `;

    // Send email using Resend REST API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "MSSN Ikeja Encampment <onboarding@resend.dev>", // Replace with verified domain sender when available
        to: email,
        subject: "HTC '26 Encampment Registration Confirmed!",
        html: htmlBody,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend API returned error:", resData);
      return NextResponse.json({ success: false, error: resData }, { status: res.status });
    }

    return NextResponse.json({ success: true, messageId: resData.id });
  } catch (err: any) {
    console.error("Failed to process send-email route:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
