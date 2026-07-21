import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Email service disabled as requested (no longer using Resend)
  return NextResponse.json({ success: true, message: "Email service disabled." });
}
