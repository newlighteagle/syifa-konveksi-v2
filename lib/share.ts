export type ProductShareData = {
  title: string;
  text: string;
  url: string;
};

export function buildProductShareData({
  name,
  kodeProduksi,
  url,
}: {
  name: string;
  kodeProduksi: string;
  url: string;
}): ProductShareData {
  return {
    title: `${name} - Syifa Konveksi`,
    text: `Lihat produk ${name} (${kodeProduksi}) dari Syifa Konveksi.`,
    url,
  };
}
