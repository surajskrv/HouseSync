# 🏠 HomeSync

A multi-user home services management platform built with **Flask**, **Vue.js**, and **SQLite**.  
It enables seamless coordination between **Admins**, **Service Professionals**, and **Customers** for complete home-service solutions.

---

## 📌 Project Overview

**HomeSync** provides a structured system for managing services, users, and service requests with an intuitive, responsive interface.  
It includes role-based authentication, service lifecycle management, and powerful admin tools.

---

## ⭐ Features

### 🔐 Role-Based Access Control (RBAC)

#### **Admin**

- User management (block/unblock)
- Professional approval/rejection
- Full service CRUD
- System monitoring & fraud prevention

#### **Service Professional**

- Accept or reject jobs
- Manage own profile
- Complete service jobs
- View job history

#### **Customer**

- Register & create service requests
- Edit, close, or cancel requests
- Provide ratings
- Search services

### 💼 Service Management

- Add, update, delete services
- Assign base prices

### 📦 Service Request Handling

- Complete lifecycle: Create → Assign → Work → Close/Cancel

### 👤 User Management

- Real-time monitoring
- Admin-level control

### 🔎 Search Functionality

- Service search (by name/location)
- Admin-level professional search

### 🌐 Responsive UI

- Built using Vue.js & Bootstrap

### 🔐 Authentication

- Secure session-based login

---

## 🛠 Tech Stack

| Layer | Technology |
|------|------------|
| **Backend** | Flask (Python) |
| **Database** | SQLite |
| **Frontend** | Vue.js, Bootstrap |
| **Templating** | Jinja2 |

---
---

## ⚙ Installation & Setup

### 1️⃣ Clone the Repository

```bash
# 1. Clone the repo
git clone <repository_url>
cd <project_directory>

# 2. Create a vertuila environment and install dependencies
python -m venv .env
.env\Scripts\activate   # Windows
pip install -r requirements.txt

# 3. Run the appliction
python app.py
```

## 👥 User Roles & Authentication

### 👨‍💼 **Admin**

- Pre-configured account  
- Manages services and users  
- Approves/blocks professionals  

### 🛠 **Service Professional**

- Registers independently  
- Accepts and completes service jobs  
- Manages profile  

### 👨‍👩‍👧 **Customer**

- Registers independently  
- Creates, edits, and closes service requests  
- Rates professionals  

---

# 🔌 API Endpoints
---

## 🔓 **Authentication & Public**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login for all user types |
| POST | `/api/logout` | Logout |
| POST | `/api/register/customer` | Customer registration |
| POST | `/api/register/prof` | Professional registration |
| GET  | `/api/public/services` | Fetch all service categories |

---

## 🛠 **Admin Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all non-admin users |
| GET | `/api/admin/summary` | Dashboard summary stats |
| GET | `/api/admin/stats` | Analytics data |
| POST | `/api/admin/user/<id>/toggle_status` | Block/unblock user |
| POST | `/api/admin/professional/<id>/verify` | Approve professional |
| POST | `/api/admin/professional/<id>/reject` | Reject/delete professional |
| GET | `/api/services` | Get all services |
| POST | `/api/services` | Create new service |
| PUT | `/api/services/<service_id>` | Update service |
| DELETE | `/api/services/<service_id>` | Delete service |

---

## 🛠 **Professional Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prof/profile` | Get professional profile |
| PUT | `/api/prof/profile` | Update professional profile |
| GET | `/api/prof/available_requests` | Unassigned requests |
| GET | `/api/prof/my_jobs` | Job history |
| POST | `/api/prof/request/<id>/accept` | Accept request |
| POST | `/api/prof/request/<id>/reject` | Reject/Cancel job |
| POST | `/api/prof/job/<id>/close` | Mark job completed |

---

## 👤 **Customer Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| GET | `/api/user/services` | List services |
| GET | `/api/user/requests` | Request history |
| POST | `/api/user/request` | Create service request |
| GET | `/api/user/request/<id>` | Request details |
| PUT | `/api/user/request/<id>` | Edit pending request |
| POST | `/api/user/request/<id>/close` | Close request + rating |
| POST | `/api/user/request/<id>/cancel` | Cancel request |

---

## 🎉 Enhancements Included

- Clean formatting  
- Improved hierarchy  
- Icons for clarity  
- Organized endpoint tables  
- Developer-friendly layout  

## 📁 Folder Structure

```bash

HouseSync/
├── .gitignore
├── app.py
├── README.md
├── requirements.txt
│
├── application/
│   ├── config.py
│   ├── create_data.py
│   ├── extensions.py
│   ├── models.py
│   └── routes/
│     ├── adminRoutes.py
│     ├── authRoutes.py
│     ├── profRoutes.py
│     └── userRoutes.py
│
├── instance/
│     └── housesync.db
│
├── static/
│   ├── script.js
│   ├── components/
│   │   ├── AdminDashboard.js
│   │   ├── AdminSearch.js
│   │   ├── AdminSummary.js
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── ProDashboard.js
│   │   ├── ProRegister.js
│   │   ├── ProSearch.js
│   │   ├── ProSummary.js
│   │   ├── UserDashboard.js
│   │   ├── UserRegister.js
│   │   ├── UserSearch.js
│   │   └── UserSummary.js
│   │
│   ├── css/
│   │   ├── home.css
│   │   ├── nav.css
│   │   └── password.css
│   │
│   └── img/
│       ├── error.png
│       ├── eye-close.png
│       ├── eye-open.png
│       └── favicon.ico
│
└── templates/
    └── index.html
  
```
