# Career Explorer Pro
เว็บสำรวจอาชีพสำหรับนักเรียนไทย พัฒนาโดย องค์การค้าของ สกสค.

---

## โครงสร้างโปรเจกต์

```
career-explorer/
├── index.html              — หน้าหลัก + layout ทุกหน้า (SPA)
├── css/
│   ├── style.css           — ธีมสีหลัก, layout, component ทั้งหมด
│   
├── js/
│   ├── data.js             — ข้อมูลอาชีพทั้งหมด (14 สายงาน, 400+ อาชีพ)
│   ├── render.js           — แสดงผล UI ทุกหน้า
│   ├── router.js           — จัดการการเปลี่ยนหน้า (SPA routing)
│   ├── search.js           — ระบบค้นหาอาชีพ
│   └── quiz.js             — แบบทดสอบค้นหาอาชีพที่ใช่
└── img/
    └── icons/              — ไอคอนสินค้า (หน้า About)
```

---

## หน้าทั้งหมด (Pages)

| Page ID | เส้นทาง | คำอธิบาย |
|---|---|---|
| `page-home` | `#page-home` | หน้าหลัก — Hero, Grid หมวดหมู่, Feature section |
| `page-cat` | `#page-cat` | รายการอาชีพในสายงานที่เลือก |
| `page-detail` | `#page-detail` | รายละเอียดอาชีพแต่ละอาชีพ |
| `page-search` | `#page-search` | ผลการค้นหา |
| `page-quiz` | `#page-quiz` | แบบทดสอบสายงาน |
| `page-about` | `#page-about` | เกี่ยวกับองค์กรและทีมผู้พัฒนา |

---

## ฟังก์ชันหลักใน render.js

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `renderCategories()` | Render grid การ์ดหมวดหมู่ทั้ง 14 สายงานที่ `page-home` |
| `createJobCard(job, cat)` | สร้าง HTML การ์ดอาชีพ 1 ใบ (ใช้ใน `page-cat`) |
| `showCategory(catId)` | แสดง `page-cat` พร้อม hero banner และ job grid ของสายงานนั้น |
| `showJob(jobId, catId)` | แสดง `page-detail` พร้อมข้อมูลครบ — salary, skills, pros/cons, growth |

---

## โครงสร้างข้อมูลใน data.js

```js
const DATA = {
  categories: [
    {
      id: "medical",        // รหัสหมวด
      nameT: "สายการแพทย์", // ชื่อไทย
      nameE: "Medical",     // ชื่ออังกฤษ
      icon: "...",          // URL ไอคอน
      color: "...",         // สีพื้นหลังไอคอนการ์ด
      iconColor: "...",     // สีตัวไอคอน
      jobs: [
        {
          id: "ophthalmologist",
          nameT: "จักษุแพทย์ (หมอตา)",
          nameE: "Ophthalmologist",
          icon: "👁",
          img: "...",           // URL รูปประกอบ
          salary: {
            entry: "100,000",
            mid: "350,000",
            senior: "1,000,000+"
          },
          salaryBar: {          // เปอร์เซ็นต์สำหรับ bar chart (0-100)
            entry: 30,
            mid: 60,
            senior: 100
          },
          education: "...",     // รายละเอียดการศึกษา
          degree: "...",        // วุฒิที่ต้องการ
          years: "...",         // ระยะเวลาเรียน
          skills: [...],        // ทักษะที่จำเป็น
          description: "...",   // คำอธิบายอาชีพ
          pros: [...],          // ข้อดี
          cons: [...],          // ข้อจำกัด
          growth: "...",        // แนวโน้มการเติบโต
          tags: [...]           // แท็กสำหรับค้นหา
        }
      ]
    }
  ]
}
```

---

## สายงานทั้งหมด (14 หมวด)

| ID | ชื่อไทย |
|---|---|
| `medical` | สายการแพทย์และสุขภาพ |
| `tech` | สายเทคโนโลยีและไอที |
| `business` | สายธุรกิจและการเงิน |
| `law` | สายกฎหมายและนิติศาสตร์ |
| `arts` | สายศิลปะและสร้างสรรค์ |
| `education` | สายการศึกษา |
| `sports` | สายกีฬาและนันทนาการ |
| `food` | สายอาหารและการโรงแรม |
| `aviation` | สายการบินและการท่องเที่ยว |
| `construction` | สายก่อสร้างและสถาปัตยกรรม |
| `agriculture` | สายเกษตรกรรมและสิ่งแวดล้อม |
| `logistics` | สายโลจิสติกส์และซัพพลายเชน |
| `factory` | สายโรงงานและอุตสาหกรรม |
| `lifestyle` | สายไลฟ์สไตล์และความงาม |

---

## ผู้พัฒนา
- **นาย ชโยดม บัวขาว** — นักศึกษาฝึกงาน / นักพัฒนาหลัก  
  มหาวิทยาลัยกรุงเทพสุวรรณภูมิ (BSU) คณะเทคโนโลยีสารสนเทศ
- **องค์การค้าของ สกสค.** — หน่วยงานสนับสนุนและที่ปรึกษา

---

© 2026 SUKSAPANPANIT — Career Explorer Pro