# Next.js + Prisma + MySQL - Complete Guide

This is a full-stack web application that manages users in a MySQL database using Next.js
and Prisma ORM.

---

## 📁 Project Structure

```
prisma-test/
├── prisma/
│   ├── schema.prisma      # Database model definitions
│   └── migrations/        # Database migration history
├── pages/
│   ├── index.js           # Dashboard UI (React component)
│   └── api/
│       └── users/
│           ├── index.js   # GET all users, POST create user
│           └── [id].js    # GET single, PUT update, DELETE
├── lib/
│   └── prisma.js          # Prisma Client singleton
├── .env                   # Environment variables (DB connection)
└── package.json           # Project dependencies
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd e:\SRAM_PROJECTS\prisma-test
npm install
```

### 2. Create Database in XAMPP

-   Open phpMyAdmin: `http://localhost/phpmyadmin`
-   Click **New** → Create database named `next_prisma_db`

### 3. Configure Environment

The `.env` file contains:

```
DATABASE_URL="mysql://root:@localhost:3306/next_prisma_db"
```

This tells Prisma where to connect:

-   `mysql://` - Database type
-   `root` - Username (XAMPP default)
-   `` (empty) - Password (XAMPP default, no password)
-   `localhost:3306` - Host and port
-   `next_prisma_db` - Database name

### 4. Push Schema to Database

```bash
npx prisma migrate dev --name init
```

This creates the `users` table in MySQL based on `prisma/schema.prisma`.

### 5. Start Development Server

```bash
npm run dev
```

Open browser: `http://localhost:3000`

---

## 📊 Database Schema

The `users` table has these columns:

| Column      | Type     | Description                     |
| ----------- | -------- | ------------------------------- |
| `id`        | INT      | Auto-incrementing primary key   |
| `name`      | STRING   | User's full name                |
| `email`     | STRING   | User's email (unique)           |
| `createdAt` | DATETIME | Timestamp when user was created |

**Defined in:** `prisma/schema.prisma`

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

---

## 🎯 How It Works: Complete Flow

### CREATE User (Add New)

**Step 1: User fills form on dashboard**

```
Name: John
Email: john@example.com
```

**Step 2: User clicks "Create" button**

-   JavaScript handler `handleSubmit()` is triggered
-   Form data is sent to API via POST request

**Step 3: POST request to `/api/users`**

```javascript
// Browser sends:
POST /api/users
Content-Type: application/json
{
  "name": "John",
  "email": "john@example.com"
}
```

**Step 4: Backend API processes (pages/api/users/index.js)**

```javascript
if (req.method === "POST") {
	const { name, email } = req.body;
	const user = await prisma.user.create({
		data: { name, email },
	});
	return res.status(201).json(user);
}
```

**Step 5: Prisma creates record in MySQL**

```sql
INSERT INTO users (name, email, createdAt)
VALUES ('John', 'john@example.com', NOW())
```

**Step 6: Database returns new user**

```json
{
	"id": 1,
	"name": "John",
	"email": "john@example.com",
	"createdAt": "2026-01-09T11:30:00.000Z"
}
```

**Step 7: Dashboard updates automatically**

-   Success message shows
-   Dashboard fetches updated users list
-   New user appears in table

---

### READ Users (View List)

**User lands on dashboard → Page loads**

**JavaScript executes on component mount:**

```javascript
useEffect(() => {
	fetchUsers(); // Called when page loads
}, []);
```

**fetchUsers() function:**

```javascript
const res = await fetch("/api/users");
const data = await res.json();
setUsers(data); // Update React state
```

**GET request to `/api/users`:**

```javascript
if (req.method === "GET") {
	const users = await prisma.user.findMany();
	return res.status(200).json(users);
}
```

**Database query:**

```sql
SELECT * FROM users
```

**Result: All users displayed in table**

---

### UPDATE User (Edit)

**User clicks "Edit" button on a user row**

```javascript
handleEdit(user); // Sets editingId and populates form
```

**Form shows with existing data**

-   editingId = 5 (for example)
-   Form shows name and email of user #5
-   Submit button changes to "Update"

**User modifies fields and clicks "Update"**

**PUT request to `/api/users/5`:**

```javascript
PUT /api/users/5
Content-Type: application/json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

**Backend processes:**

```javascript
if (req.method === "PUT") {
	const { name, email } = req.body;
	const user = await prisma.user.update({
		where: { id },
		data: { name, email },
	});
	return res.status(200).json(user);
}
```

**Database updates:**

```sql
UPDATE users
SET name = 'John Updated', email = 'john.new@example.com'
WHERE id = 5
```

**Dashboard refreshes and shows updated user**

---

### DELETE User (Remove)

**User clicks "Delete" button**

```javascript
handleDelete(id); // User confirms in dialog
```

**Confirmation dialog appears:**

```
"Are you sure you want to delete?"
```

**If user confirms:**

**DELETE request to `/api/users/5`:**

```javascript
DELETE / api / users / 5;
```

**Backend processes:**

```javascript
if (req.method === "DELETE") {
	await prisma.user.delete({ where: { id } });
	return res.status(204).end(); // 204 = success, no content
}
```

**Database deletes:**

```sql
DELETE FROM users WHERE id = 5
```

**Dashboard refreshes and user disappears from table**

---

## 📂 Key Files Explained

### 1. `prisma/schema.prisma`

**Purpose:** Define database structure

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

**What it does:**

-   Tells Prisma to use MySQL
-   Gets connection URL from `.env`
-   Defines User model with fields
-   `@id` = primary key
-   `@default(autoincrement())` = auto-increment ID
-   `@unique` = email must be unique
-   `@default(now())` = set current time automatically

---

### 2. `lib/prisma.js`

**Purpose:** Manage database connection

```javascript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

export default prisma;
```

**Why this matters:**

-   Creates one PrismaClient instance (singleton pattern)
-   In development, caches it globally to avoid reconnecting
-   Next.js hot-reload doesn't create new connections
-   Prevents "too many connections" errors
-   Used in all API routes

---

### 3. `pages/api/users/index.js`

**Purpose:** Handle all users operations

```javascript
export default async function handler(req, res) {
	if (req.method === "GET") {
		// Get all users
		const users = await prisma.user.findMany();
		return res.status(200).json(users);
	}

	if (req.method === "POST") {
		// Create new user
		const { name, email } = req.body;
		const user = await prisma.user.create({ data: { name, email } });
		return res.status(201).json(user);
	}
}
```

**Handles:**

-   `GET /api/users` → Return all users
-   `POST /api/users` → Create new user

---

### 4. `pages/api/users/[id].js`

**Purpose:** Handle single user operations

```javascript
export default async function handler(req, res) {
	const id = Number(req.query.id);

	if (req.method === "GET") {
		// Get single user
		const user = await prisma.user.findUnique({ where: { id } });
		return res.status(200).json(user);
	}

	if (req.method === "PUT") {
		// Update user
		const user = await prisma.user.update({ where: { id }, data: req.body });
		return res.status(200).json(user);
	}

	if (req.method === "DELETE") {
		// Delete user
		await prisma.user.delete({ where: { id } });
		return res.status(204).end();
	}
}
```

**Handles:**

-   `GET /api/users/1` → Return user with id=1
-   `PUT /api/users/1` → Update user with id=1
-   `DELETE /api/users/1` → Delete user with id=1

---

### 5. `pages/index.js`

**Purpose:** Dashboard UI (React component)

**Key parts:**

**State Management:**

```javascript
const [users, setUsers] = useState([]); // List of all users
const [loading, setLoading] = useState(true); // Loading indicator
const [error, setError] = useState(""); // Error message
const [success, setSuccess] = useState(""); // Success message
const [editingId, setEditingId] = useState(null); // Currently editing user
const [formData, setFormData] = useState({ name: "", email: "" }); // Form data
```

**Functions:**

| Function              | What it does                  |
| --------------------- | ----------------------------- |
| `fetchUsers()`        | GET request to `/api/users`   |
| `handleInputChange()` | Update form when user types   |
| `handleSubmit()`      | POST (create) or PUT (update) |
| `handleEdit()`        | Populate form for editing     |
| `handleDelete()`      | DELETE request                |
| `handleCancel()`      | Cancel editing                |

**UI Components:**

-   Form (create/edit users)
-   Alerts (success/error messages)
-   Table (display all users)
-   Action buttons (Edit, Delete)

---

## 🔄 API Endpoints Reference

### GET /api/users

**Get all users**

Request:

```
GET http://localhost:3000/api/users
```

Response:

```json
[
	{
		"id": 1,
		"name": "John",
		"email": "john@example.com",
		"createdAt": "2026-01-09T11:30:00.000Z"
	},
	{
		"id": 2,
		"name": "Sarah",
		"email": "sarah@example.com",
		"createdAt": "2026-01-09T11:35:00.000Z"
	}
]
```

---

### POST /api/users

**Create new user**

Request:

```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Mike",
  "email": "mike@example.com"
}
```

Response:

```json
{
	"id": 3,
	"name": "Mike",
	"email": "mike@example.com",
	"createdAt": "2026-01-09T11:40:00.000Z"
}
```

---

### GET /api/users/[id]

**Get single user**

Request:

```
GET http://localhost:3000/api/users/1
```

Response:

```json
{
	"id": 1,
	"name": "John",
	"email": "john@example.com",
	"createdAt": "2026-01-09T11:30:00.000Z"
}
```

---

### PUT /api/users/[id]

**Update user**

Request:

```
PUT http://localhost:3000/api/users/1
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

Response:

```json
{
	"id": 1,
	"name": "John Updated",
	"email": "john.new@example.com",
	"createdAt": "2026-01-09T11:30:00.000Z"
}
```

---

### DELETE /api/users/[id]

**Delete user**

Request:

```
DELETE http://localhost:3000/api/users/1
```

Response:

```
204 No Content
```

---

## 🛠️ Common Tasks

### Add a field to User model

1. Edit `prisma/schema.prisma`:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  phone     String   // Add this line
  createdAt DateTime @default(now())
}
```

2. Create migration:

```bash
npx prisma migrate dev --name add_phone
```

3. Update form in `pages/index.js` to include phone field

---

### Check database in phpMyAdmin

1. Open: `http://localhost/phpmyadmin`
2. Click `next_prisma_db` database
3. Click `users` table
4. See all records with columns

---

### Check database with Prisma Studio

```bash
npx prisma studio
```

Opens interactive UI at `http://localhost:5555`

---

## 🐛 Debugging

### Check API errors

-   Open browser DevTools (F12)
-   Go to Console tab
-   Look for error messages
-   Check Network tab to see API responses

### Check database connection

```bash
npx prisma db execute --stdin
SELECT COUNT(*) FROM users;
```

### Restart everything

```bash
# Kill all Node processes
Get-Process node | Stop-Process -Force

# Start dev server
npm run dev
```

---

## 📝 Summary

**The flow is:**

1. **User types in form** on dashboard
2. **JavaScript sends API request** (POST/PUT/DELETE)
3. **Next.js API route processes request** using Prisma
4. **Prisma executes SQL** on MySQL database
5. **Database returns result**
6. **API sends response** to frontend
7. **JavaScript updates dashboard** with new data
8. **User sees changes** in real-time

**All CRUD operations follow this pattern!**

---

## 📞 Need Help?

-   Check error messages in browser console (F12)
-   Check terminal where `npm run dev` is running
-   Verify MySQL is running in XAMPP Control Panel
-   Verify database name in `.env` matches phpMyAdmin

Happy coding! 🚀
