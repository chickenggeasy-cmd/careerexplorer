# Career Explorer Pro

**พัฒนาโดย องค์การค้าของ สกสค. (SUKSAPANPANIT)** · เว็บระบุเวอร์ชันในหน้า "เกี่ยวกับแอป" ว่า **v2.0**

เว็บสำรวจอาชีพสำหรับนักเรียน/นักศึกษาไทย — ค้นหา เปรียบเทียบ ทำแบบทดสอบอาชีพ คุยกับ AI แนะแนว และดูเงินเดือนเทียบกับตลาดต่างประเทศ ฟรีทั้งหมด ไม่ต้องสมัครสมาชิก

เขียนด้วย **HTML/CSS/JavaScript ล้วน** (ไม่มี framework) รันเป็น Single Page Application — ทุกหน้าอยู่ใน `index.html` ไฟล์เดียว แล้วสลับหน้าด้วย JavaScript

> 📌 **หมายเหตุ:** README ฉบับนี้เขียนขึ้นใหม่ทั้งหมดโดยอ่านโค้ดจริงในโปรเจกต์ ไม่ได้อิงจาก README เดิม เพราะของเดิมมีข้อมูลที่ตกยุคไปแล้ว (โดยเฉพาะเรื่องแหล่งข้อมูลอาชีพ ที่ตอนนี้เปลี่ยนไปใช้ Supabase เป็นหลักแล้ว ไม่ใช่ไฟล์ JS เหมือนก่อน)

🔗 **Live (สันนิษฐานจาก git remote):** `https://chickenggeasy-cmd.github.io/careerexplorer` — ยังไม่ได้เปิดตรวจว่า deploy ล่าสุดตรงกับโค้ดชุดนี้หรือไม่ ลองเช็คอีกทีฝั่งคุณ

---

## ✨ ฟีเจอร์หลัก

| ฟีเจอร์ | คำอธิบาย |
| --- | --- |
| 🗂️ สำรวจสายงาน | 14 สายงานหลัก รวม **435 อาชีพ** พร้อมเงินเดือน การศึกษา ทักษะ ข้อดี-ข้อเสีย |
| 🌍 **Global Career Map** *(ของใหม่ ไม่มีใน README เดิม)* | หน้า "สำรวจสายงาน" มี 2 โหมด: แผนที่โลกแบบ SVG ให้เลือก 1 ใน 6 ทวีป × 3 ประเทศเด่นต่อทวีป แล้วแปลงฐานเงินเดือน (บาท) เป็นค่าประมาณของประเทศนั้น ด้วย "ตัวคูณตลาดแรงงาน" |
| 🔍 ค้นหาอาชีพ | ค้นหาแบบ real-time จากชื่อ ทักษะ หรือ tag |
| ⚖️ เปรียบเทียบอาชีพ | เลือกได้สูงสุด 3 อาชีพ เทียบข้อมูลแบบ side-by-side |
| 🧠 แบบทดสอบอาชีพ | 20 ข้อ ให้คะแนนแต่ละสายงาน แล้วสรุป Top 3 อาชีพที่เหมาะกับผู้ใช้ |
| 🤖 AI Career Advisor | แชทถาม-ตอบเรื่องอาชีพ เรียก Gemini API **ตรงจากฝั่ง browser** (ดูข้อควรระวังด้านล่าง) |
| 👁️ โหมดตาบอดสี | Protanopia / Deuteranopia / Tritanopia / Achromatopsia |
| ♿ Accessibility | รองรับคีย์บอร์ด, screen reader, contrast ตามแนว WCAG AA |
| 📌 Floating Dock | ปุ่มลอยมุมขวาล่าง รวมปุ่ม AI + ปุ่มตาบอดสี เข้าถึงได้ทุกหน้า |

---

## 📁 โครงสร้างโปรเจกต์

```text
career-explorer/
├── index.html                 — ทั้งเว็บเป็น SPA ไฟล์เดียว (~1,870 บรรทัด) มี 9 หน้า + widget AI Advisor ฝัง inline อยู่ท้ายไฟล์
├── README.md
│
├── css/
│   ├── global.css             — CSS variables (ธีมชมพู-กุหลาบ), layout, navbar, footer, ปุ่มพื้นฐาน
│   ├── home.css                — หน้าแรก (Hero, ticker โลโก้, สถิตินับเลข)
│   ├── category.css            — การ์ดอาชีพ/หมวดหมู่ + หน้า Global Career Map
│   ├── detail.css              — หน้ารายละเอียดอาชีพ (กราฟเงินเดือน, ไทม์ไลน์)
│   ├── about.css                — หน้าเกี่ยวกับองค์กร / เกี่ยวกับแอป
│   ├── compare.css              — หน้าเปรียบเทียบอาชีพ
│   └── floating-dock.css        — dock ปุ่มลอยมุมขวาล่าง
│
├── js/
│   ├── data-loader.js          — ⭐ ตัวโหลดข้อมูล "dual-mode": ลอง Supabase ก่อน ถ้าล่ม/ต่อไม่ได้ค่อย fallback ไปไฟล์ js/data/*.js
│   ├── world-map-data.js       — เส้นขอบทวีปจริงแบบ SVG path (Natural Earth 110m, auto-generated — คอมเมนต์บอกว่าห้ามแก้มือ)
│   ├── render.js               — ศูนย์กลาง render ทุกหน้า + เก็บข้อมูลทวีป/ประเทศ/ตัวคูณเงินเดือนของ Global Career Map (ตัวแปร `GLOBAL_EXPLORER`)
│   ├── router.js               — SPA routing ด้วย History API + hash
│   ├── search.js                — ค้นหาแบบ real-time
│   ├── quiz.js                  — แบบทดสอบ 20 ข้อ + คำนวณคะแนน (inject CSS ของหน้าตัวเองผ่าน JS)
│   ├── compare.js               — ระบบเปรียบเทียบอาชีพ (จำกัด 3 ช่อง ปรับได้ที่ค่า `MAX_SLOTS`)
│   ├── compare-deco.js          — ไอคอนลอยตกแต่ง header หน้าเปรียบเทียบ
│   ├── icons.js                  — ชุด SVG icon กลางของเว็บ เรียกใช้ผ่านฟังก์ชัน `icon()`
│   ├── loader.js                 — หน้าจอ loading ตอนเปิดเว็บ (inject HTML/CSS เองทั้งหมด)
│   ├── colorblind.js             — โหมดช่วยตาบอดสี 4 แบบ (เก็บค่าไว้ที่ `localStorage` key `ce_colorblind_mode`)
│   ├── floating-dock.js          — รวม widget ตาบอดสี + AI เข้า dock เดียวกัน
│   └── data/                     — ฐานข้อมูลอาชีพสำรอง (fallback) แยกไฟล์ตามสายงาน — 14 ไฟล์ / 435 อาชีพ
│       ├── data-medical.js       (23 อาชีพ)     ├── data-tech.js          (30 อาชีพ)
│       ├── data-business.js      (27 อาชีพ)     ├── data-law.js           (27 อาชีพ)
│       ├── data-arts.js          (42 อาชีพ)     ├── data-education.js    (36 อาชีพ)
│       ├── data-sports.js        (54 อาชีพ)     ├── data-food.js          (33 อาชีพ)
│       ├── data-aviation.js      (24 อาชีพ)     ├── data-construction.js (33 อาชีพ)
│       ├── data-agriculture.js   (34 อาชีพ)     ├── data-logistics.js    (27 อาชีพ)
│       └── data-factory.js       (15 อาชีพ)     └── data-lifestyle.js    (30 อาชีพ) เเละอื่นๆ... ทั้งหมด 14 สาย
│
└── img/
    ├── icons/   — ไอคอนสายงาน (PNG) + ไอคอนทั่วไป (การศึกษา, เงิน ฯลฯ) + โลโก้ + avatar ของ AI + favicon (26 ไฟล์)
    └── photo/   — รูปที่อัปโหลดเพิ่มเอง นอกเหนือจากรูปจาก Unsplash (3 ไฟล์)
```

> 💡 **ควรเริ่มอ่านไฟล์ไหนก่อน?** `data-loader.js` (เข้าใจว่าข้อมูลมาจากไหน) → `render.js` (เข้าใจว่าทุกหน้า render ยังไง รวมโค้ด Global Career Map) → `router.js` และ `quiz.js` (logic การนำทางกับการให้คะแนนแบบทดสอบ)

---

## 🖥️ หน้าจอและ Page ID

แอปเป็น SPA สลับหน้าด้วย hash URL ผ่าน `showPage()` ใน `router.js`

| Page ID | URL Hash | หน้าที่ |
| --- | --- | --- |
| `page-home` | `#page-home` | หน้าหลัก — Hero, ticker, feature section |
| `page-explore` | `#page-explore` | **สำรวจสายงาน** — สลับได้ 2 มุมมอง: แผนที่โลก (Global Career Map) กับกริดสายงานทั้งหมด |
| `page-cat` | `#page-cat` | รายชื่ออาชีพในสายงานที่เลือก |
| `page-detail` | `#page-detail` | รายละเอียดอาชีพ — เงินเดือน, การศึกษา, ทักษะ, ข้อดี-ข้อเสีย |
| `page-search` | `#page-search` | ผลการค้นหา |
| `page-quiz` | `#page-quiz` | แบบทดสอบอาชีพ 20 ข้อ |
| `page-compare` | `#page-compare` | เปรียบเทียบอาชีพแบบ side-by-side |
| `page-about-org` | `#page-about-org` | เกี่ยวกับองค์การค้าของ สกสค. |
| `page-about-app` | `#page-about-app` | เกี่ยวกับแอป, roadmap, ทีมงาน |

---

## 🗄️ สถาปัตยกรรมข้อมูล (สำคัญมาก — เปลี่ยนไปจากเดิม)

**Supabase เป็นแหล่งข้อมูลหลักแล้ว** ไม่ใช่ไฟล์ `js/data/*.js` เหมือนก่อน ไฟล์เหล่านั้นตอนนี้เป็นแค่ **fallback สำรอง** เท่านั้น ลำดับการทำงานใน `js/data-loader.js`:

1. เรียก `loadFromSupabase()` → ยิง REST API ไปที่ Supabase (`SUPABASE_URL` + `SUPABASE_KEY` ฝังอยู่ในไฟล์นี้ตรง ๆ) ดึงตาราง `categories` และ `jobs` มาประกอบเป็น `window.DATA`
2. ถ้า fetch ล้มเหลว (offline, key หมดอายุ, ตารางเปลี่ยนโครงสร้าง ฯลฯ) → catch แล้วเรียก `loadFromFiles()` แทน ซึ่งจะ `<script>` โหลดไฟล์ `js/data/data-*.js` ทั้ง 14 ไฟล์แบบ dynamic แล้วประกอบเป็น `window.DATA` เหมือนกัน

โครงสร้างข้อมูลที่ทั้งสองโหมดแปลงมาให้ตรงกัน:

```js
// ระดับสายงาน (category)
{
  id, nameT, nameE,
  icon,       // path รูปไอคอนสายงาน
  color, iconColor,
  jobs: [ ... ]
}

// ระดับอาชีพ (job)
{
  id, nameT, nameE, icon, img,
  salary:    { entry, mid, senior },       // string เช่น "51,000"
  salaryBar: { entry, mid, senior },       // number 0-100 สำหรับวาดกราฟแท่ง
  education, degree, years,
  skills: [...], tags: [...],
  description, pros: [...], cons: [...],
  growth, universities: [...]
}
```

ตาราง Supabase (`categories`, `jobs`) ใช้ชื่อคอลัมน์แบบ snake_case (เช่น `name_th`, `salary_entry`, `salary_bar_mid`, `category_id`) แล้วฟังก์ชัน `rowToJob()` / `rowToCategory()` ใน `data-loader.js` จะแปลงให้เป็นรูปแบบด้านบนก่อนส่งต่อให้ `render.js`

**ผลกับงานประจำวัน:**
- ถ้าจะ **แก้ข้อมูลที่ผู้ใช้จริงเห็นบนเว็บ** → ต้องไปแก้ที่ **ฐานข้อมูล Supabase** (ตาราง `categories` / `jobs`) ไม่ใช่แก้ไฟล์ `js/data/*.js`
- ไฟล์ `js/data/*.js` จะมีผลก็ต่อเมื่อ Supabase เข้าไม่ได้เท่านั้น — ควรอัปเดตให้ตรงกับ Supabase อยู่เรื่อย ๆ ไว้เป็น backup ไม่งั้นตอน fallback ข้อมูลจะไม่ตรงกับของจริง

---

## 🌍 Global Career Map ทำงานยังไง

- แผนที่วาดจาก `js/world-map-data.js` (พิกัด SVG จริงของแต่ละทวีป) วาดลงบน SVG ใน `page-explore`
- ข้อมูลทวีป/ประเทศ/ตัวคูณอยู่ในตัวแปร `GLOBAL_EXPLORER` ที่ต้น `render.js`: มี 6 ทวีป ทวีปละ 3 ประเทศเด่น แต่ละประเทศมีค่า `market` เป็นตัวคูณ (เช่น สหรัฐฯ = 3.60, ไทย = 1.00 เป็นฐาน)
- อัตราแปลง USD/THB ก็เป็นค่าคงที่ (`usdThbRate: 35`) ฝังไว้ในโค้ด **ไม่ได้ดึงค่าเงินจริงแบบ live** — ถ้าจะให้แม่นขึ้นต้องต่อ API อัตราแลกเปลี่ยนเพิ่มเอง

---

## 🤖 AI Career Advisor ทำงานยังไง

widget ทั้งหมด (HTML/CSS/JS) ถูกฝังเป็น inline `<script>` ท้าย `index.html` ไม่ได้แยกเป็นไฟล์ต่างหาก:

- เรียก Gemini ตรงจาก browser ผ่าน `fetch()` ไปที่ Google Generative Language API โดยตรง ไม่มี backend คั่นกลาง
- ตั้ง `MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash']` ถ้าโมเดลแรก error/โดน rate limit จะ auto fallback ไปโมเดลถัดไป
- สร้าง system prompt แบบ dynamic โดยดึงสรุปอาชีพ 3 อันดับแรกของทุกสายงานจาก `DATA` ใส่เข้าไปด้วย และมีฟังก์ชันที่คอยเช็คว่าข้อความผู้ใช้พูดถึงชื่ออาชีพไหนในระบบ แล้วแอบแนบข้อมูลเงินเดือนละเอียดของอาชีพนั้นเพิ่มให้ AI ตอบได้ตรงขึ้น
- ต้องเปิดผ่าน `http://localhost` หรือ `https://` เท่านั้น ถ้าเปิดไฟล์ตรง ๆ (`file://`) Gemini API จะ block

### ⚠️ เรื่องความปลอดภัยที่ควรรู้
ทั้ง **Gemini API key** และ **Supabase key** ถูกฝัง (hardcode) ไว้ในโค้ดฝั่ง client ตรง ๆ — ใครก็เปิด view-source หรือ dev tools ดูได้ ตัว Supabase key เป็น "publishable" key จึงออกแบบมาให้เปิดเผยได้อยู่แล้ว (ต้องคุมสิทธิ์ด้วย Row Level Security ฝั่ง Supabase แทน) แต่ **Gemini API key ไม่ใช่ key ประเภทนั้น** — ใครคัดลอกไปใช้ก็ยิง request โควตาของคุณได้ทันที (ในโค้ดพยายามซ่อนด้วยการตัดสตริงเป็น 2 ท่อน แต่ต่อกันตอน runtime ก็ยังอ่านได้จาก dev tools อยู่ดี ไม่ใช่การป้องกันจริง) แนะนำให้ย้ายการเรียก Gemini ไปอยู่หลัง backend/serverless function เล็ก ๆ แล้วเก็บ key ไว้ฝั่งเซิร์ฟเวอร์แทน

---

## ➕ วิธีเพิ่ม / แก้ไขอาชีพ

**ถ้าเว็บใช้งานจริงต่อ internet ได้ปกติ (Supabase ทำงาน):**
1. แก้ข้อมูลที่ตาราง `jobs` / `categories` ในหน้า Supabase dashboard โดยตรง — refresh หน้าเว็บก็เห็นผลทันที ไม่ต้องแตะโค้ด

**ถ้าต้องการอัปเดตไฟล์ fallback ให้ตรงกับของจริงด้วย (แนะนำให้ทำคู่กันเสมอ):**
1. เปิดไฟล์ `js/data/data-[สายงาน].js` ที่ต้องการ
2. เพิ่ม/แก้ object ใน array `jobs` ตาม structure ด้านบน
3. บันทึก → refresh (ตอนนี้จะยังไม่เห็นผลถ้า Supabase ยังต่อได้ปกติ เพราะ Supabase มาก่อนเสมอ — ต้องปิดเน็ตหรือจำลอง Supabase error เพื่อเทสต์ fallback)

> **หมายเหตุ:** ไม่ต้องแก้ `render.js` หรือ `data-loader.js` เพิ่ม เว้นแต่จะเพิ่มสายงานใหม่ทั้งหมวด (ดู Developer Notes ด้านล่าง)

---

## 🚀 วิธีรันโปรเจกต์

```bash
git clone https://github.com/chickenggeasy-cmd/careerexplorer.git
cd careerexplorer
```

เปิดผ่าน local server เท่านั้น (ห้ามดับเบิลคลิกเปิด `index.html` ตรง ๆ เพราะ AI Advisor และการ fetch Supabase จะโดน browser บล็อกจาก `file://`):

```bash
# ตัวเลือกที่ 1 — Python (มีติดเครื่องอยู่แล้วส่วนใหญ่)
python -m http.server 8000
# แล้วเปิด http://localhost:8000

# ตัวเลือกที่ 2 — XAMPP
# วางโฟลเดอร์ใน C:/xampp/htdocs/career-explorer/
# แล้วเปิด http://localhost/career-explorer/

# ตัวเลือกที่ 3 — VS Code extension "Live Server"
```

---

## 🔧 Stack และ Dependencies

| ส่วน | เทคโนโลยี |
| --- | --- |
| Frontend | Vanilla HTML / CSS / JavaScript (ไม่มี framework, ไม่มี build step) |
| ฐานข้อมูลหลัก | Supabase (PostgreSQL) ผ่าน REST API — ดึงตรงจาก client |
| Fallback ข้อมูล | ไฟล์ JS ในเครื่อง (`js/data/*.js`) |
| Fonts | Google Fonts — Prompt |
| AI | Google Gemini API (`gemini-2.5-flash` หลัก, `gemini-2.0-flash` สำรอง) เรียกตรงจาก client |
| Icons | ชุด SVG inline (`icons.js`) + ไอคอน PNG (`img/icons/`) |
| รูปภาพ | Unsplash (CDN) + รูปอัปโหลดเองใน `img/photo/` |
| Hosting | GitHub Pages (อิงจาก git remote) |

---

## 📦 Deploy ขึ้น GitHub Pages

```bash
git add .
git commit -m "อธิบายการเปลี่ยนแปลง"
git push origin main
```

GitHub Pages deploy อัตโนมัติภายในไม่กี่นาทีหลัง push (ถ้าตั้งค่า Pages ให้ build จาก branch `main` ไว้แล้ว)


---

## 💡 Developer Notes

**ถ้าจะเพิ่มสายงานใหม่ทั้งหมวด**
1. เพิ่มแถวใหม่ในตาราง `categories` ของ Supabase (วิธีหลัก)
2. สร้างไฟล์ `js/data/data-[id].js` คู่กันไว้เป็น fallback ตาม structure เดิม
3. เพิ่ม `id` ของสายงานใหม่เข้าไปใน `DATA_FILES` object ที่ต้นไฟล์ `js/data-loader.js` และในลิสต์ categories ของฟังก์ชัน `loadFromFiles()`
4. ตรวจว่ามีไฟล์ไอคอนที่ path ตรงกับที่อ้างอิงจริงใน `img/icons/` (ดูหัวข้อปัญหา icon path ด้านบนก่อน อย่าทำผิดซ้ำ)

**การรักษามาตรฐาน Accessibility**
เว็บรองรับ screen reader และ keyboard navigation แล้ว ถ้าจะสร้างปุ่มหรือ component ใหม่:
1. ใช้แท็ก `<button>` แทน `<div>` สำหรับปุ่มกด
2. ถ้าจำเป็นต้องใช้ `<div>` ให้เติม `role="button"`, `tabindex="0"`, และ `onkeydown` เสมอ
3. ใส่ `aria-label` ให้ไอคอน/ปุ่มที่ไม่มีข้อความกำกับ
4. รักษาลำดับ `<h1>`–`<h6>` ให้ถูกต้อง

**ถ้า AI ตอบไม่ได้ / ช้า**
แก้ที่ inline script ส่วน AI Advisor ท้าย `index.html` — ตัวแปร `MODELS = [...]` เปลี่ยน model หรือเพิ่ม fallback model ได้ที่นี่

**สถาปัตยกรรม CSS**
แยกไฟล์ตามหน้าที่การทำงาน แก้ดีไซน์หน้าไหนให้แก้ที่ไฟล์ CSS ของหน้านั้น (`detail.css`, `home.css` ฯลฯ) โดย `global.css` คุมสไตล์พื้นฐานร่วมของทั้งเว็บ (สี, ปุ่ม, navbar, footer) — ยกเว้นส่วนที่ CSS ถูก inject ผ่าน JS ตามตารางปัญหาด้านบน

---

## 👨‍💻 ทีมพัฒนา

| บทบาท | ชื่อ | สังกัด |
| --- | --- | --- |
| Lead Developer | นาย ชโยดม บัวขาว | คณะเทคโนโลยีสารสนเทศ มหาวิทยาลัยกรุงเทพสุวรรณภูมิ (BSU) |
| Project Support | องค์การค้าของ สกสค. | ศึกษาภัณฑ์พาณิชย์ |

---

© 2026 SUKSAPANPANIT — Career Explorer Pro