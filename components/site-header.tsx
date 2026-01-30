import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="text-xl font-semibold text-brand-700">
          Wanderly
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/packages" className="hover:text-brand-700">
            Packages
          </Link>
          <Link href="/#enquiry" className="hover:text-brand-700">
            Enquiry
          </Link>
          <Link
            href="/admin/login"
            className="rounded-full border border-brand-600 px-4 py-2 text-brand-700 hover:bg-brand-50"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
