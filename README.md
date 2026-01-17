# 📚 Mole Książkowe – Library Management System
A full-stack library management system designed to streamline book loans, reservations, and inventory management. Developed as a University Project for the Object-Oriented Technologies course at AGH University of Krakow.


## 🛠 Tech Stack
### Backend
* Language: Java 25

* Framework: Spring Boot

* Build Tool: Gradle

* Security: Spring Security + JWT (JSON Web Tokens)

* Database: PostgreSQL

### Frontend
* Library: React

* Networking: Axios

### Infrastructure
* Containerization: Docker, Docker Compose

## 🚀 Key Features
* Multi-role Authorization (RBAC): Tailored interfaces and permissions for Readers, Librarians, and Administrators.

* Comprehensive CRUD: Full management of book collections, categories, and individual copies.

* Advanced Loan System: Handles the complete lifecycle of a loan, including due dates and return statuses.

* Smart Reservations: Queuing system for currently unavailable books with automatic status updates.

* Fine-grained Categorization: Support for many-to-many relationships between books and categories.


## 🏗 Architecture & Design Patterns
The system is built with maintainability and security in mind, following industry-standard patterns:

* Domain-Driven Design (DDD): Logic is organized into cohesive modules: User, Book, Loan, and Reservation.

* Layered Architecture: Strict separation of concerns between Controllers (API), Services (Business Logic), and Repositories (Data Access).

* DTO Pattern: Data Transfer Objects are used to decouple the database schema from the API, preventing circular dependencies and enhancing security.

* Business Logic Integrity: Complex validations (ISBN checksums, copy availability, overdue checks) are centralized in the Service layer.


## 🔐 Security
* Authentication: Secure login flow with Spring Security.

* Authorization: JWT-based stateless sessions. Tokens are required in the Authorization: Bearer header for protected resources.

* Role-Based Access Control (RBAC): Access to administrative functions (e.g., adding books, managing users) is strictly enforced based on user roles (ADMIN, LIBRARIAN, READER).


## 📊 Database Model
The system utilizes a relational PostgreSQL schema optimized for library workflows:

* User: Management of credentials and role assignments.

* Book & Category: Complex relationships for efficient searching and filtering.

* BookCopy: Tracking individual physical items and their status (AVAILABLE, LOANED, DAMAGED, etc.).

* Loan & Reservation: Historical tracking of rentals and active waitlists.


## ⚙️ How to Run
The easiest way to get the system up and running is using Docker. This ensures a consistent environment for the database and application.

Prerequisites
* Docker and Docker Compose installed.

1. Clone the repository:
```bash
git clone https://github.com/your-username/mole-ksiazkowe.git
cd mole-ksiazkowe
```

2. Launch with Docker Compose:
```bash
docker-compose up -d
```

3. Access the Application:
* Backend API: http://localhost:8080

* Database: http://localhost:5432

## 👥 Authors
* Adam Głowacki - [github profile](https://github.com/Adasg1)
* Maciej Trznadel - [github profile](https://github.com/mtrznadel24)
* Kajetan Frątczak - [github profile](https://github.com/KajetanFratczak)
* Bartłomiej Kaczyński - [github profile](https://github.com/bartex555)
