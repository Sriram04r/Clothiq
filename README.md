# 🧺 Clothiq - Smart Laundry Ecosystem

Clothiq is a comprehensive, smart laundry service platform designed to streamline laundry pickup, cleaning, and delivery. It features a modern, user-friendly mobile application for customers, a dedicated mobile app for drivers, and a powerful web dashboard for administrators.

## 🌟 The Ecosystem

Clothiq operates across three tightly integrated platforms powered by a unified Firebase backend:

1. **Customer App (React Native / Expo)** - Allows users to schedule pickups, select laundry services, track orders in real-time, manage payments, and receive notifications.
2. **Driver App (React Native / Expo)** - A specialized app for delivery personnel to track their assigned pickups/deliveries, route themselves, and update order statuses on the go.
3. **Admin Dashboard (React / Vite)** - A premium web-based dashboard for administrators to monitor revenue, manage customers, dispatch orders to drivers, and maintain overall service quality.

---

## ✨ Key Features

### 👤 Customer App
* **Service Selection:** Choose between Wash & Fold, Wash & Iron, and Dry Wash.
* **Order Tracking:** Real-time tracking of order statuses (from Pickup to Washing to Delivery).
* **Payment Integration:** Secure checkout with Cash on Delivery (COD), UPI QR, and Monthly Khata (ledger) options.
* **Smart Addressing:** Add and manage multiple pickup/delivery locations.
* **AI Recommendations:** Fabric usage and care recommendations (Coming soon).

### 🚚 Driver App
* **Route Management:** View assigned tasks sorted by priority and distance.
* **Order Status Updates:** Update orders in real-time (e.g., "Out for Pickup", "Delivered").
* **Customer Contact:** One-click calling to coordinate with customers.

### 💼 Admin Dashboard
* **Premium UI:** A sleek, glassmorphic design system tailored for fast operations.
* **Revenue Metrics:** Track daily, weekly, and monthly revenue.
* **Order Dispatching:** Assign drivers to incoming orders instantly.
* **Customer Management:** View customer history, pending payments, and feedback.

---

## 🛠️ Technology Stack

* **Frontend (Mobile):** React Native, Expo, React Navigation
* **Frontend (Web):** React, Vite, CSS Modules / Vanilla CSS
* **Backend & Database:** Firebase (Firestore, Authentication, Cloud Functions)
* **Icons & UI:** Lucide Icons, Custom Glassmorphic Components

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Expo CLI
* A Firebase Project configured with your API keys

### Installation & Running

**1. Customer Mobile App**
```bash
# Navigate to the main project directory
cd Clothiq

# Install dependencies
npm install

# Start the Expo server
npx expo start
```

**2. Admin Dashboard**
```bash
# Navigate to the admin dashboard directory
cd Clothiq/admin-dashboard

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

**3. Driver Mobile App** *(Located in a separate repository/folder)*
```bash
# Navigate to the driver project directory
cd Clothiq-Driver

# Install dependencies
npm install

# Start the Expo server
npx expo start
```

---

## 📂 Project Structure

```text
Clothiq/
├── admin-dashboard/     # React Admin Panel (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components (Sidebar, Layout)
│   │   ├── pages/       # Dashboard pages (Overview, Orders, Customers)
│   │   └── firebase.ts  # Firebase configuration
├── screens/             # Customer App Screens (React Native)
├── components/          # Customer App Reusable Components
├── App.tsx              # Mobile App Entry Point
└── firebaseConfig.js    # Firebase configuration for mobile
```

---

## 📅 Roadmap & Future Enhancements

- [ ] Push Notifications for real-time status alerts.
- [ ] AI-driven fabric care insights based on user clothing input.
- [ ] Live map integration for driver tracking.
- [ ] Subscriptions for regular weekly laundry pickups.

---
*Stay tuned for more updates as we revolutionize the laundry industry!*
