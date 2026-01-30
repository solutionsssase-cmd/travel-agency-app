import { NextResponse } from "next/server";
import { getDb, mapPackage } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM packages WHERE slug = ? OR id = ?")
    .get(params.id, Number(params.id));

  if (!row) {
    return NextResponse.json({ message: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ package: mapPackage(row as Record<string, unknown>) });
}
