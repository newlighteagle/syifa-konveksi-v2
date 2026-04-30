# Syifa Konveksi v2

Next.js catalog app for Syifa Konveksi with public product browsing and admin product management.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend Setup

Create `.env` from `.env.example`, then set your Neon PostgreSQL URL.

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Default seeded admin:

- Email: `admin@syifakonveksi.com`
- Password: `admin12345`

Without `DATABASE_URL`, the app uses mock product data for read-only catalog pages and demo login fallback.

## API Routes

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:slug`
- `PUT /api/products/:slug`
- `DELETE /api/products/:slug`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
