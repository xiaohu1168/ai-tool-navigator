"use client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdInContent from "@/components/AdBanner";

export default function SubmitPage() {
  const [form, setForm] = useState({ name: "", url: "", description: "", category_id: "coding", price: "", tags: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setStatus("success"); setForm({ name: "", url: "", description: "", category_id: "coding", price: "", tags: "" }); }
      else { setStatus("error: " + (data.error || "Unknown error")); }
    } catch { setStatus("error: Network error"); }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-3 md:px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Submit a Tool</h1>
        <p className="text-gray-600 mb-8">Help us grow the AI tool directory.</p>
        {status === "success" && <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">Tool submitted successfully! It will be reviewed within 24 hours.</div>}
        {status.startsWith("error") && <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">{status}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium mb-1">Tool Name *</label><input name="name" required value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Cursor" /></div>
          <div><label className="block text-sm font-medium mb-1">Website URL *</label><input name="url" required type="url" value={form.url} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://cursor.sh" /></div>
          <div><label className="block text-sm font-medium mb-1">Description *</label><textarea name="description" required value={form.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Brief description" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Category *</label><select name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="coding">Coding</option><option value="writing">Writing</option><option value="design">Design</option><option value="seo">SEO</option><option value="marketing">Marketing</option><option value="devops">DevOps</option><option value="productivity">Productivity</option><option value="voice">Voice</option><option value="video">Video</option><option value="analytics">Analytics</option><option value="education">Education</option><option value="customer-service">Customer Service</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Price</label><input name="price" value={form.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Free" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Tags (comma-separated)</label><input name="tags" value={form.tags} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="coding, ai, editor" /></div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 btn-solid">{loading ? "Submitting..." : "Submit Tool"}</button>
        </form>
        <AdInContent />
      </main>
      <Footer />
    </div>
  );
}