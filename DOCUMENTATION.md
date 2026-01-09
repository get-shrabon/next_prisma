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
# Next.js + Prisma + MySQL — Quick Guide

This project is a simple user-management app using Next.js for the frontend and API routes, Prisma as the ORM, and MySQL as the database.

**Essentials (short):**
- Purpose: Create, read, update, and delete users.
- DB: MySQL, configured via `DATABASE_URL` in `.env`.
- ORM: Prisma (schema in `prisma/schema.prisma`).
- Dev start: `npm install` then `npm run dev`.

**Quick workflow:**
- Frontend sends HTTP requests to Next.js API routes for users.
- API routes use the Prisma client to query or modify the database.
- The frontend refreshes its list after each change.

**Database model (summary):**
- User: `id` (primary key), `name`, `email` (unique), `createdAt`.

**Where to look:**
- `prisma/schema.prisma`: model definitions and datasource.
- `lib/prisma.js`: Prisma client singleton used by API routes.
- `pages/api/users/index.js`: list and create users.
- `pages/api/users/[id].js`: read, update, delete a single user.
- `pages/index.js`: simple dashboard UI with a form and users table.

**Common tasks (short):**
- Add a new field: update `schema.prisma`, run `npx prisma migrate dev`.
- Inspect data: run `npx prisma studio` or use phpMyAdmin.

**Troubleshooting:**
- If DB connection fails, verify `DATABASE_URL` and that MySQL is running.
- For too many connections in development, ensure `lib/prisma.js` exports a cached PrismaClient.
- Use browser DevTools Network tab to inspect API requests and responses.

If you want this even shorter (one-page checklist) or translated into step-by-step setup, tell me which format you prefer.
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
