import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadPayload = {
  email?: string;
  source_page?: string;
  source_card?: string | null;
};

export async function POST(request: Request) {
  let payload: LeadPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const sourcePage = payload.source_page?.trim() || "unknown";
  const sourceCard = payload.source_card?.trim() || null;

  if (!email || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Lead capture is not configured yet." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("captured_emails").insert({
    email,
    source_page: sourcePage,
    source_card: sourceCard,
  });

  if (error) {
    console.error("Supabase lead insert failed:", error.message);
    return NextResponse.json(
      { error: "We could not save that request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
