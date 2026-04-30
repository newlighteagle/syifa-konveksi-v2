import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Syifa Konveksi",
  description: "Katalog digital interaktif untuk Syifa Konveksi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans">{children}</body>
    </html>
  );
}
