import { NextResponse } from "next/server";
import { clearSession, createSession, getAdminCredentials } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;
  const creds = getAdminCredentials();

  if (email !== creds.email || password !== creds.password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  createSession(email);
  return NextResponse.json({ message: "Authenticated" });
}

export async function DELETE() {
  clearSession();
  return NextResponse.json({ message: "Logged out" });
}
