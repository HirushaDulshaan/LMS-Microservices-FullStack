# 🎓 LMS Microservices Platform - Full Stack

A modern, scalable **Learning Management System (LMS)** built using a **Microservices Architecture**. This platform empowers instructors to create and manage courses efficiently while providing students with a smooth and engaging learning experience.

---

## 🚀 Tech Stack

### 🧠 Backend (Microservices)

* **Java 17** with **Spring Boot 3**
* **Spring Cloud** (Eureka Service Registry, API Gateway, OpenFeign)
* **Databases:** MySQL & PostgreSQL
* **ORM:** Hibernate (JPA) & Prisma (Node.js service)
* **Authentication:** JWT (JSON Web Tokens)
* **Node.js Service:** Enrollment Service powered by Prisma ORM

### 🎨 Frontend

* **Angular 17+**
* **Angular Material** (Modern UI Components)
* **Bootstrap 5** (Responsive Design)

---

## 🏗️ Architecture Overview

This system follows a **Microservices Architecture**, where each service is independently deployable and responsible for a specific domain.

### 🔹 Core Services

1. **🧭 Service Registry (Eureka)**

   * Handles service registration and discovery
   * Enables dynamic communication between services

2. **🚪 API Gateway**

   * Single entry point for all client requests
   * Handles routing, authentication, and security

3. **🔐 Auth Service**

   * User registration and login
   * JWT token generation and validation

4. **📚 Course Service**

   * Course creation and management
   * Lesson handling and categorization

5. **📝 Enrollment Service (Node.js)**

   * Manages student enrollments
   * Built using Prisma ORM and PostgreSQL

---

## 🛠️ Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

* **JDK 17+**
* **Node.js & npm**
* **Maven**
* **MySQL / PostgreSQL**
* **Angular CLI**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/HirushaDulshaan/LMS-Microservices-FullStack.git
cd LMS-Microservices-FullStack
```

---

### 2️⃣ Setup Databases

Create the following databases:

* `auth_db`
* `course_db`
* `enrollment_db`

Update database credentials inside each service's `application.yml` or `.env` file.

---

### 3️⃣ Run Microservices (⚠️ Order Matters)

Start services in the following order:

1. ▶️ **Service Registry (Eureka Server)**
2. ▶️ **API Gateway**
3. ▶️ **Auth Service**
4. ▶️ **Course Service**
5. ▶️ **Enrollment Service**

---

### 4️⃣ Run Frontend

```bash
cd lms-frontend
npm install
ng serve
```

Frontend will be available at:
👉 [http://localhost:4200](http://localhost:4200)

---

## 🔐 Authentication Flow

* User logs in via **Auth Service**
* JWT token is generated
* Token is sent with every request
* API Gateway validates and routes requests securely

---

## 🌟 Key Features

* ✅ Microservices-based scalable architecture
* ✅ Secure JWT authentication
* ✅ Course & lesson management
* ✅ Student enrollment system
* ✅ API Gateway routing
* ✅ Service discovery with Eureka
* ✅ Modern Angular UI

---

## 📌 Future Improvements

* 🔄 Payment integration
* 📊 Analytics dashboard
* 📱 Mobile app support
* 🔔 Notification service

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 💡 Author

**Hirusha Dulshan**

---

🔥 *Build. Scale. Learn.*
