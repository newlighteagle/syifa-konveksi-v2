"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductDetailMedia } from "@/components/product-media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/products";

type ProductFormProps = {
  product?: Product | null;
  categories: Array<{ id: string; name: string }>;
  colors: Array<{ id: string; name: string }>;
  submitLabel?: string;
  successRedirectPath?: string;
  onCancelEdit?: () => void;
};

export function ProductForm({
  product,
  categories,
  colors,
  submitLabel,
  successRedirectPath = "/admin/products",
  onCancelEdit,
}: ProductFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<string[]>([]);
  const [categoryMode, setCategoryMode] = useState<"select" | "new">("select");
  const [selectedCategory, setSelectedCategory] = useState(product?.category ?? "");
  const [selectedColors, setSelectedColors] = useState<string[]>(product?.colors ?? []);
  const isEditing = Boolean(product);

  useEffect(() => {
    setMessage("");
    setSelectedCategory(product?.category ?? "");
    setSelectedColors(product?.colors ?? []);
    setCategoryMode(product?.category && !categories.some((category) => category.name === product.category) ? "new" : "select");
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
        category:
          categoryMode === "new"
            ? formData.get("newCategory")
            : formData.get("category"),
        description: formData.get("description"),
        mediaType: "video",
        mediaUrl: formData.get("mediaUrl"),
        galleryUrls: parseList(formData.get("galleryUrls")),
        kodeProduksi: formData.get("kodeProduksi"),
        periodeProduksi: month && year ? `${month}-${year}` : monthValue,
        harga: formData.get("harga"),
        stockStatus: formData.get("stockStatus"),
        material: formData.get("material"),
        sizes: String(formData.get("sizes") ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        colors: [
          ...selectedColors,
          ...parseList(formData.get("newColors")),
        ],
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
    router.push(successRedirectPath);
    router.refresh();
  }

  return (
    <form ref={formRef} key={product?.id ?? "new-product"} className="grid gap-5" onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nama Produk" id="name" placeholder="Gamis Seragam Biru" defaultValue={product?.name} />
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            name="category"
            value={categoryMode === "new" ? "__new" : selectedCategory}
            onChange={(event) => {
              if (event.target.value === "__new") {
                setCategoryMode("new");
                return;
              }

              setCategoryMode("select");
              setSelectedCategory(event.target.value);
            }}
            className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100"
          >
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
            <option value="__new">+ Buat kategori baru</option>
          </select>
          {categoryMode === "new" ? (
            <Input
              name="newCategory"
              placeholder="Nama kategori baru"
              defaultValue={product?.category}
            />
          ) : null}
        </div>
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
      <div className="grid gap-5 md:grid-cols-2">
        <SelectField label="Status" id="stockStatus" options={["Ready", "Preorder", "Terbatas"]} defaultValue={product?.stockStatus} />
        <Field label="Material" id="material" placeholder="Toyobo premium" defaultValue={product?.material} />
      </div>
      <div className="grid gap-5">
        <Field label="Ukuran" id="sizes" placeholder="S, M, L, XL" defaultValue={product?.sizes.join(", ")} />
        <div className="space-y-2">
          <Label>Warna</Label>
          <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
            {colors.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada warna tersimpan.</p>
            ) : null}
            {colors.map((color) => (
              <label key={color.id} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-sky-600"
                  checked={selectedColors.includes(color.name)}
                  onChange={(event) => {
                    setSelectedColors((current) =>
                      event.target.checked
                        ? Array.from(new Set([...current, color.name]))
                        : current.filter((item) => item !== color.name),
                    );
                  }}
                />
                {color.name}
              </label>
            ))}
          </div>
          <Input
            name="newColors"
            placeholder="Tambah warna baru, pisahkan koma. Contoh: Navy, Hitam"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Link Media Utama</Label>
        <Input
          id="mediaUrl"
          name="mediaUrl"
          placeholder="https://www.instagram.com/reel/..."
          defaultValue={product?.mediaUrl}
        />
        <p className="text-xs leading-5 text-slate-500">
          Media utama selalu video. Tempel link Instagram Reel atau link video langsung.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="galleryUrls">Link Galeri Tambahan</Label>
        <Textarea
          id="galleryUrls"
          name="galleryUrls"
          placeholder={"Satu link per baris, contoh:\nhttps://www.instagram.com/p/...\nhttps://example.com/foto-1.jpg\nhttps://example.com/foto-2.jpg"}
          defaultValue={product?.galleryUrls.join("\n")}
        />
        <p className="text-xs leading-5 text-slate-500">
          Galeri tambahan digunakan untuk foto. Isi satu link foto per baris.
        </p>
      </div>
      {showPreview ? (
        <div className="grid gap-3 rounded-lg border border-sky-100 bg-sky-50/50 p-4">
          <p className="text-sm font-bold text-slate-950">Preview media</p>
          {previewMedia.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada link media untuk dipreview.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {previewMedia.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative aspect-[4/5] overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <ProductDetailMedia
                    name={`Preview ${index + 1}`}
                    mediaType={index === 0 ? "video" : "image"}
                    mediaUrl={url}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
          {message}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isLoading}>
          <Save />
          {isLoading ? "Menyimpan..." : submitLabel ?? (isEditing ? "Update Produk" : "Simpan Produk")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!formRef.current) {
              return;
            }

            const formData = new FormData(formRef.current);
            setPreviewMedia([
              String(formData.get("mediaUrl") ?? "").trim(),
              ...parseList(formData.get("galleryUrls")),
            ].filter(Boolean));
            setShowPreview((value) => !value);
          }}
        >
          <Eye />
          Preview
        </Button>
        {isEditing ? (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            <X />
            Batal Edit
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function parseList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
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
