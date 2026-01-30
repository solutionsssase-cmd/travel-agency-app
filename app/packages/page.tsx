import { getDb, mapPackage } from "@/lib/db";
import PackageCard from "@/components/package-card";

export const metadata = {
  title: "Travel Packages | Wanderly Travel Agency",
  description: "Browse curated travel packages, itineraries, and pricing."
};

export default function PackagesPage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM packages ORDER BY created_at DESC").all();
  const packages = rows.map(mapPackage);

  return (
    <section className="container py-14">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
          Packages
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">
          Find your next escape
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Each journey includes curated stays, immersive experiences, and seamless
          logistics with our on-ground concierge team.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
