"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TravelPackage } from "@/lib/db";

type Enquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  package_title?: string;
  created_at: string;
};

const emptyPackage = {
  title: "",
  location: "",
  durationDays: 1,
  price: 0,
  summary: "",
  highlights: "",
  itinerary: "",
  heroImage: ""
};

export default function AdminDashboard() {
  const router = useRouter();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyPackage);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const currentPackage = useMemo(() => {
    if (!editingId) return null;
    return packages.find((pkg) => pkg.id === editingId) || null;
  }, [editingId, packages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [packagesRes, enquiriesRes] = await Promise.all([
          fetch("/api/admin/packages"),
          fetch("/api/admin/enquiries")
        ]);

        if (packagesRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        const packageData = await packagesRes.json();
        const enquiryData = await enquiriesRes.json();
        setPackages(packageData.packages || []);
        setEnquiries(enquiryData.enquiries || []);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  useEffect(() => {
    if (currentPackage) {
      setForm({
        title: currentPackage.title,
        location: currentPackage.location,
        durationDays: currentPackage.durationDays,
        price: currentPackage.price,
        summary: currentPackage.summary,
        highlights: currentPackage.highlights.join("\n"),
        itinerary: currentPackage.itinerary.join("\n"),
        heroImage: currentPackage.heroImage
      });
    } else {
      setForm(emptyPackage);
    }
  }, [currentPackage]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: Number(event.target.value)
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const payload = {
      title: form.title,
      location: form.location,
      durationDays: form.durationDays,
      price: form.price,
      summary: form.summary,
      highlights: form.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      itinerary: form.itinerary
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      heroImage: form.heroImage
    };

    const response = await fetch(
      editingId ? `/api/admin/packages/${editingId}` : "/api/admin/packages",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      setStatus("Unable to save package.");
      return;
    }

    const data = await response.json();
    if (editingId) {
      setPackages((prev) =>
        prev.map((pkg) => (pkg.id === editingId ? data.package : pkg))
      );
    } else {
      setPackages((prev) => [data.package, ...prev]);
    }
    setEditingId(null);
    setStatus("Package saved!");
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/admin/packages/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      if (editingId === id) {
        setEditingId(null);
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      setForm((prev) => ({ ...prev, heroImage: data.url }));
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <section className="container py-20">
        <p className="text-sm text-slate-600">Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="container py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Manage packages & enquiries
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
        >
          Log out
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit package" : "Add a new package"}
            </h2>
            <form className="mt-4 space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="durationDays"
                  >
                    Duration (days)
                  </label>
                  <input
                    id="durationDays"
                    name="durationDays"
                    type="number"
                    min={1}
                    value={form.durationDays}
                    onChange={handleNumberChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="price">
                    Price (USD)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={handleNumberChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="summary">
                  Summary
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={form.summary}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="highlights"
                  >
                    Highlights (one per line)
                  </label>
                  <textarea
                    id="highlights"
                    name="highlights"
                    value={form.highlights}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    rows={5}
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-medium text-slate-700"
                    htmlFor="itinerary"
                  >
                    Itinerary (one per line)
                  </label>
                  <textarea
                    id="itinerary"
                    name="itinerary"
                    value={form.itinerary}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    rows={5}
                  />
                </div>
              </div>
              <div>
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="heroImage"
                >
                  Hero image URL
                </label>
                <input
                  id="heroImage"
                  name="heroImage"
                  value={form.heroImage}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <div className="mt-3 flex items-center gap-4">
                  <input type="file" accept="image/*" onChange={handleUpload} />
                  {form.heroImage && (
                    <span className="text-xs text-slate-500">
                      Uploaded: {form.heroImage}
                    </span>
                  )}
                </div>
              </div>
              {status && <p className="text-sm text-emerald-600">{status}</p>}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  {editingId ? "Update package" : "Create package"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Packages</h2>
            <div className="mt-4 space-y-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {pkg.title}
                      </p>
                      <p className="text-xs text-slate-500">{pkg.location}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-700">
                      ${pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingId(pkg.id)}
                      className="text-xs font-semibold text-brand-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-xs font-semibold text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Enquiries</h2>
            <div className="mt-4 space-y-4">
              {enquiries.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {lead.email} · {lead.phone}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {lead.package_title && (
                    <p className="mt-2 text-xs font-semibold text-brand-600">
                      Package: {lead.package_title}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-slate-600">{lead.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
