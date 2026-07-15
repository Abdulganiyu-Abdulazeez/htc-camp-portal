import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const delegateName = body.delegateName || body.name || "Delegate";
    const delegateEmail = body.delegateEmail || body.email;
    const delegateId = body.delegateId || body.id || "N/A";
    const houseName = body.houseName || body.group || "None";
    
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("Resend API Key is not configured in environment variables.");
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 });
    }

    // Format the email HTML body beautifully with inline CSS styles matching requested letter
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); color: #334155; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
          <h2 style="color: #0f766e; margin: 0; font-size: 22px; font-weight: 800;">Holiday Training Course (HTC '26)</h2>
          <p style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; margin: 6px 0 0 0; font-weight: 700;">MSSN Ikeja Area Council</p>
        </div>
        
        <p style="font-size: 15px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 16px;">
          Assalam alaykum ${delegateName},
        </p>
        
        <p style="font-size: 14px; margin-bottom: 16px; color: #334155;">
          Alhamdulillah! Your registration for the HTC Camp is officially complete and confirmed. We are absolutely thrilled to have you join us. 
        </p>

        <p style="font-size: 14px; margin-bottom: 24px; color: #334155;">
          To help you hit the ground running, your custom delegate profile has been created. Here is everything you need to know to access your portal and check in on day one:
        </p>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; font-weight: 700; color: #0f766e;">
            🔑 Your Login & Camp Credentials
          </h3>
          <ul style="margin: 0; padding-left: 20px; font-size: 13.5px; color: #334155; line-height: 1.8;">
            <li style="margin-bottom: 8px;"><strong>Your Delegate ID:</strong> <span style="font-family: monospace; font-weight: 700; color: #0f172a;">${delegateId}</span></li>
            <li style="margin-bottom: 8px;"><strong>Your Assigned House:</strong> House ${houseName}</li>
            <li style="margin-bottom: 0;"><strong>Login Email:</strong> <span style="color: #0f172a; font-weight: 600;">${delegateEmail}</span> <span style="color: #64748b; font-size: 12px;">(This email address serves as your username)</span></li>
          </ul>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; padding: 20px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; font-weight: 700; color: #0f766e;">
            🌐 Access Your Delegate Portal
          </h3>
          <p style="font-size: 13.5px; margin: 0 0 16px 0; color: #115e59;">
            Your personalized camp dashboard is now live! You can log in to view your schedule, track house points, and access camp resources:
          </p>
          <div style="text-align: center; margin: 15px 0;">
            <a href="https://htc-camp-portal.vercel.app" style="display: inline-block; padding: 12px 24px; background-color: #0f766e; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 8px; box-shadow: 0 2px 4px rgba(15, 118, 110, 0.2);">
              🔗 Go to your Portal
            </a>
          </div>
          <div style="margin-top: 16px; padding: 12px; background-color: #ffffff; border-left: 4px solid #0f766e; border-radius: 4px; font-size: 12px; color: #334155; line-height: 1.5;">
            <strong>Quick Tip:</strong> We highly recommend bookmarking this link on your phone's home screen so you can quickly pull up your Delegate ID at the physical check-in counter when you arrive at camp.
          </div>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

        <p style="font-size: 13.5px; margin-bottom: 20px; color: #334155;">
          If you have any questions or need to make updates to your registration details, simply reply directly to this email or reach out to the organizing team.
        </p>

        <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 24px;">
          Get ready for an unforgettable camp experience!
        </p>

        <div style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          Best regards,<br /><br />
          <strong style="color: #0f172a;">The HTC Camp Organizing Team</strong><br />
          <span style="font-size: 12px;">Connecting Tech, Faith, and Community.</span>
        </div>
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
        to: delegateEmail,
        subject: `${delegateName}! 🏕️ Here is your Portal Access`,
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
