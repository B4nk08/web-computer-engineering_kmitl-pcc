# CE KMITL-PCC Web Application

เว็บไซต์สาขาวิศวกรรมคอมพิวเตอร์ KMITL PCC  
Frontend: **Next.js + Tailwind CSS + shadcn/ui**  
Backend: **Go (Gin + Gorm)** + PostgreSQL  

## โครงสร้าง

```
.
├── frontend/          # Next.js
├── backend/           # Go Gin + Gorm
├── docs/
└── docker-compose.yml
```

## รันด้วย Docker

### รันทั้งหมด
```bash
docker compose up --build
```
- Frontend: http://localhost:3000  
- Backend:  http://localhost:8080/health  
- pgAdmin:  http://localhost:5050  
  - Login: `admin@admin.com` / `admin`  
  - ตอน Add Server ใช้ Host = `db`, Port = `5432`, User = `ce`, Password = `ce`, DB = `ce_web`  
- Postgres จากเครื่อง (ถ้าใช้แอปอื่น): `localhost:5433` (user/pass = `ce`/`ce`) 

### รันแค่ Frontend
ใน `docker-compose.yml` **comment** ส่วน `db` และ `backend` แล้วรัน:
```bash
docker compose up --build frontend
```

### รันแค่ Backend (+ DB)
**comment** ส่วน `frontend` แล้วรัน:
```bash
docker compose up --build db backend
```

### หยุด
```bash
docker compose down
```

## รันแบบ Local (ไม่ใช้ Docker)

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend
ต้องมี Go 1.22+ และ PostgreSQL

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/server
```

## เพิ่ม shadcn component
```bash
cd frontend
npx shadcn@latest add <component>
```
