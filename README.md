# Student Management System

Simple full-stack web app to manage student records (Add / View / Search / Edit / Delete).

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript (plain, no framework)
- **Backend:** Node.js + Express
- **Database:** SQLite (file-based, no separate DB server needed)

## Folder Structure
```
student-management/
├── backend/
│   ├── db/
│   │   └── database.js      # SQLite connection + table setup
│   ├── routes/
│   │   └── students.js      # CRUD API routes
│   ├── server.js            # Express server entry point
│   └── package.json
├── frontend/
│   ├── index.html           # Student Management module UI
│   ├── style.css
│   └── script.js
└── README.md
```

## How to Run

1. Make sure **Node.js** (v16 or higher) is installed on your system.
2. Open a terminal and go into the backend folder:
   ```
   cd student-management/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and go to:
   ```
   http://localhost:5000
   ```

The SQLite database file (`students.db`) will be created automatically inside
`backend/db/` the first time you run the server — no manual DB setup needed.

## Module Included: Student Management
- Add new student (Name, Roll No, Department, Year, Email, Phone)
- View all students in a table
- Search students by name or roll number
- Edit existing student details
- Delete a student

## API Endpoints (Backend)
| Method | Endpoint              | Description          |
|--------|------------------------|-----------------------|
| GET    | /api/students          | Get all students (supports ?search=) |
| GET    | /api/students/:id      | Get one student       |
| POST   | /api/students          | Add new student       |
| PUT    | /api/students/:id      | Update student        |
| DELETE | /api/students/:id      | Delete student        |

## Notes
- Roll No must be unique.
- To add more modules later (e.g. Attendance, Marks, Fees), you can follow the
  same pattern: create a new table in `db/database.js`, a new route file in
  `backend/routes/`, and a new section in the frontend.
