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
├── .env               # env ไฟล์เดียวทั้งระบบ (ไม่ commit)
├── .env.example
└── docker-compose.yml
```

## Environment (ไฟล์เดียว)

ใช้แค่ **`.env` ที่ root** — Docker / Frontend / Backend อ่านร่วมกัน

```bash
cp .env.example .env
```

## รันด้วย Docker

### รันทั้งหมด
```bash
docker compose up --build
```
- Frontend: http://localhost:3000  
- Backend:  http://localhost:8080/health  
- pgAdmin:  http://localhost:5050  
  - Login: ตามค่าใน `.env` (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`)  
  - Add Server: Host=`db`, Port=`5432`, User/Pass/DB ตาม `POSTGRES_*`  
- Postgres จากเครื่อง: `localhost:${POSTGRES_HOST_PORT}`

### รันแค่ Frontend
```bash
docker compose up --build frontend
```

### รันแค่ Backend (+ DB)
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
npm install
npm run dev
```

### Backend
```bash
cd backend
go mod tidy
go run ./cmd/server
```
