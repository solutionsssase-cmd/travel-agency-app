import Image from "next/image";
import Link from "next/link";
import { getDb, mapPackage } from "@/lib/db";
import EnquiryForm from "@/components/enquiry-form";

export default function PackageDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM packages WHERE slug = ?")
    .get(params.slug);

  if (!row) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-semibold">Package not found</h1>
        <Link href="/packages" className="mt-4 inline-block text-brand-600">
          Back to packages
        </Link>
      </div>
    );
  }

  const pkg = mapPackage(row as Record<string, unknown>);

  return (
    <div>
      <section className="bg-white">
        <div className="container grid gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
              {pkg.location}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {pkg.title}
            </h1>
            <p className="mt-4 text-sm text-slate-600">{pkg.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="rounded-full bg-brand-50 px-4 py-2 font-medium text-brand-700">
                {pkg.durationDays} days
              </span>
              <span className="text-lg font-semibold text-brand-700">
                ${pkg.price.toLocaleString()}
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-slate-900">Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {pkg.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg">
              <Image
                src={pkg.heroImage}
                alt={pkg.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["/images/experience-1.svg", "/images/experience-2.svg"].map(
                (image) => (
                  <div
                    key={image}
                    className="relative h-32 overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={image}
                      alt="Travel experience"
                      fill
                      className="object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="section-title">Itinerary</h2>
            <ol className="mt-4 space-y-4">
              {pkg.itinerary.map((day, index) => (
                <li
                  key={day}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                    Day {index + 1}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{day}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Package pricing
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                From
                <span className="ml-2 text-2xl font-semibold text-brand-700">
                  ${pkg.price.toLocaleString()}
                </span>
                <span className="ml-1 text-xs text-slate-500">
                  per traveler
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Boutique accommodations</li>
                <li>• Private transfers</li>
                <li>• Guided experiences</li>
                <li>• Breakfast daily</li>
              </ul>
            </div>
            <div className="mt-6">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                  Plan this trip
                </p>
                <h3 className="text-xl font-semibold text-slate-900">
                  Request availability
                </h3>
              </div>
              <EnquiryForm packages={[pkg]} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
