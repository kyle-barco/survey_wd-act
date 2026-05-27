# ECHO — School & Community Survey App
> Built with **Express.js + EJS + Prisma + PostgreSQL**

---

## 📁 Project Structure
```
survey-app/
├── prisma/
│   ├── schema.prisma         ← DB models
│   └── seed.js               ← Demo accounts
├── src/
│   ├── app.js                ← Express entry point
│   ├── middleware/
│   │   └── auth.js           ← Role guards (isAdmin, isTeacher, isStudent)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── teacherController.js
│   │   ├── studentController.js
│   │   └── surveyController.js
│   └── routes/
│       ├── auth.js
│       ├── admin.js
│       ├── teacher.js
│       ├── student.js
│       └── survey.js
├── views/
│   ├── partials/             ← header.ejs, footer.ejs
│   ├── auth/                 ← login.ejs, register.ejs
│   ├── admin/                ← dashboard, users, surveys, edit-user
│   ├── teacher/              ← dashboard, profile
│   ├── student/              ← dashboard, profile
│   └── surveys/              ← classroom-feedback, disaster, results
├── public/
│   ├── css/style.css
│   └── js/main.js
└── package.json
```

---

## 🚀 Setup & Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your PostgreSQL connection string:
# DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/survey_db"
# SESSION_SECRET="any-long-random-string"
```

### 3. Create the database
```bash
# In PostgreSQL:
createdb survey_db
```

### 4. Run Prisma migrations
```bash
npm run db:generate
npm run db:migrate
# → Name your migration: "init"
```

### 5. Seed demo accounts
```bash
npm run db:seed
```

### 6. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 7. Open in browser
```
http://localhost:3000
```

---

## 🔐 Demo Accounts (after seeding)

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@surveyhub.edu        | admin123    |
| Teacher | teacher@surveyhub.edu      | teacher123  |
| Student | student@surveyhub.edu      | student123  |

---

## 👥 Role Permissions

| Feature                       | Admin | Teacher | Student |
|-------------------------------|:-----:|:-------:|:-------:|
| Admin Dashboard               |  ✅   |   ❌    |   ❌    |
| Manage Users (CRUD)           |  ✅   |   ❌    |   ❌    |
| View All Surveys              |  ✅   |   ❌    |   ❌    |
| Teacher Dashboard             |  ✅   |   ✅    |   ❌    |
| View Feedback Results         |  ✅   |   ✅    |   ❌    |
| View Disaster Results         |  ✅   |   ✅    |   ❌    |
| Student Dashboard             |  ✅   |   ❌    |   ✅    |
| Submit Classroom Feedback     |  ✅   |   ✅    |   ✅    |
| Submit Disaster Survey        |  ✅   |   ✅    |   ✅    |

---

## 📋 Survey Features

### 🎓 Classroom Feedback Survey
- Name, Grade & Section, Subject (dropdown)
- Teacher Rating: interactive CSS star rating (1–5 ⭐)
- Favorite Lesson (text)
- Suggestions (textarea)
- Anonymous submission toggle
- Notebook-style design with ruled lines

### 🌊 Disaster Preparedness Survey
- Address, Family Members count
- Emergency Kit (Yes/No) — red alert when No
- Evacuation Plan (checkboxes)
- Past Disaster Experience (textarea)
- GIS map placeholder
- Printable report for barangay officials

---

## ✅ Validation

- **Server-side**: `express-validator` in all POST routes
- **Client-side**: Vanilla JS in `public/js/main.js`
- Both layers validate all required fields

---

## 🛠 Tech Stack

| Layer      | Technology           |
|------------|----------------------|
| Backend    | Express.js 4.x       |
| Templating | EJS                  |
| ORM        | Prisma 5.x           |
| Database   | PostgreSQL           |
| Auth       | express-session + bcryptjs |
| Validation | express-validator    |
| Styling    | Custom CSS (Sora + Caveat fonts) |
