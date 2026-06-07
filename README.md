# Store Rating Platform

A web app where users can browse stores and submit ratings (1–5 stars).

---

## What is Used

- **Frontend** — React.js
- **Backend** — Node.js + Express
- **Database** — MySQL
- **Login System** — JWT Tokens + bcrypt

---

## How to Run

### 1. Create Database
```bash
mysql -u root -p -e "CREATE DATABASE store_ratings_db;"
```

### 2. Start Backend
```bash
cd backend
copy .env.example .env
npm install
npm start
```

### 3. Start Frontend
```bash
cd frontend
copy .env.example .env
npm install
npm start
```

Open **http://localhost:3000** in your browser.

---

## Login

| Email | Password | Role |
|-------|----------|------|
| admin@storerating.com | Admin@1234 | Admin |

---

## How to Create a User

1. Login as Admin
2. Click **Users** → **Add User**
3. Fill Name, Email, Password, Role
4. Click **Submit**

---

## How to Create a Store

1. Login as Admin
2. Click **Stores** → **Add Store**
3. Fill Store Name, Email, Address
4. Click **Submit**

---

## How to Rate a Store

1. Login as Normal User
2. Browse the stores list
3. Click the stars (1 to 5)
4. Click **Submit Rating**

---

## API Quick Reference

