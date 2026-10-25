# CampusConnect — Student Campus Activity & Event Management Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-cyan.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **CampusConnect** is a modern, responsive, full-stack MERN web application engineered for university ecosystems. It empowers college students to discover extracurricular activities, RSVP for workshops and competitions with real-time atomic capacity validation, manage their registrations through a personalized dashboard, and receive official digital passes. Campus administrators and club coordinators can manage event lifecycles, monitor attendee capacity utilization, and inspect registered attendee rosters.

---

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Objectives & Target Users](#-objectives--target-users)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Database Schema & Models](#-database-schema--models)
- [REST API Endpoints](#-rest-api-endpoints)
- [Project Folder Structure](#-project-folder-structure)
- [Environment Variables](#-environment-variables)
- [Local Installation & Setup](#-local-installation--setup)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment Guide (Render & MongoDB Atlas)](#-deployment-guide-render--mongodb-atlas)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Problem Statement

Traditional university campus activity coordination suffers from fragmented communication:
1. **Dispersed Information:** Event announcements are scattered across physical posters, disparate WhatsApp groups, and unstructured social media threads.
2. **Spreadsheet Chaos & Overbooking:** Manual sign-up forms frequently encounter race conditions, causing room overbooking and student frustration.
3. **Absence of Digital Verification:** Student organizers lack a uniform mechanism to issue scannable, verifiable attendance passes or export real-time rosters.
4. **Administrative Blindspots:** Student Affairs departments struggle to monitor extracurricular participation across academic departments without consolidated analytics.

---

## 👥 Objectives & Target Users

### Core Objectives
- Establish a single, authoritative digital portal for all university events and workshops.
- Provide zero-friction, atomic seat reservations that prevent double-booking or over-capacity registration.
- Generate digital campus ticket passes with unique verification codes for attendees.
- Equip faculty advisors and club leaders with administrative tools for event lifecycle control and attendee management.

### Target Users
- **University Students:** Discover events, filter by interest/date, RSVP, print digital passes, and track personal participation.
- **Club Leads & Event Coordinators:** Publish workshops, competitions, and seminars; track capacity fill rates; view registrant rosters.
- **University Administrators & Dean of Students:** Oversee campus engagement metrics and cross-department participation.

---

## 🏛 System Architecture

CampusConnect follows a clean, decoupled client-server architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    React 18 + Vite Frontend                     │
│  Tailwind CSS • React Router • Lucide Icons • React Hot Toast   │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / JSON (Axios API Client)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Node.js / Express.js API                    │
│  JWT Verification • Rate Limiter • Helmet • Input Validation    │
└───────────────────┬─────────────────────────┬───────────────────┘
                    │                         │
                    ▼                         ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│   MongoDB Atlas / Mongoose    │ │  In-Memory Zero-Config Dev DB │
│   Atomic Capacity Indexes     │ │  (mongodb-memory-server)      │
└───────────────────────────────┘ └───────────────────────────────┘
```

---

## ✨ Key Features

### 1. Student Activity Discovery
- **Hero & Live Counters:** Shows real-time university statistics (5,400+ students, 120+ clubs, 350+ annual events).
- **Search & Multi-Filter:** Search by keyword, filter by categories (*Technical, Cultural, Sports, Workshop, Career, Social, Academic*), filter by date ranges (*Upcoming, Today, Next 7 Days, This Month*), and toggle available seats only.
- **Dynamic Sorting:** Sort by upcoming date, recently published, title, or seat capacity.

### 2. Atomic RSVP & Digital Passes
- **Concurrency-Safe Registrations:** Leverages MongoDB atomic operations (`findOneAndUpdate` with `$expr: { $lt: ['$registeredCount', '$capacity'] }`) to eliminate race conditions when reserving the final seat.
- **Digital Student Pass:** Automatically generates an official ticket pass with unique ticket code (`CC-XXXXXX-XXXX`), attendee name, department, venue, and printable view.
- **One-Click Cancellation:** Students can cancel RSVPs when plans change, instantly re-opening seats for waitlisted peers.

### 3. Student Dashboard
- **Personal Activity Ledger:** Track upcoming registrations vs. completed events.
- **Profile Customization:** Update department, student ID, bio, and contact information.
- **Instant Pass Access:** Retrieve or print ticket passes at any time.

### 4. Administrator Control Desk
- **Analytics & Capacity Utilization:** Aggregated metrics showing total events, total RSVPs, active student count, and average capacity fill rates.
- **Event Lifecycle CRUD:** Modal-driven creation, live preview, modification, and deletion of campus events.
- **Attendee Roster & Print Sheet:** View student name, email, student ID, and ticket code for any event with instant search and printable attendance sheet.
- **Student Inquiry Inbox:** Review and process contact messages submitted through the platform.

---

## 🛠 Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS v3, React Router v6, Axios, Lucide React, React Hot Toast |
| **Backend** | Node.js v24, Express.js v4, Helmet, Morgan, Express Rate Limit |
| **Database** | MongoDB Atlas, Mongoose v8, In-Memory Mongo Dev Fallback |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js password hashing |
| **Testing** | Node.js Native Test Runner (`node --test`), Supertest |
| **Deployment** | Render Static Site (Frontend), Render Web Service (Backend), MongoDB Atlas |

---

## 🗄 Database Schema & Models

### 1. User Model (`server/src/models/User.js`)
- `name` (String, required, trimmed)
- `email` (String, required, unique, lowercase, validated)
- `password` (String, required, bcrypt hashed with 10 salt rounds)
- `role` (String, enum: `['student', 'admin']`, default: `'student'`)
- `studentId` (String, optional)
- `department` (String, default: `'General'`)
- `bio` (String, max 300 chars)
- `phone` (String, optional)
- Timestamps (`createdAt`, `updatedAt`)

### 2. Event Model (`server/src/models/Event.js`)
- `title` (String, required, max 150 chars, indexed)
- `description` (String, required, max 3000 chars, indexed)
- `category` (String, enum: `['Technical', 'Cultural', 'Sports', 'Workshop', 'Career', 'Social', 'Academic', 'Other']`)
- `date` (Date, required, indexed)
- `time` (String, required)
- `location` (String, required)
- `organizer` (String, required)
- `capacity` (Number, required, min 1)
- `registeredCount` (Number, default 0, min 0)
- `image` (String, validated URL)
- `tags` ([String], indexed)
- `status` (String, enum: `['Upcoming', 'Ongoing', 'Completed', 'Cancelled']`)
- `createdBy` (ObjectId ref User, required)
- **Virtual:** `seatsLeft` = `Math.max(0, capacity - registeredCount)`

### 3. Registration Model (`server/src/models/Registration.js`)
- `event` (ObjectId ref Event, required, indexed)
- `user` (ObjectId ref User, required, indexed)
- `ticketCode` (String, unique index, e.g. `CC-XXXXXX-XXXX`)
- `status` (String, enum: `['Confirmed', 'Cancelled']`)
- `registeredAt` (Date, default `Date.now`)
- `notes` (String, optional)
- **Unique Compound Index:** `{ event: 1, user: 1 }` (guarantees a student cannot register more than once for the same event)

### 4. ContactMessage Model (`server/src/models/ContactMessage.js`)
- `name` (String, required)
- `email` (String, required, validated)
- `subject` (String, required)
- `message` (String, required)
- `status` (String, enum: `['New', 'Read', 'Archived']`)

---

## 📡 REST API Endpoints

### Health & Monitoring
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and database status | Public |

### Authentication & Profile
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student or authorized coordinator | Public |
| `POST` | `/api/auth/login` | Authenticate with credentials and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Private (Token) |
| `PUT` | `/api/auth/profile` | Update user profile details | Private (Token) |

### Event Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List events with search, category, date filters & pagination | Public |
| `GET` | `/api/events/:id` | Event details and requesting user's RSVP status | Public / Auth |
| `POST` | `/api/events` | Create new campus event | Admin Only |
| `PUT` | `/api/events/:id` | Update existing event | Admin Only |
| `DELETE`| `/api/events/:id` | Remove event and cascade cancel registrations | Admin Only |

### Event Registrations & Attendee Roster
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events/:id/register` | Reserve seat atomically (concurrency safe) | Private |
| `DELETE`| `/api/events/:id/register`| Cancel event registration and free seat | Private |
| `GET` | `/api/registrations/my` | Retrieve logged in student's registered events | Private |
| `GET` | `/api/events/:id/registrations`| Retrieve full attendee list for an event | Admin Only |

### Administrative Analytics & Contact
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Dashboard metrics & capacity utilization | Admin Only |
| `POST` | `/api/contact` | Submit inquiry from contact page | Public |
| `GET` | `/api/contact` | Inspect student inquiry messages | Admin Only |

---

## 📂 Project Folder Structure

```
campusconnect/
├── client/                     # Frontend React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── TicketModal.jsx
│   │   ├── pages/              # Application Pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── EventDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboardPage.jsx
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global JWT session state
│   │   ├── services/           # Centralized API service layer
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── registrationService.js
│   │   │   └── contactService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── .env.example
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Atlas & In-Memory zero-config dev DB
│   │   ├── models/             # Mongoose Models
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Registration.js
│   │   │   └── ContactMessage.js
│   │   ├── controllers/        # REST Controllers
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── registrationController.js
│   │   │   ├── contactController.js
│   │   │   └── adminController.js
│   │   ├── middleware/         # Security & Error Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── rateLimitMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── routes/             # Express Routers
│   │   ├── utils/
│   │   │   ├── generateToken.js
│   │   │   └── seedDevData.js
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server listen & lifecycle entrypoint
│   ├── scripts/
│   │   └── seed.js             # Standalone production/dev seed script
│   ├── tests/
│   │   └── api.test.js         # Integration test suite
│   ├── package.json
│   └── .env.example
├── .gitignore
├── render.yaml                 # Render Blueprint deployment config
├── README.md
└── INTERNSHIP_REPORT.md        # Comprehensive internship project report
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
# Leave empty for zero-config in-memory dev database or provide your MongoDB Atlas URI:
MONGODB_URI=
JWT_SECRET=campusconnect_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
ADMIN_NAME=Campus Administrator
ADMIN_EMAIL=admin@campusconnect.edu
ADMIN_PASSWORD=Admin@Campus2026!
ADMIN_PASSCODE=CampusAdmin@2026
```

### Client (`client/.env`)
```ini
# In local development, leave empty or set to local API proxy:
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer; tested on v24)
- [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/jovilin225501/caston.git
cd caston
```

### Step 2: Install All Dependencies
```bash
# Install root, client, and server dependencies in one command:
npm install
npm run install:all
```

### Step 3: Run Seed Data (Optional)
```bash
npm run seed
```
> *Default Demo Credentials:*
> - **Student:** `alex.rivers@campus.edu` / `Student@123456`
> - **Admin:** `admin@campusconnect.edu` / `Admin@Campus2026!`

### Step 4: Start Development Environment
```bash
# Runs both client and server concurrently:
npm run dev
```
- Frontend will open at: `http://localhost:5173/`
- Backend API will listen at: `http://localhost:5000/api`

---

## 🧪 Testing & Quality Assurance

The backend includes a comprehensive automated test suite testing health check, student registration, admin promotion passcode, JWT verification, event creation, atomic seat RSVP, duplicate RSVP rejection, registration cancellation, and contact form handling:

```bash
npm test
```

### Verified Test Results:
```text
▶ CampusConnect Comprehensive Backend API Tests
  ✔ GET /api/health should return 200 and operational status
  ✔ POST /api/auth/register should register a new student
  ✔ POST /api/auth/register with adminPasscode should register an admin
  ✔ GET /api/auth/me with valid student token should return profile
  ✔ POST /api/events should allow admin to create an event
  ✔ POST /api/events/:id/register should allow student to register
  ✔ POST /api/events/:id/register should reject duplicate registration by the same student
  ✔ GET /api/registrations/my should return registered events for the student
  ✔ DELETE /api/events/:id/register should successfully cancel registration
  ✔ POST /api/contact should accept valid inquiries
✔ CampusConnect Comprehensive Backend API Tests (10/10 passed)
```

---

## 🚀 Deployment Guide (Manual Render Web Service)

Deploying as a manual **Web Service** on [Render](https://render.com/) is straightforward, requires only the free tier, and provides a single unified URL for both the React frontend and Express API.

### Render Web Service Settings:
- **Service Type:** Web Service
- **Name:** `campusconnect` (or any custom name)
- **Repository:** `https://github.com/jovilin225501/caston`
- **Branch:** `main`
- **Root Directory:** *(leave blank / default root)*
- **Runtime:** `Node`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Plan:** Free

### Required Environment Variables in Render Dashboard:
Under **Environment Variables** in your Web Service settings, add:
| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode and static React asset serving |
| `MONGODB_URI` | `mongodb+srv://caston:JOVILIN123@jovilin0.noawqe2.mongodb.net/campusconnect?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `campusconnect_super_secret_jwt_key_2026_production` | Cryptographic key for JWT tokens |
| `ADMIN_PASSCODE` | `CampusAdmin@2026` | Authorization code for administrator accounts |

### Step-by-Step Manual Deployment on Render:
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** (top right) ➔ Select **Web Service**.
3. Choose **Build and deploy from a Git repository**, click **Next**, and select your repository **`jovilin225501/caston`**.
4. Configure the settings:
   - **Name:** `campusconnect`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. Scroll down to **Environment Variables** and add `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, and `ADMIN_PASSCODE`.
6. Click **Deploy Web Service** (or **Create Web Service**).
7. Render will build the React bundle, launch the Node.js Express server, and connect to MongoDB Atlas!
   - **Live App URL:** `https://campusconnect.onrender.com`
   - **Health Check URL:** `https://campusconnect.onrender.com/api/health`

---

## 🔒 Security Considerations

- **Password Hashing:** Passwords are never stored in plaintext; bcrypt hashing with 10 salt rounds is enforced in pre-save hooks.
- **JWT Protection:** Authorization tokens are validated via cryptographic signature and checked on every protected endpoint.
- **Role Elevation Prevention:** Student registration cannot inject `admin` role by tampering with frontend values; admin roles require a secure server-side passcode.
- **Rate Limiting:** Protects `/api/auth/` routes against brute-force attacks and general routes against scraping.
- **Safe Error Handling:** Production error responses strip stack traces and internal database schemas.
- **Zero Secret Leaks:** Comprehensive `.gitignore` protects `.env` files and certificates from being committed to Git.

---

## 🔮 Future Enhancements

- **Email Confirmations:** Automated email notifications via Nodemailer / SendGrid upon RSVP.
- **QR Code Mobile Scanner:** In-app mobile camera scanner for event coordinators at entrance doors.
- **Waitlist Queue Automation:** Automatic promotion of waitlisted students when an RSVP is cancelled.
- **Calendar Sync:** One-click integration with Google Calendar, Apple Calendar, and Outlook (.ics exports).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built for academic capstone presentation and professional full-stack portfolio demonstration.
