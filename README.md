# Wanderly Travel Agency App

A full-stack travel agency web app built with Next.js (App Router) and Tailwind CSS. It ships with a SQLite-backed API layer, enquiry capture, and an admin dashboard for managing travel packages.

## Features
- Home page with featured travel packages
- Package listing and detail pages (images, itinerary, pricing)
- Enquiry form that stores leads in the database
- Admin dashboard with secure login, CRUD for packages, image upload, and enquiry viewer
- SEO-friendly metadata and responsive UI

## Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Next.js API routes (Node.js runtime)
- **Database:** SQLite (local). Easily switch to PostgreSQL by swapping the `better-sqlite3` layer.

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env.local` file in the project root:
```bash
ADMIN_EMAIL=admin@wanderly.com
ADMIN_PASSWORD=admin1234
ADMIN_SECRET=replace_with_a_random_secret
```

### 3) Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Dashboard
- Visit `/admin/login`
- Sign in with your admin credentials
- Add, edit, and delete packages
- Upload images for new packages
- Review enquiry submissions

## Database
The SQLite database is stored at `data/travel.sqlite`. It auto-creates tables and seeds sample packages on first run.

## Scripts
- `npm run dev` – start the development server
- `npm run build` – build for production
- `npm run start` – run the production build

## Sample Data
The app seeds sample packages for Bali, Iceland, and Morocco on first run.
