# ✦ DayPlanner — Full Stack App

> Java Spring Boot + React 18 + PostgreSQL

---

## 🗂️ Project Structure

```
dayplanner-final/
├── backend/          ← Java 17 + Spring Boot 3.2 (Maven)
│   ├── pom.xml
│   └── src/main/java/com/dayplanner/
│       ├── DayPlannerApplication.java
│       ├── model/         User, Task, Expense, Note
│       ├── repository/    JPA Repositories
│       ├── service/       Business Logic
│       ├── controller/    REST APIs (/api/*)
│       ├── security/      JWT Filter + Util
│       ├── config/        SecurityConfig (CORS + BCrypt)
│       └── dto/           Request/Response objects
└── frontend/         ← React 18
    ├── package.json
    └── src/
        ├── App.js           (routing: / → login → /dashboard)
        ├── pages/
        │   ├── Landing.js   ← shown first at localhost:3000
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── Tasks.js
        │   ├── Expenses.js
        │   └── Notes.js
        ├── components/Layout.js
        ├── context/AuthContext.js
        └── api/client.js
```

---

## 🖥️ App Flow

```
localhost:3000  →  Landing Page (scroll, features, CTA)
                       ↓  click Get Started / Sign In
                   Register / Login
                       ↓  success
                   Dashboard  →  Tasks / Expenses / Notes
                       ↓  Logout
                   Landing Page
```

---

## ⚙️ SETUP FROM SCRATCH (Fresh VM / Ubuntu)

### STEP 1 — Install Java 17

```bash
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install -y openjdk-17-jdk

# Verify
java -version
# Should show: openjdk version "17.x.x"
```

### STEP 2 — Install Maven

```bash
sudo apt install -y maven

# Verify
mvn -version
# Should show: Apache Maven 3.x.x
```

### STEP 3 — Install Node.js 20

```bash
# Install Node via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v   # v20.x.x
npm -v    # 10.x.x
```

### STEP 4 — Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << SQL
CREATE DATABASE dayplanner;
CREATE USER dayplanner WITH PASSWORD 'dayplanner123';
GRANT ALL PRIVILEGES ON DATABASE dayplanner TO dayplanner;
\q
SQL

# Verify connection
psql -U dayplanner -d dayplanner -h localhost -c "\l"
# Enter password: dayplanner123
```

### STEP 5 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/dayplanner
spring.datasource.username=dayplanner
spring.datasource.password=dayplanner123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
jwt.secret=dayplanner-secret-key-replace-in-production-min-256bit
jwt.expiration=86400000
```

### STEP 6 — Run the Backend

```bash
cd dayplanner-final/backend
mvn spring-boot:run

# You should see:
# Started DayPlannerApplication in X.XXX seconds
# Backend running at: http://localhost:8080
```

> Leave this terminal open. Open a NEW terminal for frontend.

### STEP 7 — Run the Frontend

```bash
cd dayplanner-final/frontend
npm install          # installs all packages (first time only)
npm start            # starts dev server

# You should see:
# Compiled successfully!
# Local: http://localhost:3000
```

### STEP 8 — Open in Browser

```
http://localhost:3000
```

**You will see:**
1. 🏠 Landing page (scroll down to see features, tech stack)
2. Click **Get Started** → Register page → fill name/email/password
3. Automatically redirected to **Dashboard**
4. Navigate: Tasks → Expenses → Notes from sidebar

---

## 🔌 API Endpoints (backend at :8080)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login → JWT token |
| GET | /api/tasks | Yes | Get all tasks |
| POST | /api/tasks | Yes | Create task |
| PATCH | /api/tasks/{id}/toggle | Yes | Mark done/pending |
| DELETE | /api/tasks/{id} | Yes | Delete task |
| GET | /api/expenses | Yes | Get all expenses |
| POST | /api/expenses | Yes | Add expense |
| GET | /api/expenses/summary/{year}/{month} | Yes | Monthly summary |
| GET | /api/notes | Yes | Get all notes |
| POST | /api/notes | Yes | Create note |
| PUT | /api/notes/{id} | Yes | Update note |

---

## ❗ Common Issues

**Backend fails to start:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DB exists: `psql -U dayplanner -d dayplanner -h localhost`

**Frontend shows API errors:**
- Make sure backend is running on port 8080 first
- `package.json` has `"proxy": "http://localhost:8080"` which forwards `/api` calls

**Port already in use:**
```bash
# Kill process on port 8080
sudo lsof -ti:8080 | xargs kill -9
# Kill process on port 3000
sudo lsof -ti:3000 | xargs kill -9
```

**npm install fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Next Steps

| Phase | What |
|-------|------|
| Phase 2 | Docker + docker-compose |
| Phase 3 | CI/CD with GitHub Actions + K8s |
| Phase 4 | AWS + Terraform + ArgoCD |
