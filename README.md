# Career Explorer Pro
**พัฒนาโดย องค์การค้าของ สกสค. | อัปเดต 2569**

แพลตฟอร์มสำรวจอาชีพสำหรับนักเรียนและนักศึกษาไทย ค้นหา เปรียบเทียบ และทำแบบทดสอบอาชีพที่เหมาะกับตัวเองได้ฟรี ไม่ต้องสมัครสมาชิก

🔗 **Demo:** [chickenggeasy-cmd.github.io/careerexplorer](https://chickenggeasy-cmd.github.io/careerexplorer)

---

## ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | คำอธิบาย |
|---|---|
| 🗂️ สำรวจสายงาน | 14 สายงานหลัก 435+ อาชีพ พร้อมข้อมูลเงินเดือน การศึกษา ทักษะ |
| 🔍 ค้นหาอาชีพ | ค้นหาด้วยชื่อ ทักษะ หรือ tag แบบ real-time |
| ⚖️ เปรียบเทียบอาชีพ | เลือกอาชีพสูงสุด 3 รายการมาเทียบแบบ Side-by-Side |
| 🧠 แบบทดสอบอาชีพ | 20 ข้อ วิเคราะห์บุคลิกและแนะนำ Top 3 อาชีพ |
| 🤖 AI Career Advisor | แชทกับ AI ถามเรื่องอาชีพได้ตลอดเวลา (Gemini API) |
| 👁️ โหมดตาบอดสี | รองรับ Protanopia, Deuteranopia, Tritanopia, Achromatopsia |

---

## 📁 โครงสร้างโปรเจกต์

```
career-explorer/
├── index.html                 — หน้าหลัก SPA (ทุก page อยู่ในไฟล์นี้)
├── README.md
│
├── css/
│   ├── style.css              — ธีมสีหลัก, Layout, UI Components ทั้งหมด
│   ├── compare.css            — สไตล์หน้าเปรียบเทียบอาชีพ 
│   └── floating-dock.css      — สไตล์ dock ปุ่มลอยตัวมุมขวาล่าง
│
├── js/
│   ├── data-loader.js         — รวม DATA ทุกสายงานเข้าด้วยกัน 
│   ├── data/                  — ฐานข้อมูลอาชีพแยกตามสายงาน
│   │   ├── data-medical.js    — สายการแพทย์และสุขภาพ      (23 อาชีพ)
│   │   ├── data-tech.js       — สายวิศวกรรมและไอที         (30 อาชีพ)
│   │   ├── data-business.js   — สายธุรกิจและการเงิน        (27 อาชีพ)
│   │   ├── data-law.js        — สายกฎหมายและความปลอดภัย   (27 อาชีพ)
│   │   ├── data-arts.js       — สายสร้างสรรค์ สื่อ บันเทิง (42 อาชีพ)
│   │   ├── data-education.js  — สายการศึกษาและวิทยาศาสตร์  (36 อาชีพ)
│   │   ├── data-sports.js     — สายกีฬาและนันทนาการ        (54 อาชีพ)
│   │   ├── data-food.js       — สายอาหารและการบริการ       (33 อาชีพ)
│   │   ├── data-aviation.js   — สายการบินและการท่องเที่ยว  (24 อาชีพ)
│   │   ├── data-construction.js — สายก่อสร้างและอสังหา     (33 อาชีพ)
│   │   ├── data-agriculture.js  — สายเกษตรและนวัตกรรมอาหาร (34 อาชีพ)
│   │   ├── data-logistics.js  — สายโลจิสติกส์และคลังสินค้า (27 อาชีพ)
│   │   ├── data-factory.js    — สายโรงงานและยานยนต์        (15 อาชีพ)
│   │   └── data-lifestyle.js  — สายความงามและสัตว์เลี้ยง   (30 อาชีพ)
│   │
│   ├── render.js              — render UI ทุกส่วน (category, job card, detail)
│   ├── router.js              — SPA routing ด้วย History API + hash
│   ├── search.js              — ระบบค้นหา real-time
│   ├── quiz.js                — แบบทดสอบ 20 ข้อ + ระบบคะแนน
│   ├── compare.js             — เปรียบเทียบอาชีพ Side-by-Side
│   ├── compare-deco.js        — เอฟเฟกต์ตกแต่งหน้าเปรียบเทียบ
│   ├── icons.js               — จัดการ SVG icon ทั่วทั้งเว็บ
│   ├── loader.js              — Loading screen
│   ├── colorblind.js          — โหมดช่วยผู้มีภาวะตาบอดสี
│   └── floating-dock.js       — ควบคุม dock ปุ่มลอยตัว
│
└── img/
    └── icons/                 — ไอคอน PNG สายงาน, feature, footer
```

---

## 🖥️ หน้าจอและ Page ID

แอปทำงานเป็น **Single Page Application** สลับหน้าด้วย hash URL

| Page ID | URL Hash | หน้าที่ |
|---|---|---|
| `page-home` | `#page-home` | หน้าหลัก — Hero, สายงาน 14 หมวด, Feature section |
| `page-cat` | `#page-cat` | รายการอาชีพในสายงานที่เลือก |
| `page-detail` | `#page-detail` | รายละเอียดอาชีพ — เงินเดือน, การศึกษา, ทักษะ, ข้อดี-ข้อเสีย |
| `page-search` | `#page-search` | ผลการค้นหา |
| `page-quiz` | `#page-quiz` | แบบทดสอบอาชีพ 20 ข้อ |
| `page-compare` | `#page-compare` | เปรียบเทียบอาชีพ Side-by-Side |
| `page-about-org` | `#page-about-org` | เกี่ยวกับองค์การค้าของ สกสค. |
| `page-about-app` | `#page-about-app` | เกี่ยวกับแอป, ทีมงาน, Roadmap |

---

## 🗄️ โครงสร้างข้อมูลอาชีพ

แต่ละอาชีพใน `data/data-[id].js` มีโครงสร้างดังนี้:

```js
{
  id: "software-engineer",          // unique ID (ใช้ใน URL hash)
  nameT: "นักพัฒนาซอฟต์แวร์",       // ชื่อภาษาไทย
  nameE: "Software Engineer",        // ชื่อภาษาอังกฤษ
  icon: "💻",                        // emoji icon
  img: "https://...",               // รูปประกอบ (Unsplash)
  salary: {
    entry:  "35,000",               // เงินเดือนเริ่มต้น (บาท)
    mid:    "70,000",               // ระดับกลาง
    senior: "120,000+"              // ระดับอาวุโส
  },
  salaryBar: { entry: 30, mid: 60, senior: 100 },  // % สำหรับ bar chart
  education: "วิทยาศาสตรบัณฑิต สาขา...",
  degree: "ปริญญาตรี",
  years: "4 ปี",
  skills: ["JavaScript", "Python", ...],
  description: "คำอธิบายอาชีพ...",
  pros: ["ข้อดี 1", "ข้อดี 2"],
  cons: ["ข้อพิจารณา 1"],
  growth: "สูงมาก เนื่องจาก...",
  tags: ["โปรแกรมเมอร์", "IT", ...],
  universities: ["มหาวิทยาลัย A", "มหาวิทยาลัย B", ...]
}
```

---

## ➕ วิธีเพิ่ม / แก้ไขอาชีพ

### เพิ่มอาชีพใหม่
1. เปิดไฟล์ `js/data/data-[สายงาน].js` ที่ต้องการ เช่น `data-tech.js`
2. เพิ่ม object ใหม่เข้าไปใน array `jobs` ตาม structure ด้านบน
3. บันทึกไฟล์ → refresh browser

### แก้ไขข้อมูลอาชีพ
1. เปิดไฟล์ `js/data/data-[สายงาน].js` ของสายงานนั้น
2. หา `id` ของอาชีพที่ต้องการ แล้วแก้ field ที่ต้องการ
3. บันทึก → refresh

> **หมายเหตุ:** ไม่ต้องแก้ `render.js`, `data-loader.js` หรือไฟล์อื่นใด

---

## 🚀 วิธีรันโปรเจกต์

```bash
# clone repo
git clone https://github.com/chickenggeasy-cmd/careerexplorer.git
cd careerexplorer

# เปิดผ่าน XAMPP (แนะนำ)
# วางโฟลเดอร์ใน C:/xampp/htdocs/project_data/career-explorer/
# แล้วเปิด http://localhost/project_data/career-explorer/

# หรือเปิดตรงผ่าน browser (บางฟีเจอร์เช่น AI อาจไม่ทำงาน)
open index.html
```

> ⚠️ AI Career Advisor ต้องเปิดผ่าน localhost หรือ HTTPS เท่านั้น เพราะ Gemini API บล็อก file:// protocol

---

## 🔧 Stack และ Dependencies

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | Vanilla HTML / CSS / JavaScript (ไม่มี framework) |
| Fonts | Google Fonts — Prompt |
| AI | Google Gemini API (gemini-2.5-flash) |
| รูปภาพ | Unsplash (CDN) |
| Hosting | GitHub Pages |
| Local Dev | XAMPP |

---

## 📦 Deploy ขึ้น GitHub Pages

```bash
git add .
git commit -m "อธิบายการเปลี่ยนแปลง"
git push origin main
```

GitHub Pages จะ deploy อัตโนมัติภายใน 1–3 นาที

---

## 💡 Developer Notes

**ถ้าจะเพิ่มสายงานใหม่**
1. สร้างไฟล์ `js/data/data-[id].js` ตาม structure เดิม
2. เพิ่ม `<script src="js/data/data-[id].js">` ใน `index.html` ก่อน `data-loader.js`
3. เพิ่ม `DATA_[ID]` เข้าไปใน array ของ `data-loader.js`

**ถ้า AI ตอบไม่ได้ / ช้า**
แก้ได้ที่ script `ai-advisor` ใน `index.html` ส่วน `const MODELS = [...]` เปลี่ยน model หรือเพิ่ม fallback model

**ถ้าจะอัปเกรดเป็น Backend จริงๆ**
แนะนำ Firebase Firestore หรือ Supabase แทน static JS files เพื่อให้อัปเดตข้อมูลโดยไม่ต้อง deploy ใหม่

---

## 👨‍💻 ทีมพัฒนา

| บทบาท | ชื่อ | สังกัด |
|---|---|---|
| Lead Developer | นาย ชโยดม บัวขาว | คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยกรุงเทพสุวรรณภูมิ (BSU) |
| Project Support | องค์การค้าของ สกสค. | ศึกษาภัณฑ์พาณิชย์ |

---

© 2026 SUKSAPANPANIT — Career Explorer Pro | สงวนลิขสิทธิ์