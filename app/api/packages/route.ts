import { NextResponse } from "next/server";
import { getDb, mapPackage } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM packages ORDER BY created_at DESC").all();
  const packages = rows.map(mapPackage);
  return NextResponse.json({ packages });
}
