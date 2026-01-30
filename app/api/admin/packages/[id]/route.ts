import { NextResponse } from "next/server";
import { getDb, mapPackage } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM packages WHERE id = ?")
    .get(Number(params.id));

  if (!existing) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const updated = {
    title: body.title ?? existing.title,
    location: body.location ?? existing.location,
    duration_days: body.durationDays ?? existing.duration_days,
    price: body.price ?? existing.price,
    summary: body.summary ?? existing.summary,
    highlights: JSON.stringify(body.highlights ?? JSON.parse(existing.highlights)),
    itinerary: JSON.stringify(body.itinerary ?? JSON.parse(existing.itinerary)),
    hero_image: body.heroImage ?? existing.hero_image
  };

  db.prepare(
    `UPDATE packages
     SET title = @title,
         location = @location,
         duration_days = @duration_days,
         price = @price,
         summary = @summary,
         highlights = @highlights,
         itinerary = @itinerary,
         hero_image = @hero_image
     WHERE id = @id`
  ).run({ id: Number(params.id), ...updated });

  const row = db
    .prepare("SELECT * FROM packages WHERE id = ?")
    .get(Number(params.id));

  return NextResponse.json({ package: mapPackage(row as Record<string, unknown>) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  db.prepare("DELETE FROM packages WHERE id = ?").run(Number(params.id));
  return NextResponse.json({ message: "Deleted" });
}
