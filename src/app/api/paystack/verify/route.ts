import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ status: false, message: "No reference provided" }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ status: false, message: "Server misconfiguration" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.status) {
      return NextResponse.json(
        { status: false, message: data.message || "Verification failed" },
        { status: 400 }
      );
    }

    const tx = data.data;

    return NextResponse.json({
      status: true,
      data: {
        reference: tx.reference,
        paymentStatus: tx.status, // "success" | "failed" | "abandoned"
        amount: tx.amount / 100, // Paystack sends in kobo
        email: tx.customer?.email,
        paidAt: tx.paid_at,
        channel: tx.channel,
        currency: tx.currency,
      },
    });
  } catch (err) {
    console.error("Paystack verify error:", err);
    return NextResponse.json({ status: false, message: "Network error" }, { status: 500 });
  }
}
