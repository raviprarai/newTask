🗂️ Project Management Tool

A  Project Management application built with Express ( Node 18+ ), MongoDB.  It supports JWT authentication, project & task CRUD, pagination, filtering, and an automated seed script for quick demos.

✨ Features

Area                                            Capability

Auth                                         Email + password registration/login, bcrypt hashing, JWT
Projects                                     Create / update / delete, pagination, search, status (active / completed)
Tasks                                        Nested under projects; CRUD, status (todo, in‑progress, done), due‑date; filter by status
Validation                                   JOI 
Seed Script                                  node seed.js ⇒ 1 demo user, 2 projects × 3 tasks each
Tests                                        Postmen

🖇️ Tech Stack

1-Backend   Express  • Mongoose  • jsonwebtoken  • bcrypt 
2-Database  MongoDB  (local or Atlas)
2-Testing   Postmen


📁 Folder Structure (Backend)

newTaskApi/
├── server.js               # Entry‑point (Express app)
├── database/
│   └── db.js               # Mongo connection helper
├── controller/            # Route handlers
├── router/                 # Express routers
├── model/                 # Mongoose schemas
├── middleware/             # Auth / validation middleware
├── seed/seed.js            # Seeder script
├── validation/                   # Joi
└── package.json

Backend Setup (Express)

# 1. clone & install
$ git clone https://github.com/raviprarai/newTask.git
$ npm install      # or npm 

# 3. (optional) seed demo data
$ node seed.js           # creates demo user + data

# 4. start API in dev mode (hot reload via nodemon)
$ npm run dev

# 5. access
API →  http://localhost:3000


📝 Seed Script

The seeder wipes existing data and populates collections with dummy records for fast QA.
node seed.js

Users → 1 (test@example.com / Test@123)
Projects → 2 (Project Alpha, Project Beta)
Tasks → 3 each project (todo, in‑progress, done)

🌐 Live Demo (optional)

API – https://newtask-w5d0.onrender.com/

© License

Released under the MIT License – see LICENSE.