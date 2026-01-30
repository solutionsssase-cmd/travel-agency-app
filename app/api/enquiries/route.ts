import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, message, packageId } = body;

  if (!name || !email || !phone || !message) {
    return NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
  }

  const db = getDb();
  db.prepare(
    `INSERT INTO enquiries (name, email, phone, message, package_id)
     VALUES (?, ?, ?, ?, ?)`
  ).run(name, email, phone, message, packageId || null);

  return NextResponse.json({ message: "Enquiry submitted" }, { status: 201 });
}
