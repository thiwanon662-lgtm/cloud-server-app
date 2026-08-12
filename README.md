# 🚀 24/7 Cloud Node.js Server & API Hub

โครงการเว็บแอปพลิเคชันและ REST API เซิฟเวอร์ที่ทำงานบน Cloud ฟรีตลอด 24 ชั่วโมง โดยที่คุณ**ไม่ต้องเปิดคอมพิวเตอร์ทิ้งไว้**

---

## 🌟 คุณสมบัติเด่น (Features)

1. **24/7 Always Online**: รันอยู่บนระบบ Cloud High-Availability เซิฟเวอร์จะทำงานต่อเนื่องแม้วิทยุ/คอมพิวเตอร์ของคุณจะปิดอยู่
2. **Modern Control Hub UI**: หน้าจอควบคุม Dashboard แบบ Glassmorphic Dark Mode สำหรับดู Uptime, Memory, CPU, และทดสอบ API
3. **REST API Ready**: มาพร้อม REST API และ Health Check Endpoint (`/api/health`, `/api/status`, `/api/items`)
4. **Deploy ได้ง่ายและฟรี 100%**: รองรับทั้ง Render.com, Vercel และ Google Cloud Run

---

## 🛠️ วิธีการรันในเครื่องเพื่อทดสอบ (Local Development)

1. เปิด Terminal ในโฟลเดอร์นี้
2. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
3. เริ่มรันเซิฟเวอร์:
   ```bash
   npm start
   ```
4. เปิดเบราว์เซอร์ไปที่: `http://localhost:3000`

---

## ☁️ ขั้นตอนการเอาเซิฟเวอร์ขึ้น Cloud ให้ออนไลน์ 24 ชั่วโมง (Deployment Guide)

### ขั้นตอนที่ 1: นำโค้ดขึ้น GitHub (ทำครั้งแรกครั้งเดียว)

1. สมัครหรือล็อกอินที่ [GitHub.com](https://github.com)
2. สร้าง Repository ใหม่ชื่อ `cloud-server-app`
3. รันคำสั่งต่อไปนี้ใน Terminal ของคอมพิวเตอร์คุณ:
   ```bash
   git init
   git add .
   git commit -m "Initial 24/7 cloud server code"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cloud-server-app.git
   git push -u origin main
   ```

---

### ขั้นตอนที่ 2: เลือกผู้ให้บริการ Cloud (แนะนำ Render.com หรือ Vercel)

#### 🟢 ตัวเลือก A: Render.com (แนะนำที่สุด - ฟรีตลอด 24/7)
1. สมัครสมาชิกฟรีที่ [Render.com](https://render.com)
2. คลิกปุ่ม **New +** -> เลือก **Web Service**
3. เชื่อมต่อบัญชี GitHub แล้วเลือก Repository `cloud-server-app`
4. ตั้งค่าดังนี้:
   - **Name**: `my-cloud-server` (หรือชื่อตามต้องการ)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. กดปุ่ม **Create Web Service**
6. รอระบบ Build ประมาณ 1-2 นาที คุณจะได้ URL เว็บไซต์ เช่น `https://my-cloud-server.onrender.com` ที่เปิดใช้งานได้ตลอด 24 ชั่วโมง!

#### 🟡 ตัวเลือก B: Vercel (รวดเร็ว ปรับแต่งง่าย)
1. สมัครสมาชิกฟรีที่ [Vercel.com](https://vercel.com)
2. กด **Add New...** -> **Project**
3. Import Repository `cloud-server-app` จาก GitHub
4. กด **Deploy** ได้ทันทีโดยไม่ต้องแก้ไขค่าใดๆ
5. คุณจะได้ URL เช่น `https://cloud-server-app.vercel.app`

#### 🔵 ตัวเลือก C: Google Cloud Run (ระดับองค์กร)
1. ติดตั้ง `gcloud` CLI และสั่ง Build Container:
   ```bash
   gcloud run deploy cloud-server-app --source . --region asia-southeast1 --allow-unauthenticated
   ```

---

## 📌 หมายเหตุเพิ่มเติมสำหรับการเปิดบริการ 24 ชั่วโมง

* บน **Render.com (Free Tier)** หากไม่มี Traffic เข้ามานานเกิน 15 นาที เซิฟเวอร์จะเข้าสู่โหมด Sleep และจะตื่นขึ้นอัตโนมัติเมื่อมีการร้องขอ (Request) เข้ามา
* หากต้องการให้เซิฟเวอร์ตื่นตลอด 100% โดยไม่ตื่นช้า สามารถใช้บริการฟรีอย่าง **UptimeRobot.com** ปิง URL `/api/health` ทุกๆ 5-10 นาทีได้!
