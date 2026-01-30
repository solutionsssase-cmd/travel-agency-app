import Link from "next/link";
import Image from "next/image";
import { getDb, mapPackage } from "@/lib/db";
import PackageCard from "@/components/package-card";
import EnquiryForm from "@/components/enquiry-form";

export default function HomePage() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM packages ORDER BY created_at DESC").all();
  const packages = rows.map(mapPackage);

  return (
    <div>
      <section className="bg-gradient-to-br from-white via-brand-50 to-white">
        <div className="container grid gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              Wanderly Travel Agency
            </p>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Curated escapes for modern explorers.
            </h1>
            <p className="text-lg text-slate-600">
              We design premium itineraries that blend immersive culture, comfort,
              and local experiences. Explore our handpicked journeys or request a
              bespoke plan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/packages"
                className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Explore packages
              </Link>
              <Link
                href="#enquiry"
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
              >
                Plan my trip
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Happy travelers", value: "6,200+" },
                { label: "Destinations", value: "24" },
                { label: "Average rating", value: "4.9/5" }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 text-center"
                >
                  <p className="text-xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/hero.svg"
              alt="Travelers overlooking a scenic coastline"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title">Featured packages</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Our signature getaways combine comfort-forward stays, immersive
              culture, and guided adventures.
            </p>
          </div>
          <Link
            href="/packages"
            className="text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            View all packages →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <h2 className="section-title">Why travel with Wanderly</h2>
            <p className="text-sm text-slate-600">
              We work with vetted local partners, boutique accommodations, and
              expert guides to deliver seamless itineraries. Expect round-the-
              clock support and surprise moments tailored to your travel style.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                "Dedicated travel designer for every booking",
                "Flexible payment plans and transparent pricing",
                "24/7 on-trip concierge support",
                "Sustainability-first partner network"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="enquiry">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Start planning
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                Tell us about your next trip
              </h3>
            </div>
            <EnquiryForm packages={packages} />
          </div>
        </div>
      </section>
    </div>
  );
}
