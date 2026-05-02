"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ManagedOption } from "@/lib/product-service";

type AdminOptionManagerProps = {
  title: string;
  label: string;
  endpoint: string;
  options: ManagedOption[];
  emptyMessage: string;
  placeholder: string;
};

type FieldErrors = Record<string, string[] | undefined>;

export function AdminOptionManager({
  title,
  label,
  endpoint,
  options,
  emptyMessage,
  placeholder,
}: AdminOptionManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(options);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function createOption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setFieldErrors({});

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.message ?? `${label} belum bisa ditambahkan.`);
      setFieldErrors(body?.errors ?? {});
      setIsSaving(false);
      return;
    }

    const created = body?.category ?? body?.color;
    setItems((current) =>
      [...current, { id: created.id, name: created.name, productCount: 0 }].sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    );
    setName("");
    setMessage(`${label} berhasil ditambahkan.`);
    setIsSaving(false);
    router.refresh();
  }

  async function deleteOption(option: ManagedOption) {
    setDeletingId(option.id);
    setMessage("");
    setFieldErrors({});

    const response = await fetch(`${endpoint}/${option.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(body?.message ?? `${label} belum bisa dihapus.`);
      setDeletingId(null);
      return;
    }

    setItems((current) => current.filter((item) => item.id !== option.id));
    setMessage(`${label} berhasil dihapus.`);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={createOption}>
          <div className="space-y-2">
            <Label htmlFor={`${endpoint}-name`}>Nama {label.toLowerCase()}</Label>
            <Input
              id={`${endpoint}-name`}
              value={name}
              placeholder={placeholder}
              onChange={(event) => setName(event.target.value)}
            />
            <FieldError message={fieldErrors.name?.[0]} />
          </div>
          <Button className="self-end" disabled={isSaving}>
            <Plus />
            {isSaving ? "Menambahkan..." : "Tambah"}
          </Button>
        </form>

        {message ? (
          <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
            {message}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-slate-200">
          {items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-500">{emptyMessage}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {items.map((option) => {
                const isUsed = option.productCount > 0;
                return (
                  <div
                    key={option.id}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">{option.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {isUsed
                          ? `Dipakai ${option.productCount.toLocaleString("id-ID")} produk. Pindahkan produk terkait dulu sebelum hapus.`
                          : "Belum dipakai produk, aman dihapus."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={isUsed ? "secondary" : "outline"}>
                        {option.productCount.toLocaleString("id-ID")} produk
                      </Badge>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUsed || deletingId === option.id}
                        title={isUsed ? `${label} sedang dipakai produk` : `Hapus ${option.name}`}
                        onClick={() => void deleteOption(option)}
                      >
                        <Trash2 />
                        Hapus
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm font-medium text-destructive">{message}</p>;
}
