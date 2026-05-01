"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronsUpDown, Eye, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductDetailMedia } from "@/components/product-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

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
  const [colorSearch, setColorSearch] = useState("");
  const isEditing = Boolean(product);

  useEffect(() => {
    setMessage("");
    setSelectedCategory(product?.category ?? "");
    setSelectedColors(product?.colors ?? []);
    setColorSearch("");
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
      setSelectedColors([]);
      setColorSearch("");
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
        <ColorCombobox
          colors={colors}
          search={colorSearch}
          selectedColors={selectedColors}
          setSearch={setColorSearch}
          setSelectedColors={setSelectedColors}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Link Media Utama</Label>
        <Input
          id="mediaUrl"
          name="mediaUrl"
          placeholder="https://www.youtube.com/shorts/T9X5KVfryAY"
          defaultValue={product?.mediaUrl}
        />
        <p className="text-xs leading-5 text-slate-500">
          Media utama selalu video. Tempel link YouTube Shorts, Instagram Reel, atau link video langsung.
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

function ColorCombobox({
  colors,
  search,
  selectedColors,
  setSearch,
  setSelectedColors,
}: {
  colors: Array<{ id: string; name: string }>;
  search: string;
  selectedColors: string[];
  setSearch: (value: string) => void;
  setSelectedColors: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [open, setOpen] = useState(false);
  const normalizedSearch = normalizeOptionName(search);
  const filteredColors = colors.filter((color) =>
    color.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const canCreateColor =
    normalizedSearch.length > 0 &&
    !colors.some((color) => color.name.toLowerCase() === normalizedSearch.toLowerCase()) &&
    !selectedColors.some((color) => color.toLowerCase() === normalizedSearch.toLowerCase());

  function toggleColor(colorName: string) {
    setSelectedColors((current) =>
      current.includes(colorName)
        ? current.filter((item) => item !== colorName)
        : [...current, colorName],
    );
  }

  function createColor() {
    if (!canCreateColor) {
      return;
    }

    setSelectedColors((current) => [...current, normalizedSearch]);
    setSearch("");
  }

  return (
    <div className="space-y-2">
      <Label>Warna</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto min-h-11 w-full justify-between bg-slate-50 px-3 py-2 font-medium text-slate-700 hover:bg-white"
          >
            <span className="line-clamp-1 text-left">
              {selectedColors.length > 0
                ? `${selectedColors.length} warna dipilih`
                : "Pilih warna produk"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Cari atau buat warna..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {filteredColors.length === 0 && !canCreateColor ? (
                <CommandEmpty>Warna tidak ditemukan.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {filteredColors.map((color) => {
                  const isSelected = selectedColors.includes(color.name);

                  return (
                    <CommandItem
                      key={color.id}
                      value={color.name}
                      onSelect={() => toggleColor(color.name)}
                    >
                      <Check
                        className={cn(
                          "size-4 text-sky-700",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{color.name}</span>
                    </CommandItem>
                  );
                })}
                {canCreateColor ? (
                  <CommandItem value={normalizedSearch} onSelect={createColor}>
                    <Plus className="size-4 text-sky-700" />
                    <span>Buat warna "{normalizedSearch}"</span>
                  </CommandItem>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedColors.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedColors.map((color) => (
            <Badge key={color} variant="secondary" className="gap-2 pr-2">
              {color}
              <button
                type="button"
                className="rounded-full text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-100"
                aria-label={`Hapus warna ${color}`}
                onClick={() => {
                  setSelectedColors((current) => current.filter((item) => item !== color));
                }}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs leading-5 text-slate-500">
          Pilih beberapa warna dari daftar, atau ketik nama warna baru lalu pilih opsi buat warna.
        </p>
      )}
    </div>
  );
}

function normalizeOptionName(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
