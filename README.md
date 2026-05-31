# CineVault (BookMyShow)

Full-stack movie ticketing app: browse movies, pick showtimes, select seats, pay via **Stripe Checkout**, and receive ticket emails. Supports **admin**, **partner**, and **user** roles.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19, Vite 6, React Router 7, Redux Toolkit, Ant Design 5, Tailwind CSS 4, Axios, Day.js |
| **Backend** | Node.js 22, Express 5, Mongoose 8, JWT, bcryptjs |
| **Database** | MongoDB |
| **Payments** | Stripe Checkout (INR) |
| **Email** | Strategy pattern — Gmail, Resend, or SendGrid via Nodemailer (HTML templates) |
| **Deploy** | Netlify (client), Render (server) |

## Features

### End user
- Register / login / profile
- Browse & search movie catalog
- Pick date → view theatres & showtimes for a movie
- Interactive seat map with availability
- Stripe payment → booking confirmation page
- Ticket confirmation email
- My Bookings (history & spend)
- Forgot / reset password (OTP email)

### Partner
- Register as theatre partner
- CRUD own theatres
- Schedule shows (movie, date, time, price, capacity) on **approved** theatres

### Admin
- Movie catalog CRUD
- View all theatres; approve / block (`isActive`)

### App-wide
- Role-based routes & navigation (`ProtectedRoute`)
- 404 page + Netlify SPA redirects
- Global loading overlay (Axios interceptors)
- Toast notifications

## Architecture & concepts

```
client/ (React SPA)  ──HTTP/JSON──►  server/ (Express REST)  ──►  MongoDB
                                           ├── Stripe
                                           └── Email providers
```

| Concept | Implementation |
|---------|----------------|
| **REST API** | `/api/users`, `/api/movies`, `/api/theatres`, `/api/shows`, `/api/booking` |
| **JWT auth** | Bearer token in `localStorage`; `authMiddleware` sets `req.userId` |
| **Session cache** | Redux `bootstrapSession` — fetches current user once per session |
| **RBAC** | Roles: `admin`, `partner`, `user` — UI guards + `roleMiddleware` / `resourceAuthorization` on server |
| **Strategy pattern** | Email: `emailProviderFactory` picks Gmail / Resend / SendGrid |
| **Facade** | `emailHelper` → templated HTML (`#{placeholders}`) → provider |
| **Security** | Helmet, CORS, rate limiting, `express-mongo-sanitize`, bcrypt passwords |
| **Seeding** | Admin, partner & demo catalog scripts for local/dev data |

## Data model

```
User ──► Booking ◄── Show ──► Movie
              │         └──► Theatre ◄── User (owner)
```

- **Show** — `bookedSeats[]`, `totalSeats`, `ticketPrice`
- **Theatre** — `isActive` (admin approval)
- **Booking** — seats, Stripe `transactionId`

## Booking flow (Stripe)

1. User selects seats → `POST /api/booking/create-checkout-session` (JWT)
2. Redirect to Stripe (logged-in user email via Stripe Customer)
3. Success → `POST /api/booking/confirm-booking` with `session_id`
4. Server saves booking, updates seats, sends ticket email

## Getting started

### Prerequisites
Node.js 22, MongoDB, Stripe account, email provider credentials

### Server
```bash
cd server
npm install
# create server/.env (see below)
npm run dev          # port 3001
npm run seed:admin   # optional — create admin user
npm run seed:catalog # optional — demo movies/theatres/shows
```

### Client
```bash
cd client
npm install
# create client/.env
npm run dev          # Vite dev server
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:3001
```

**`server/.env` (essential)**
```env
DB_URL=mongodb://...
JWT_SECRET=your-secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...

# Email (pick one provider)
EMAIL_PROVIDER=gmail
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx
EMAIL_FROM="CineVault" <you@gmail.com>
# — or RESEND_API_KEY / SENDGRID_API_KEY

CORS_ORIGIN=http://localhost:5173
```

## Deployment

| App | Host | Notes |
|-----|------|-------|
| **Client** | Netlify | Base dir: `client`, build: `npm run build`, publish: `dist`, set `VITE_API_URL` |
| **Server** | Render | Root: `server`, Node 22, set env vars, `CLIENT_URL` = Netlify URL |

SPA routing: `client/public/_redirects` → `/* /index.html 200`

## Project structure

```
BookMyShow-Project/
├── client/          React SPA (pages, components, Redux, API layer)
├── server/
│   ├── controllers/ Route handlers
│   ├── models/      Mongoose schemas
│   ├── routes/      Express routers
│   ├── middlewares/ Auth, roles, security, resource authorization
│   ├── seeding/     Admin & catalog seed scripts
│   └── utils/email/ Providers, templates, factory
└── README.md
```

## Scripts

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run dev` | client / server | Local development |
| `npm run build` | client | Production bundle |
| `npm run seed:admin` | server | Create admin user |
| `npm run seed:catalog` | server | Seed demo catalog |

---

Built as a full-stack learning project covering authentication, RBAC, payments, email, security middleware, and deployment.
