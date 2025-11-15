# 🚀 Quick Deploy Guide

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Video Downloader App"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render

1. Go to **[Render.com](https://render.com)** → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Click **"Create Web Service"**
6. Wait 5-10 minutes for build

You'll get URL: `https://your-app.onrender.com`

## Step 3: Deploy Frontend

### Option A: Netlify (Easiest)
1. Go to **[Netlify Drop](https://app.netlify.com/drop)**
2. Drag & drop `frontend/` folder
3. Update `frontend/script.js` line 1:
   ```javascript
   const API_URL = 'https://your-app.onrender.com';
   ```
4. Re-upload to Netlify

### Option B: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. `cd frontend && vercel`
3. Follow prompts

## Step 4: Keep Backend Awake

Use **[UptimeRobot](https://uptimerobot.com)** (free):
1. Sign up
2. New Monitor → HTTP(s)
3. URL: `https://your-app.onrender.com`
4. Interval: 10 minutes
5. Save

Done! Your app is live 24/7! 🎉

## ⚠️ Important Notes

- **Render Free Tier**: 100s timeout, 512MB RAM
- **Recommendation**: Use 720p quality to avoid timeout
- **Storage**: Files auto-delete after 15 minutes (as designed)
- **First request**: May take 30s to wake up from sleep

## 🐛 Troubleshooting

**App sleeping?**
- Setup UptimeRobot to ping every 10 min

**Timeout errors?**
- Use lower quality (720p/480p)
- Long videos may timeout on free tier

**CORS errors?**
- Check API_URL in `frontend/script.js`
- Make sure backend is deployed

**Build failed on Render?**
- Check Render logs
- Make sure Dockerfile is correct
