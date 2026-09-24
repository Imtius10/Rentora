<div align="center">

# 🏠 Rentora — RentNest

**A full-stack rental property marketplace for Bangladesh.**

Browse verified listings, submit rental requests, and manage approvals & payments — all from one seamless platform.

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**🔗 Live Demo:** [rentora-ecru.vercel.app](https://rentora-ecru.vercel.app) ·
**🔌 API:** [rent-nest-api-seven.vercel.app](https://rent-nest-api-seven.vercel.app)

</div>

---

## ✨ Features

### 🏘️ Property Marketplace
- Browse & search all available rental properties
- Filter by **location**, **price range**, and **property type** (apartment, studio, house, condo, penthouse, villa & more)
- Detailed property pages with landlord info
- Live category explorer with icons

### 👤 Tenant Experience
- Register & log in with JWT + refresh-token auth
- Submit rental requests to landlords
- **Pay securely via Stripe** once a request is approved
- Track request & payment history
- Leave reviews after a completed rental

### 🗝️ Landlord Tools
- Create, edit & remove property listings
- Approve or reject rental requests
- View renters and their requests at a glance
- Dashboard with stats, listings, and payment overview

### 🛡️ Admin Panel
- Manage all users — ban/unban & change roles
- Oversee every listing, request, and payment
- Platform-wide analytics dashboard

---

## 🧑‍💻 Demo Accounts

| Role      | Email                 | Password  |
| --------- | --------------------- | --------- |
| **Admin** | `admin@rentnest.com`  | `admin123`|
| **Landlord** | `imtius1@example.com` | `12345678` |
| **Tenant** | `tanvir@tenant.com`   | `123456`  |

---

## 🚀 Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| Frontend   | Next.js 15 (App Router), React 19, Tailwind CSS 4, TanStack Query |
| Backend    | Node.js, Express 5, TypeScript 7 |
| ORM        | Prisma 7 (PrismaPg adapter) |
| Database   | PostgreSQL (Neon) |
| Auth       | JWT (access + refresh) & bcrypt |
| Payments   | Stripe Checkout |
| Security   | helmet, cookie-parser, same-origin API proxy |
| Deploy     | Vercel (frontend + backend) |

---

## 📁 Project Structure

```
Rentora/
├── Module_4_Frontend/        # Next.js 15 frontend
│   ├── app/                  # App Router pages & routes
│   │   ├── properties/       # Browse, filters, detail
│   │   ├── dashboard/        # Role-based dashboards
│   │   ├── login/ register/  # Authentication
│   │   └── payment/          # Stripe success/cancel
│   ├── components/           # UI kit, layouts, cards
│   ├── hooks/                # TanStack Query hooks + auth
│   ├── lib/                  # API client, constants
│   ├── middleware.ts         # Route protection
│   └── next.config.ts        # API rewrite proxy
└── Module_4/                 # Express + Prisma backend
    ├── src/                  # Routes, controllers, services
    ├── prisma/               # Schema, migrations, seed
    └── api/                  # Vercel serverless entry
```

---

## 🏃 Getting Started

### 1. Frontend

```bash
cd Module_4_Frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in `.env.local`:

```
NEXT_PUBLIC_API_URL=https://rent-nest-api-seven.vercel.app
```

### 2. Backend

```bash
cd Module_4
npm install
npx prisma generate
npx prisma db push       # or run migrations
npm run seed
npm run dev
```

---

## 🔄 How It Works

```
01  Create an account        →  Sign up as a tenant or landlord
02  Apply or list            →  Tenants request rentals, landlords publish
03  Get approved & pay       →  Landlords approve, tenants pay via Stripe
04  Move in & review         →  Rate the rental and leave a review
```

---

<div align="center">

Built with ❤️ using Next.js, Express, Prisma & Stripe · Deployed on [Vercel](https://vercel.com)

</div>