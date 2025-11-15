# 🚀 Deploy Instructions

## Deploy trên Render.com

### 1. Push code lên GitHub

### 2. Tạo Web Service mới trên Render
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && node server.js`
- Environment: Docker

### 3. Đợi deploy xong (~5-10 phút)

### 4. Chạy keep-alive service
Trên máy local hoặc VPS khác:
```bash
cd backend
BACKEND_URL=https://your-app.onrender.com npm run keep-alive
```

## Test local với Docker

```bash
# Build và chạy
docker-compose up --build

# Dừng
docker-compose down
```

## Test trực tiếp

```bash
cd backend
npm install
npm start
```

Frontend: Mở `frontend/index.html` trong browser

---

**Lưu ý**: 
- File video tự động xóa sau 10 phút kể từ khi user download
- Render free tier sẽ sleep sau 15 phút không dùng
- Dùng keep-alive để tránh sleep
