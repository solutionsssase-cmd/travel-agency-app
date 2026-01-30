import Link from "next/link";
import Image from "next/image";
import type { TravelPackage } from "@/lib/db";

export default function PackageCard({ pkg }: { pkg: TravelPackage }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            {pkg.location}
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{pkg.title}</h3>
        </div>
        <p className="text-sm text-slate-600">{pkg.summary}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">
            {pkg.durationDays} days
          </span>
          <span className="text-base font-semibold text-brand-700">
            ${pkg.price.toLocaleString()}
          </span>
        </div>
        <Link
          href={`/packages/${pkg.slug}`}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          View itinerary
        </Link>
      </div>
    </article>
  );
}
