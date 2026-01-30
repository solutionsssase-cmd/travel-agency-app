import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = db
    .prepare(
      `SELECT enquiries.*, packages.title as package_title
       FROM enquiries
       LEFT JOIN packages ON packages.id = enquiries.package_id
       ORDER BY enquiries.created_at DESC`
    )
    .all();

  return NextResponse.json({ enquiries: rows });
}
