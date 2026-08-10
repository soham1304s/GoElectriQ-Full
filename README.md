# ⚡ GoElectriQ — Full-Stack EV Charging Station Management Platform

![GoElectriQ Banner](https://img.shields.io/badge/GoElectriQ-EV%20Charging%20Platform-22c55e?style=for-the-badge&logo=lightning)
![License](https://img.shields.io/github/license/soham1304s/GoElectriQ-Full?style=for-the-badge&color=blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

**GoElectriQ** is an end-to-end full-stack web and mobile ecosystem built for managing, locating, and utilizing Electric Vehicle (EV) charging stations. The platform connects EV owners with station operators, offering real-time station discovery, slot booking, live status tracking, seamless payment integration, and analytics dashboards.

---

## 🌟 Key Features

### 🛵 For EV Owners & Drivers
* **Interactive Map & Station Discovery:** Find nearby EV charging stations with live availability status (Available, Occupied, Under Maintenance).
* **Smart Filter & Search:** Search by connector type (Type 2, CCS2, CHAdeMO), fast-charging capacity (kW), distance, and price.
* **Slot Booking & Scheduling:** Pre-book charging slots to eliminate wait times at public charging hubs.
* **Real-time Session Monitoring:** Track ongoing charging sessions (Battery %, Energy Delivered in kWh, Elapsed Time, Cost).
* **In-App Wallet & Payments:** Integrated payment gateway for automated billing, session receipts, and transaction history.

### 🔌 For Station Hosts & Operators
* **Station Management Dashboard:** Add, update, or temporarily pause charging ports and connectors.
* **Dynamic Pricing & Slot Management:** Configure peak/off-peak rates and control slot availability schedules.
* **Analytics & Insights:** Monitor revenue, energy consumption trends, peak usage hours, and customer analytics.

---

## 🛠 Tech Stack

### **Frontend & Mobile UI**
* **Framework:** React / Next.js *(or Flutter cross-platform mobile app)*
* **Styling:** Tailwind CSS / CSS Modules
* **Mapping & GIS:** Leaflet.js / Mapbox GL / Google Maps API

### **Backend & APIs**
* **Runtime / Framework:** Node.js, Express.js / Python FastAPI
* **Database:** PostgreSQL / Supabase / MongoDB
* **Real-time Protocols:** WebSockets / Socket.io *(for live charging metrics and port availability)*
* **Authentication:** JWT / Supabase Auth / Firebase Auth

### **DevOps & Cloud**
* **Deployment:** Vercel (Frontend), Railway / Render (Backend)
* **API Documentation:** Postman / Swagger UI

---

## 🚀 Getting Started

Follow these steps to set up and run **GoElectriQ** locally on your machine.

### Prerequisites
* **Node.js** `>= 18.x`
* **npm** or **pnpm** / **yarn**
* **Git** installed on your machine
* Database instance running (PostgreSQL / MongoDB)

---

### 📥 Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/soham1304s/GoElectriQ-Full.git](https://github.com/soham1304s/GoElectriQ-Full.git)
   cd GoElectriQ-Full
