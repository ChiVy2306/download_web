# Video Downloader - Ứng dụng tải video đa nền tảng

Ứng dụng web cho phép tải video từ YouTube, Facebook, Instagram, TikTok, Reddit, Twitter/X và nhiều nền tảng khác với giao diện đẹp mắt và dễ sử dụng.

## 🚀 Tính năng

- ✅ Hỗ trợ nhiều nền tảng: YouTube, Facebook, Instagram, TikTok, Reddit, Twitter/X
- ✅ Chọn chất lượng video: Cao (1080p), Trung bình (720p), Thấp (480p)
- ✅ Nhiều định dạng: MP4, WebM, MKV, MOV, MP3, M4A, WAV
- ✅ Chất lượng audio: 128/192/320 kbps
- ✅ Dark/Light mode
- ✅ Auto-delete files sau 15 phút
- ✅ Giao diện đẹp, hiện đại, responsive
- ✅ Miễn phí 100%

## 🌐 Deploy lên Render (Free Hosting)

### Bước 1: Push lên GitHub

```bash
# Init git (nếu chưa có)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit - Video Downloader"

# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy trên Render

1. Đăng ký/Đăng nhập **[Render.com](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Render tự detect `render.yaml`:
   - Environment: Docker
   - Plan: Free
5. Click **"Create Web Service"**
6. Đợi 5-10 phút build & deploy

### Bước 3: Update Frontend URL

Sau khi deploy xong, bạn sẽ có URL: `https://your-app.onrender.com`

**Update `frontend/script.js`:**
```javascript
const API_URL = 'https://your-app.onrender.com'; // Thay đổi dòng này
```

### Bước 4: Deploy Frontend

**Option 1: Netlify (Recommend)**
- Drag & drop thư mục `frontend/` vào **[Netlify Drop](https://app.netlify.com/drop)**
- Done!

**Option 2: Vercel**
- Import repo GitHub
- Framework: None
- Root Directory: `frontend`

**Option 3: GitHub Pages**
- Settings → Pages → Deploy from branch `main`, folder `/frontend`

### Bước 5: Keep-Alive (Tránh sleep)

Render free tier sleep sau 15 phút không dùng. Dùng **UptimeRobot** (free):

1. Đăng ký **[UptimeRobot.com](https://uptimerobot.com)**
2. New Monitor → HTTP(s)
3. URL: `https://your-app.onrender.com`
4. Interval: 10 minutes
5. Done! Server sẽ luôn awake

## 📋 Yêu cầu (Local Development)

- **Node.js** (v14+)
- **yt-dlp** 
- **FFmpeg**

## 🔧 Cài đặt Local

### 1. Cài đặt Node.js

Tải và cài đặt Node.js từ [nodejs.org](https://nodejs.org/)

### 2. Cài đặt yt-dlp

#### Windows:
```powershell
# Sử dụng scoop (khuyến nghị)
scoop install yt-dlp

# Hoặc sử dụng pip
pip install yt-dlp
```

#### macOS:
```bash
brew install yt-dlp
```

#### Linux:
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### 3. Cài đặt FFmpeg

#### Windows:
```powershell
# Sử dụng scoop
scoop install ffmpeg

# Hoặc tải từ https://ffmpeg.org/download.html
```

#### macOS:
```bash
brew install ffmpeg
```

#### Linux:
```bash
sudo apt update
sudo apt install ffmpeg
```

### 4. Cài đặt dependencies cho Backend

```bash
cd backend
npm install
```

## 🎯 Chạy ứng dụng

### 1. Khởi động Backend Server

```bash
cd backend
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### 2. Mở Frontend

Mở file `frontend/index.html` trực tiếp trong trình duyệt, hoặc sử dụng Live Server:

```bash
cd frontend
# Nếu có Python
python -m http.server 8000

# Hoặc nếu có Node.js với http-server
npx http-server -p 8000
```

Truy cập: `http://localhost:8000`

## 📖 Hướng dẫn sử dụng

1. **Mở ứng dụng** trong trình duyệt
2. **Sao chép link video** từ YouTube, Facebook, Instagram, hoặc TikTok
3. **Dán link** vào ô nhập liệu
4. **Chọn chất lượng** video mong muốn
5. **Nhấn "Tải Video"** và đợi
6. **Tải về máy** khi video đã sẵn sàng

## 🔌 API Endpoints

### GET `/`
Kiểm tra trạng thái server

### POST `/api/download`
Tải video từ URL

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=xxxxx",
  "quality": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Video downloaded successfully",
  "downloadUrl": "http://localhost:3000/downloads/video_xxxxx.mp4",
  "filename": "video_xxxxx.mp4"
}
```

## 📁 Cấu trúc thư mục

```
all-in-one-web/
├── backend/
│   ├── server.js          # Backend server chính
│   ├── package.json       # Dependencies của backend
│   └── downloads/         # Thư mục lưu video (tự động tạo)
├── frontend/
│   ├── index.html        # Giao diện chính
│   ├── style.css         # Styling
│   └── script.js         # Logic frontend
└── README.md             # File này
```

## ⚠️ Lưu ý

- **Bản quyền**: Chỉ sử dụng ứng dụng này cho mục đích cá nhân và tuân thủ các điều khoản của từng nền tảng
- **Hiệu suất**: Tốc độ tải phụ thuộc vào kết nối internet và server nguồn
- **Dung lượng**: Video được lưu tạm trong thư mục `downloads` và tự động xóa sau 1 giờ
- **Giới hạn**: Một số video có bảo vệ bản quyền hoặc riêng tư có thể không tải được

## 🛠️ Xử lý lỗi thường gặp

### Lỗi: "yt-dlp: command not found"
- Đảm bảo đã cài đặt yt-dlp đúng cách
- Thêm yt-dlp vào PATH của hệ thống

### Lỗi: "Failed to download video"
- Kiểm tra link video có hợp lệ không
- Đảm bảo video không bị khóa hoặc riêng tư
- Thử với video khác

### Lỗi: "CORS error"
- Đảm bảo backend đang chạy
- Kiểm tra URL API trong `frontend/script.js`

## 🔄 Phát triển thêm

### Chạy backend ở chế độ development:
```bash
cd backend
npm run dev
```

### Thêm nền tảng mới:
Backend đã sử dụng yt-dlp, tự động hỗ trợ hầu hết các trang video phổ biến.

## 📝 License

MIT License - Sử dụng tự do cho mục đích cá nhân

## 👨‍💻 Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo pull request hoặc báo cáo lỗi.

## 📧 Liên hệ

Nếu có vấn đề, vui lòng tạo issue trên repository.

---

**Chúc bạn sử dụng vui vẻ! 🎉**
