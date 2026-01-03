# 📍 Zappy – Mini Vendor Event Day Tracker

A full-stack system simulating **real-world vendor event execution** for the Zappy platform.
The application tracks **vendor arrival, OTP verification, setup progress, and event completion** using a **User app** and a **Vendor app**.

---

## 🚀 Project Overview

At Zappy, vendor coordination is critical to event execution.
This project demonstrates a **secure, state-driven workflow** that ensures:

* Vendors arrive on location with proof
* Customers verify vendor actions using OTPs
* Setup progress is documented via images
* Events are completed only after mutual confirmation

The system mirrors **real production workflows** used in logistics and event management platforms.

---

## 🧩 Architecture Overview

### 🔹 Two Applications

* **User App** – Creates events, monitors progress, generates OTPs
* **Vendor App** – Executes events, uploads proofs, verifies OTPs

### 🔹 Backend (Single API)

* Handles authentication
* Manages event lifecycle
* Stores images & geo-location
* Enforces state-based access control

---

## 🛠 Tech Stack

### Frontend (User & Vendor Apps)

* **Expo (React Native)**
* **TypeScript**
* **Expo Router**
* **Context API**
* **Axios**
* **Expo Location & Image Picker**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Multer (Image Uploads)**

---

## 🔐 Authentication

* Separate authentication flows for **User** and **Vendor**
* JWT-based authentication
* Tokens stored securely on device
* Role separation enforced at API level

---

## 🎯 Event Lifecycle

```text
CREATED
   ↓
VENDOR_ARRIVED
   ↓
STARTED
   ↓
SETUP_COMPLETED
   ↓
COMPLETED
```

Each state unlocks **specific actions only**, ensuring workflow integrity.

---

## 👤 User App – Features

### ✅ Authentication

* Login with email & password
* Persistent session using context

### ✅ Event Management

* Create events for a vendor
* View list of all created events
* Open detailed event view

### ✅ Event Monitoring

* Track live event status
* View vendor arrival image & location
* View pre-setup and post-setup images

### ✅ OTP Generation

* Generate **Arrival OTP** (after vendor arrival)
* Generate **Completion OTP** (after setup completion)

---

## 🧑‍🔧 Vendor App – Features

### ✅ Authentication

* Vendor login
* Session persistence

### ✅ Event Execution

* View assigned events
* Open event detail page

### ✅ Vendor Arrival

* Capture geo-location
* Upload arrival image
* Mark arrival

### ✅ OTP Verification

* Verify arrival OTP
* Verify completion OTP

### ✅ Setup Documentation

* Upload **pre-setup image**
* Upload **post-setup image**

---

## 🗂 Backend API Structure

### 🔐 Auth

```
POST /api/user/login
POST /api/vendor/login
```

### 🎫 Events

```
POST /api/user/event
GET  /api/user/events
GET  /api/user/event/:eventId

GET  /api/vendor/events
GET  /api/vendor/event/:eventId
```

### 📍 Vendor Execution

```
POST /api/vendor/event/arrived
POST /api/vendor/event/setup-completed
```

### 🔢 OTP Flow

```
POST /api/user/otp/arrival/send
POST /api/user/otp/completion/send

POST /api/vendor/otp/arrival/verify
POST /api/vendor/otp/completion/verify
```

---

## 🖼 Image Handling

* Images stored on server using **Multer**
* Served statically via `/uploads`
* Paths stored in MongoDB
* Frontend renders using host machine IP

---

## 📦 Project Structure

```text
backend/
│── controllers/
│── routes/
│── models/
│── middlewares/
│── utils/
│── uploads/
│── database/
│── index.js

user-app/
│── app/
│── hooks/
│── context/
│── services/

vendor-app/
│── app/
│── hooks/
│── context/
│── services/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Create `.env`:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/zappy
JWT_SECRET=your_secret_key
JWT_SECRET = your_secret
NODE_ENV = development

HOST=smtp_host
EMAIL=smtp_email
PASSWORD=email_password
```

Add starting data to DB:
```cmd
node ./template.js
```

---

### 2️⃣ User App

```bash
cd user-app
npm install
expo start
```

---

### 3️⃣ Vendor App

```bash
cd vendor-app
npm install
expo start
```

⚠️ Use your **local IP address** instead of `localhost` in API calls.

---

## 🧑‍🔧 User App Screenshots

<p>
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/91831190-ce90-47d1-997f-414b0f102791" />
  <img width="32%" alt="Screenshot_1767448410" src="https://github.com/user-attachments/assets/4ff25a15-2075-4bd5-9904-559d69b90f27" />
  <img width="32%" alt="Screenshot_1767448334" src="https://github.com/user-attachments/assets/bfaa383b-e208-442c-badd-21dedeb22a45" />
  <img width="32%" alt="Screenshot_1767448273" src="https://github.com/user-attachments/assets/d864375f-0290-45ab-a496-d9a693c1a361" />
  <img width="32%" alt="Screenshot_1767423627" src="https://github.com/user-attachments/assets/b23202aa-54e9-4e74-ba79-7f99776811cc" />
  <img width="32%" alt="Screenshot_1767421019" src="https://github.com/user-attachments/assets/7bd5379c-3db2-40fe-941e-14c18c4b43d0" />
</p>

---

## 🧑‍🔧 Vendor App Screenshots

<p>
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/224aff88-245f-4a40-966f-ed77657a1479" />
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/e0191cf7-5808-43e6-99b9-827cb551e08c" />
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/46dc399b-84c8-4a91-90f7-0b8645680d8c" />
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/a9c83c13-f024-4e7b-8056-bbd3b3404136" />
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/9a1faf71-e7ea-4ad9-8394-506687d15667" />
  <img width="32%" alt="Screenshot_1767448444" src="https://github.com/user-attachments/assets/1dae78fd-f45c-4544-ae4e-01edfb6a7650" />
</p>

---

## 🧠 Key Design Decisions

* **State-driven UI** prevents invalid actions
* **OTP-gated transitions** ensure mutual confirmation
* **Separate apps** improve security & clarity
* **Manual refresh** handles async vendor actions
* **Permission-based access** for location services

---

## 🧪 Edge Cases Handled

* Two vendors cannot complete same event
* OTPs are:

  * Time-bound
  * Single-use
  * Event-scoped
* Location permission denial handled gracefully
* Image upload validation
* Unauthorized access blocked

---

## 📌 Assessment Alignment

This project demonstrates:

* Real-world backend workflows
* Secure mobile architecture
* Vendor accountability systems
* Production-grade state management
* Clean separation of concerns

---

## ✨ Future Enhancements

* Real-time updates (WebSockets)
* Geo-fencing validation
* Vendor availability scheduling
* Admin dashboard
* Push notifications
* Payment integration

---

## 👨‍💻 Author

**Rohit Verma**
Full-Stack Developer (MERN + React Native)

---
