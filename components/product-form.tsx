"use client";

import { useEffect, useRef, useState } from "react";
import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/products";

type ProductFormProps = {
  product?: Product | null;
  onSaved?: () => void;
  onCancelEdit?: () => void;
};

export function ProductForm({ product, onSaved, onCancelEdit }: ProductFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(product);

  useEffect(() => {
    setMessage("");
    if (product) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [product]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const monthValue = String(formData.get("periodeProduksi") ?? "");
    const [year, month] = monthValue.split("-");

    const response = await fetch(isEditing ? `/api/products/${product?.id}` : "/api/products", {
      method: isEditing ? "PUT" : "POST",
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

    setMessage(isEditing ? "Produk berhasil diperbarui." : "Produk berhasil disimpan.");
    if (!isEditing) {
      event.currentTarget.reset();
    }
    setIsLoading(false);
    onSaved?.();
  }

  return (
    <form ref={formRef} key={product?.id ?? "new-product"} className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nama Produk" id="name" placeholder="Gamis Seragam Biru" defaultValue={product?.name} />
        <Field label="Kategori" id="category" placeholder="Gamis" defaultValue={product?.category} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Detail bahan, ukuran, model, dan catatan produksi..."
          defaultValue={product?.description}
        />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Field label="Kode Produksi" id="kodeProduksi" placeholder="GMS-1024-01" defaultValue={product?.kodeProduksi} />
        <Field
          label="Periode"
          id="periodeProduksi"
          type="month"
          defaultValue={toMonthInputValue(product?.periodeProduksi)}
        />
        <Field label="Harga" id="harga" type="number" placeholder="150000" defaultValue={product?.harga ? String(product.harga) : undefined} />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <SelectField label="Media Type" id="mediaType" options={["image", "video"]} defaultValue={product?.mediaType} />
        <SelectField label="Status" id="stockStatus" options={["Ready", "Preorder", "Terbatas"]} defaultValue={product?.stockStatus} />
        <Field label="Material" id="material" placeholder="Toyobo premium" defaultValue={product?.material} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Ukuran" id="sizes" placeholder="S, M, L, XL" defaultValue={product?.sizes.join(", ")} />
        <Field label="Warna" id="colors" placeholder="Sky Blue, Navy" defaultValue={product?.colors.join(", ")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Link Gambar / Video</Label>
        <Input
          id="mediaUrl"
          name="mediaUrl"
          placeholder="https://www.instagram.com/reel/..."
          defaultValue={product?.mediaUrl}
        />
      </div>
      {message ? (
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
          {message}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isLoading}>
          <Save />
          {isLoading ? "Menyimpan..." : isEditing ? "Update Produk" : "Simpan Produk"}
        </Button>
        {isEditing ? (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            <X />
            Batal Edit
          </Button>
        ) : (
          <Button type="button" variant="outline">
            Preview
          </Button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  defaultValue,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} type={type} placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
  defaultValue,
}: {
  label: string;
  id: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={id}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function toMonthInputValue(value?: string) {
  if (!value) {
    return undefined;
  }

  const [month, year] = value.split("-");
  return month && year ? `${year}-${month}` : undefined;
}
