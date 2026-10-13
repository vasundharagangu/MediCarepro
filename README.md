# MediCare Pro — Advanced Healthcare Management System

[![Deploy to GitHub Pages](https://github.com/vasundharagangu/MediCarepro/actions/workflows/deploy.yml/badge.svg)](https://github.com/vasundharagangu/MediCarepro/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20MediCare%20Pro-brightgreen?style=for-the-badge&logo=github)](https://vasundharagangu.github.io/MediCarepro/)

---

## 🌐 Live Website

The application is deployed and live at:
👉 **[https://vasundharagangu.github.io/MediCarepro/](https://vasundharagangu.github.io/MediCarepro/)**

---

## 🔑 Demo Credentials

You can test all roles immediately on the live demo using the 1-click login buttons or credentials below:

| Role | Email | Password | Access & Features |
| :--- | :--- | :--- | :--- |
| **Admin** 👑 | `jhon@admin` | `12345678` | User management, role assign, cleanup duplicates, system overview |
| **Doctor** 🩺 | `alice.smith@clinic.test` | `doctor123` | View appointment queue, accept/reject, mark consultations complete |
| **Patient** 👤 | `patient@medicare.test` | `patient123` | Browse doctors, book appointments, make consultation payments |

---

## 📖 Overview

**MediCare Pro** is a comprehensive, full-stack healthcare management platform engineered to streamline clinical appointments, patient consultations, doctor scheduling, role-based administration, and payments.

### 🌟 Key Features

- **👤 Patient Portal**:
  - Browse qualified doctors with ratings, specializations, and years of experience.
  - Schedule consultation appointments with chosen date and time slots.
  - Track real-time appointment status (`Pending`, `Accepted`, `Completed`).
  - Integrated payment gateway supporting Credit/Debit Cards, UPI, Net Banking, and Digital Wallets.
  - Rate doctors and submit clinical feedback post-consultation.

- **🩺 Doctor Dashboard**:
  - Live KPIs tracking Pending, Accepted, Rejected, and Completed visits.
  - Appointment queue management with instant **Accept** and **Reject** controls.
  - Mark completed consultations once payment is verified.
  - Patient health details and consultation notes access.

- **👑 Admin Dashboard**:
  - Full visibility into system users (Doctors, Patients, Administrators).
  - Dynamic role creation and permission management.
  - Duplicate user detection and cleanup utilities.
  - System metrics and service monitoring.

- **💳 Payments & Billing**:
  - Secure payment simulation with real-time transaction ID generation (`TXN...`).
  - Automated billing records creation and receipt generation.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/) with SPA subpath handling
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) with resilient offline/demo fallback

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Server Framework**: [Express 5](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) + [Mongoose 8](https://mongoosejs.com/)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Security & Utilities**: CORS, cookie-parser, morgan logger, dotenv

---

## 📁 Project Structure

```text
MediCarepro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── backend/
│   ├── src/
│   │   ├── middleware/        # JWT auth & RBAC middleware
│   │   ├── models/            # Mongoose schemas (User, Appointment, Bill, etc.)
│   │   ├── routes/            # Express API endpoints (auth, doctors, patients, etc.)
│   │   └── server.js          # Express server entry point & database connection
│   ├── .env.example           # Backend environment template
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── 404.html           # SPA redirect handler for GitHub Pages
│   ├── src/
│   │   ├── components/        # Reusable UI components (Header, ProtectedRoute)
│   │   ├── lib/api.js         # Axios client with offline/demo fallback
│   │   ├── pages/             # Admin, Doctor, Patient, Payment, Auth pages
│   │   ├── store/auth.js      # Zustand authentication store
│   │   ├── App.jsx            # Application router setup
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js         # Base path and proxy configuration
│   └── package.json
├── .gitignore                 # Root gitignore excluding node_modules
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/vasundharagangu/MediCarepro.git
cd MediCarepro
```

### 2. Run the Backend
```bash
cd backend
npm install
npm start
```
*The backend server will run on `http://localhost:4000`.*

### 3. Run the Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend development server will start on `http://localhost:5173`.*

---

## 🚢 Deployment

The frontend is automated via **GitHub Actions** and hosted on **GitHub Pages**:
- Every push to the `main` branch builds the Vite bundle and deploys to `https://vasundharagangu.github.io/MediCarepro/`.
- Includes custom `404.html` and router basename configuration for seamless client-side page routing on static hosting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
