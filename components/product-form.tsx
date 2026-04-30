"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const monthValue = String(formData.get("periodeProduksi") ?? "");
    const [year, month] = monthValue.split("-");

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        category: formData.get("category"),
        description: formData.get("description"),
        mediaType: formData.get("mediaType"),
        mediaUrl: formData.get("mediaUrl"),
        kodeProduksi: formData.get("kodeProduksi"),
        periodeProduksi: month && year ? `${month}-${year}` : monthValue,
        harga: formData.get("harga"),
        stockStatus: formData.get("stockStatus"),
        material: formData.get("material"),
        sizes: String(formData.get("sizes") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        colors: String(formData.get("colors") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.message ?? "Produk belum bisa disimpan.");
      setIsLoading(false);
      return;
    }

    setMessage("Produk berhasil disimpan. Refresh halaman untuk melihat data terbaru.");
    event.currentTarget.reset();
    setIsLoading(false);
  }

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nama Produk" id="name" placeholder="Gamis Seragam Biru" />
        <Field label="Kategori" id="category" placeholder="Gamis" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Detail bahan, ukuran, model, dan catatan produksi..."
        />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Kode Produksi" id="kodeProduksi" placeholder="GMS-1024-01" />
        <Field label="Periode" id="periodeProduksi" type="month" />
        <Field label="Harga" id="harga" type="number" placeholder="150000" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <SelectField label="Media Type" id="mediaType" options={["image", "video"]} />
        <SelectField label="Status" id="stockStatus" options={["Ready", "Preorder", "Terbatas"]} />
        <Field label="Material" id="material" placeholder="Toyobo premium" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ukuran" id="sizes" placeholder="S, M, L, XL" />
        <Field label="Warna" id="colors" placeholder="Sky Blue, Navy" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Link Gambar / Video</Label>
        <Input id="mediaUrl" name="mediaUrl" placeholder="https://images.unsplash.com/..." />
      </div>
      {message ? (
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
          {message}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isLoading}>
          <Save />
          {isLoading ? "Menyimpan..." : "Simpan Produk"}
        </Button>
        <Button type="button" variant="outline">
          Preview
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} />
    </div>
  );
}

function SelectField({ label, id, options }: { label: string; id: string; options: string[] }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
