import { NextResponse } from "next/server";
import { getDb, mapPackage } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const rows = db.prepare("SELECT * FROM packages ORDER BY created_at DESC").all();
  return NextResponse.json({ packages: rows.map(mapPackage) });
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    location,
    durationDays,
    price,
    summary,
    highlights,
    itinerary,
    heroImage
  } = body;

  if (!title || !location || !durationDays || !price || !summary) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const db = getDb();
  const slug = slugify(title);

  const info = db
    .prepare(
      `INSERT INTO packages
        (slug, title, location, duration_days, price, summary, highlights, itinerary, hero_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      slug,
      title,
      location,
      Number(durationDays),
      Number(price),
      summary,
      JSON.stringify(highlights || []),
      JSON.stringify(itinerary || []),
      heroImage || "/images/bali.svg"
    );

  const created = db
    .prepare("SELECT * FROM packages WHERE id = ?")
    .get(info.lastInsertRowid);

  return NextResponse.json({ package: mapPackage(created as Record<string, unknown>) });
}
