# 🚀 How to Run MoveMate in VS Code Terminal

This guide provides **exact, copy-and-paste commands** to run the complete MoveMate full-stack application (Spring Boot Backend + React Frontend) inside your VS Code terminal.

---

## 🔑 Demo Login Credentials

You can log in directly using any of the pre-configured demo credentials below, or click **"Get Started" / "Sign Up"** in the web app to create a new account:

### 1. 🛡️ System Administrator Account
- **Email:** `admin@movemate.com`
- **Password:** `Password123!`
- **Role:** `ADMIN` (Access to Admin Dashboard, Analytics, User Management, Moderation Queue, Audit Logs)

### 2. 👤 Regular Relocator User Account
- **Email:** `user@movemate.com`
- **Password:** `Password123!`
- **Role:** `USER` (Access to Communities, Feed, Messages, Housing, Services, Events)

### 3. ✍️ Register a New Account
- Click **"Get Started"** or **"Sign Up"** on `http://localhost:5173`.
- Enter your Full Name, Email, and Password to create a brand-new user profile.

---

## 📌 Prerequisites

Before running the commands, ensure you have:
1. **Java 21 (JDK 21)** installed.
2. **Node.js (v18+) & npm** installed.
3. **Maven** installed (or system `mvn`).

---

## ⚡ Option A: Step-by-Step Copy & Paste Commands

### Step 1: Open VS Code Terminal
Press `Ctrl + ~` (or `Ctrl + Shift + \``) in VS Code to open the integrated terminal.

---

### Step 2: Start the Backend (Terminal 1)

Paste and run the following command in **Terminal 1**:

```powershell
cd "c:\Users\vspat\OneDrive\Desktop - Copy\Desktop\MoveMate\backend"
mvn spring-boot:run
```

> **Backend Server URL:** `http://localhost:8080`  
> **API Base Endpoint:** `http://localhost:8080/api/v1`  
> **Health Check:** `http://localhost:8080/api/v1/health`  
> **Database:** Embedded H2 Zero-Config (`/h2-console`)

---

### Step 3: Start the Frontend (Terminal 2)

Click the **`+`** icon in VS Code Terminal to open **Terminal 2**, then paste and run:

```powershell
cd "c:\Users\vspat\OneDrive\Desktop - Copy\Desktop\MoveMate\frontend"
npm run dev
```

> **Frontend Application URL:** `http://localhost:5173`

---

## 🛑 How to Stop Old Processes (If port 5173 is occupied)

If your browser opens an old project on `http://localhost:5173`, run this command in VS Code Terminal to stop all old background processes:

```powershell
Stop-Process -Name "node" -Force
```

Then re-run:
```powershell
cd "c:\Users\vspat\OneDrive\Desktop - Copy\Desktop\MoveMate\frontend"
npm run dev
```

---

## 🎯 Quick Copy-Paste One-Liners for VS Code

### Backend One-Liner (PowerShell):
```powershell
cd "c:\Users\vspat\OneDrive\Desktop - Copy\Desktop\MoveMate\backend"; mvn spring-boot:run
```

### Frontend One-Liner (PowerShell):
```powershell
cd "c:\Users\vspat\OneDrive\Desktop - Copy\Desktop\MoveMate\frontend"; npm run dev
```
