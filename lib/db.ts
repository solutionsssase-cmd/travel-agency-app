import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export type TravelPackage = {
  id: number;
  slug: string;
  title: string;
  location: string;
  durationDays: number;
  price: number;
  summary: string;
  highlights: string[];
  itinerary: string[];
  heroImage: string;
};

export type EnquiryLead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  packageId: number | null;
  createdAt: string;
};

const DB_PATH = path.join(process.cwd(), "data", "travel.sqlite");
let db: Database.Database | null = null;

function ensureDbDirectory() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getDb() {
  if (!db) {
    ensureDbDirectory();
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initDb();
  }
  return db;
}

function initDb() {
  if (!db) {
    return;
  }
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      price INTEGER NOT NULL,
      summary TEXT NOT NULL,
      highlights TEXT NOT NULL,
      itinerary TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      message TEXT NOT NULL,
      package_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(package_id) REFERENCES packages(id)
    );
  `);

  const countRow = db.prepare("SELECT COUNT(*) as count FROM packages").get() as {
    count: number;
  };

  if (countRow.count === 0) {
    const insert = db.prepare(`
      INSERT INTO packages (slug, title, location, duration_days, price, summary, highlights, itinerary, hero_image)
      VALUES (@slug, @title, @location, @durationDays, @price, @summary, @highlights, @itinerary, @heroImage)
    `);

    const seedData: Array<Omit<TravelPackage, "id">> = [
      {
        slug: "bali-wellness-retreat",
        title: "Bali Wellness Retreat",
        location: "Ubud, Bali",
        durationDays: 7,
        price: 1499,
        summary:
          "Reset with sunrise yoga, private villa stays, and curated wellness experiences in Ubud.",
        highlights: [
          "Luxury rainforest villa with private plunge pool",
          "Daily yoga and sound healing sessions",
          "Private temple and waterfall excursion"
        ],
        itinerary: [
          "Day 1: Arrival and spa welcome ritual",
          "Day 2: Morning yoga and Ubud artisan market tour",
          "Day 3: Waterfall trek and meditation workshop",
          "Day 4: Cooking class and rice terrace cycling",
          "Day 5: Free leisure day with spa credits",
          "Day 6: Private temple purification ceremony",
          "Day 7: Departure and wellness take-home kit"
        ],
        heroImage: "/images/bali.svg"
      },
      {
        slug: "iceland-northern-lights",
        title: "Iceland Northern Lights Explorer",
        location: "Reykjavík, Iceland",
        durationDays: 5,
        price: 1890,
        summary:
          "Chase the aurora with glacier hikes, geothermal lagoons, and cozy boutique stays.",
        highlights: [
          "Aurora hunting with expert guides",
          "Golden Circle and glacier lagoon tour",
          "Sky Lagoon entry with private transfer"
        ],
        itinerary: [
          "Day 1: Arrival in Reykjavík with sky lagoon soak",
          "Day 2: Golden Circle tour and hot springs",
          "Day 3: South coast waterfalls and black sand beach",
          "Day 4: Glacier lagoon boat ride and aurora night",
          "Day 5: Departure with optional Blue Lagoon visit"
        ],
        heroImage: "/images/iceland.svg"
      },
      {
        slug: "morocco-desert-glamping",
        title: "Morocco Desert Glamping",
        location: "Marrakesh, Morocco",
        durationDays: 6,
        price: 1325,
        summary:
          "Experience Sahara glamping, private souk tours, and sunset camel rides.",
        highlights: [
          "Luxury desert camp with chef-prepared meals",
          "Guided Marrakesh souk tour",
          "Sunset camel ride with tea ceremony"
        ],
        itinerary: [
          "Day 1: Arrive in Marrakesh and rooftop dinner",
          "Day 2: Atlas Mountains road trip",
          "Day 3: Camel caravan to desert camp",
          "Day 4: Sunrise yoga and sandboarding",
          "Day 5: Ouarzazate kasbah tour",
          "Day 6: Departure"
        ],
        heroImage: "/images/morocco.svg"
      }
    ];

    const insertMany = db.transaction((packages: typeof seedData) => {
      for (const pkg of packages) {
        insert.run({
          ...pkg,
          highlights: JSON.stringify(pkg.highlights),
          itinerary: JSON.stringify(pkg.itinerary)
        });
      }
    });

    insertMany(seedData);
  }
}

export function mapPackage(row: Record<string, unknown>): TravelPackage {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    location: row.location as string,
    durationDays: row.duration_days as number,
    price: row.price as number,
    summary: row.summary as string,
    highlights: JSON.parse(row.highlights as string),
    itinerary: JSON.parse(row.itinerary as string),
    heroImage: row.hero_image as string
  };
}
