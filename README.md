# Syifa Konveksi v2

Syifa Konveksi v2 adalah aplikasi katalog digital untuk menampilkan produk konveksi secara publik dan mengelola produk melalui admin portal. Development project ini sekarang berbasis GitHub Issues: setiap perubahan fitur/bugfix harus dimulai dari issue, dikerjakan satu per satu, lalu menunggu approval sebelum lanjut ke issue berikutnya.

Production: https://www.syifakonveksi.my.id

## Features

- Public product catalog with category/search filtering.
- Product detail view counter.
- Site visitor counter for total visits and unique public IP visitors, shown in the admin dashboard.
- Admin product management with category, color, stock status, and media controls.

## Tech Stack

- Framework: Next.js 15 App Router
- UI: React 19, Tailwind CSS, lucide-react
- Backend: Next.js Route Handlers
- Database: PostgreSQL via Prisma ORM
- Auth: JWT session cookie dengan `jose` dan password hashing `bcryptjs`
- Validation: Zod
- Deployment: Vercel
- Package manager: npm

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run build
npm run db:generate
npm run db:push
npm run db:seed
```

Create `.env` from `.env.example`, then set the required values.

- `DATABASE_URL`: PostgreSQL connection string. Without this, public catalog uses mock read-only products.
- `AUTH_SECRET`: required for production session signing. Production will fail with an explicit error when this value is empty; development can use the built-in fallback.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: business WhatsApp number for product inquiries, for example `+62 852-4176-7460`.
- `SEED_ADMIN_EMAIL`: seeded admin email.
- `SEED_ADMIN_PASSWORD`: seeded admin password.

After schema changes, run `npm run db:push` against the target database before deploying. The visitor dashboard metrics require the `site_visitors` table, and inquiry tracking requires the `products.inquiries` column.

## Product Media Workflow

MVP ini belum menyediakan upload file lokal dari admin portal. Admin perlu menaruh foto atau video produk di layanan eksternal terlebih dahulu, lalu menempel URL media ke form tambah/edit produk.

Cara mengisi media produk:

- Pilih `Foto` untuk media utama berupa URL gambar langsung.
- Pilih `Video` untuk media utama berupa YouTube Shorts, Instagram Reel/post, atau URL video langsung.
- Isi `Link Media Utama` dengan satu URL utama yang akan tampil sebagai media pertama di katalog dan halaman detail.
- Isi `Link Galeri Tambahan` hanya dengan foto tambahan, satu URL per baris.

Format URL yang didukung:

- Image direct URL: link yang langsung mengarah ke file gambar seperti `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, atau `.gif`.
- YouTube URL: link `youtube.com`, `youtu.be`, atau `youtube.com/shorts/...`.
- Instagram URL: link post, reel, atau video dari `instagram.com`.
- Direct video URL: link yang langsung mengarah ke file video seperti `.mp4`, `.webm`, atau `.ogg`.

Contoh URL valid:

- `https://example.com/foto-produk.jpg`
- `https://cdn.example.com/katalog/seragam.webp`
- `https://www.youtube.com/shorts/T9X5KVfryAY`
- `https://youtu.be/T9X5KVfryAY`
- `https://www.instagram.com/reel/ABC123/`
- `https://cdn.example.com/video-produk.mp4`

Contoh URL tidak valid:

- `foto-produk.jpg` karena bukan URL lengkap.
- `www.example.com/foto-produk.jpg` karena tidak memakai `https://` atau `http://`.
- `https://drive.google.com/file/d/.../view` karena bukan direct image/video URL dan belum ada integrasi preview khusus Google Drive.
- `https://example.com/katalog` karena tidak jelas mengarah ke gambar atau video langsung.

Jika preview media tidak tampil, buka URL di tab browser baru. URL yang benar untuk foto direct biasanya langsung menampilkan gambar saja, bukan halaman web berisi gambar.

## Project Structure

- `app/`: App Router pages, layouts, and API route handlers.
- `components/`: reusable UI and feature components.
- `components/ui/`: small primitive UI components.
- `lib/`: shared business logic, validation, auth, Prisma, helpers.
- `prisma/`: Prisma schema and seed script.
- `public/`: static assets such as logo files.

Removed legacy prototype artifacts:

- `prd.md`
- `sample_frontend/`

## Naming Standards

Folders and files:

- Use `kebab-case` for folders and route segments, for example `admin-products-list.tsx`.
- Use route folder names from Next.js conventions: `[slug]`, `[id]`, `route.ts`, `page.tsx`, `layout.tsx`.
- Use `PascalCase` for React component names, even when the file name is kebab-case.
- Use `camelCase` for variables, functions, props, and local helpers.
- Use `UPPER_SNAKE_CASE` only for true constants that represent fixed environment-independent values.

Code:

- Prefer TypeScript types close to the feature boundary.
- Keep server data access in `lib/*` services or API route handlers.
- Keep browser-only logic inside client components marked with `"use client"`.
- Use Zod schemas from `lib/validation.ts` for request validation.
- Use existing UI primitives before adding new abstractions.
- Keep comments short and only where they clarify non-obvious logic.

API:

- Public collection routes use plural nouns: `/api/products`, `/api/categories`, `/api/colors`.
- Item routes use stable slugs where products are public-facing: `/api/products/:slug`.
- Mutating admin APIs must verify session with `readSession()`.
- JSON responses should use `{ message }` for errors and descriptive top-level keys for successful payloads, for example `{ products }`, `{ product }`, `{ categories }`.
- Route handlers should return appropriate status codes: `400` validation, `401` unauthenticated, `404` not found, `409` conflict, `503` missing database setup.

Database and domain:

- Prisma model fields use camelCase in code and `@map` for snake_case database column names when needed.
- Product public identifiers use `slug`; display code uses `kodeProduksi`.
- Product prices are stored as integer Rupiah.
- Production data changes must preserve existing seeded products unless an issue explicitly says otherwise.

## Current API Routes

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:slug`
- `PUT /api/products/:slug`
- `DELETE /api/products/:slug`
- `GET /api/categories`
- `GET /api/colors`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Issue-Based Workflow

Selama MVP ini sampai milestone 3 selesai, development hanya menggunakan branch `main`. Jangan membuat branch fitur, branch eksperimen, atau branch PR terpisah kecuali project owner mengubah aturan ini secara eksplisit.

1. Pick one approved GitHub issue.
2. Implement only the scope described in that issue.
3. Run at minimum `npm run build`.
4. Report changed files, verification result, and any follow-up risk.
5. Wait for approval before starting the next issue.

### Solved Issue Workflow

Use this workflow for every issue implementation:

1. Develop the solution locally from the approved issue scope.
2. Run QA/QC and unit tests locally. At minimum run `npm test` when tests exist and `npm run build`.
3. Send a report to the project owner with changed files, test results, QA notes, and any known risk.
4. If the project owner requests revisions, apply the revisions locally and repeat QA/QC.
5. If there are no revision requests and the project owner approves, push the finished change to GitHub.

Do not push or deploy before project owner approval.

Priority order:

- `priority:P0`: critical MVP behavior.
- `priority:P1`: high-value MVP readiness.
- `priority:P2`: polish, docs, admin operations, or next-layer capabilities.

## Milestone and Issue Status

Last synced from GitHub Issues: after completing issue #12.

### MVP Stabilization

Status: 5 closed / 0 open

Milestone result: complete and closed.

| Issue | Priority | Status | Title |
| --- | --- | --- | --- |
| [#1](https://github.com/newlighteagle/syifa-konveksi-v2/issues/1) | P0 | Closed | Fix product media type persistence |
| [#2](https://github.com/newlighteagle/syifa-konveksi-v2/issues/2) | P1 | Closed | Add product detail view counter |
| [#3](https://github.com/newlighteagle/syifa-konveksi-v2/issues/3) | P1 | Closed | Require production AUTH_SECRET |
| [#4](https://github.com/newlighteagle/syifa-konveksi-v2/issues/4) | P2 | Closed | Add empty states for missing product attributes |
| [#5](https://github.com/newlighteagle/syifa-konveksi-v2/issues/5) | P2 | Closed | Add basic regression checklist for product CRUD |

### MVP Conversion

Status: 5 closed / 0 open

| Issue | Priority | Status | Title |
| --- | --- | --- | --- |
| [#6](https://github.com/newlighteagle/syifa-konveksi-v2/issues/6) | P0 | Closed | Connect Tanya Produk button to WhatsApp |
| [#7](https://github.com/newlighteagle/syifa-konveksi-v2/issues/7) | P1 | Closed | Add floating WhatsApp contact CTA |
| [#8](https://github.com/newlighteagle/syifa-konveksi-v2/issues/8) | P2 | Closed | Add share product button |
| [#9](https://github.com/newlighteagle/syifa-konveksi-v2/issues/9) | P1 | Closed | Add business contact section footer |
| [#10](https://github.com/newlighteagle/syifa-konveksi-v2/issues/10) | P2 | Closed | Add simple product inquiry tracking |

### MVP Admin Operations

Status: 2 closed / 3 open

| Issue | Priority | Status | Title |
| --- | --- | --- | --- |
| [#11](https://github.com/newlighteagle/syifa-konveksi-v2/issues/11) | P1 | Closed | Allow choosing image or video as main media |
| [#12](https://github.com/newlighteagle/syifa-konveksi-v2/issues/12) | P2 | Closed | Document external media workflow |
| [#13](https://github.com/newlighteagle/syifa-konveksi-v2/issues/13) | P2 | Open | Add category and color management screens |
| [#14](https://github.com/newlighteagle/syifa-konveksi-v2/issues/14) | P2 | Open | Improve delete confirmation with safer modal |
| [#15](https://github.com/newlighteagle/syifa-konveksi-v2/issues/15) | P2 | Open | Add draft published product status |

## Manual QA Checklist

Use this checklist after issue implementation or before deployment. Run it against a local database that can be safely changed, not against production data.

Required local env:

- `DATABASE_URL`: points to a local/staging PostgreSQL database with Prisma schema applied via `npm run db:push`.
- `AUTH_SECRET`: set to any long random value for local QA; production requires this value.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: set to the business WhatsApp number so product inquiry links can be tested.
- `SEED_ADMIN_EMAIL`: admin email used by `npm run db:seed`.
- `SEED_ADMIN_PASSWORD`: admin password used by `npm run db:seed`.

Setup:

- Run `npm install` if dependencies are missing.
- Run `npm run db:push` after schema changes.
- Run `npm run db:seed` so admin login and starter catalog data exist.
- Start the app with `npm run dev` and open `http://localhost:3000`.

Regression steps:

- Admin login: open `/admin`, sign in with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, and confirm the admin dashboard loads.
- Public catalog: open `/`, confirm products load, category filters work, and keyword search narrows the product list.
- Public detail: open a product from the catalog, confirm media renders, product information is visible, view count appears, and missing size/color/gallery data has a clean empty state.
- Admin search/filter: open `/admin/products`, search by product name or production code, filter by category, and confirm the list updates without leaving the page.
- Create product: click add product, fill required fields with a unique product name and production code, save it, and confirm it appears in the admin product list and public catalog.
- Edit product: open the created product in edit mode, change price, status, sizes, colors, and media type, save it, then confirm the updated values appear in admin and public detail views.
- Delete product: delete only the QA product created during this checklist and confirm it no longer appears in admin or public catalog.
- Build check: run `npm test` and `npm run build`; both should finish successfully.
