# Next.js + Prisma + MySQL (XAMPP) — Quick Start Guide

## Setup

### 1. Create Database in XAMPP

-   Open phpMyAdmin: `http://localhost/phpmyadmin`
-   Click **New**
-   Database name: `next_prisma_db`
-   Click **Create**

### 2. Configure `.env` (Most Important)

```env
DATABASE_URL="mysql://root:@localhost:3306/next_prisma_db"
```

**Breakdown:**

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE
         ↓    ↓         ↓    ↓    ↓
        root  (empty)  localhost 3306  next_prisma_db
```

### 3. Prisma Setup

```bash
cd e:\SRAM_PROJECTS\prisma-test
npm install
npx prisma migrate dev --name init
```

This creates the `users` table in MySQL.

### 4. Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

## XAMPP MySQL Credentials (Default)

| Key      | Value                     |
| -------- | ------------------------- |
| DB Type  | `mysql`                   |
| Host     | `localhost` / `127.0.0.1` |
| Port     | `3306`                    |
| Database | `next_prisma_db`          |
| Username | `root`                    |
| Password | (empty)                   |

---

## API Routes

-   `GET /api/users` — Get all users
-   `POST /api/users` — Create new user (body: `{ name, email }`)
-   `GET /api/users/:id` — Get single user
-   `PUT /api/users/:id` — Update user
-   `DELETE /api/users/:id` — Delete user

---

## Testing Examples

### Create user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John\",\"email\":\"john@example.com\"}"
```

### Get all users:

```bash
curl http://localhost:3000/api/users
```

### Get single user:

```bash
curl http://localhost:3000/api/users/1
```

### Update user:

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Updated\",\"email\":\"john.new@example.com\"}"
```

### Delete user:

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## File Structure

| File                       | Purpose                                     |
| -------------------------- | ------------------------------------------- |
| `prisma/schema.prisma`     | Database model definitions                  |
| `.env`                     | MySQL connection string                     |
| `lib/prisma.js`            | PrismaClient singleton (connection manager) |
| `pages/api/users/index.js` | GET all, POST create                        |
| `pages/api/users/[id].js`  | GET single, PUT update, DELETE              |
| `pages/index.js`           | Dashboard UI                                |

---

## Features

✅ Clean dashboard interface ✅ Full CRUD operations (Create, Read, Update, Delete) ✅
Real-time error and success messages ✅ Form validation ✅ Responsive design ✅
Production-grade error handling

---

## Documentation

**For detailed explanations of how everything works**, see
[DOCUMENTATION.md](./DOCUMENTATION.md)

This includes:

-   Complete flow diagrams
-   How each operation works (CREATE, READ, UPDATE, DELETE)
-   API endpoint reference
-   Key files explained
-   Debugging tips

---

## Next Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Open dashboard: `http://localhost:3000`
3. ✅ Create some test users
4. ✅ Edit and delete users
5. ✅ Check phpMyAdmin to see changes: `http://localhost/phpmyadmin`

---

**Need detailed explanation?** Open [DOCUMENTATION.md](./DOCUMENTATION.md) 📖
