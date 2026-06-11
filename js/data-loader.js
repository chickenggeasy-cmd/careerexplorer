/**
 * ════════════════════════════════════════════
 *  data-loader.js — Career Explorer Pro
 *  รวมข้อมูลทุกสายงานเข้าด้วยกัน
 *
 *  วิธีใช้: แทนที่ <script src="js/data.js"> ใน index.html
 *  ด้วย script tags ด้านล่างตามลำดับ
 * ════════════════════════════════════════════
 *
 *  ไฟล์สายงาน (โหลดก่อน data-loader.js):
 *    js/data/data-medical.js              — สายการแพทย์และสุขภาพ (23 อาชีพ, 64 KB)
 *    js/data/data-tech.js                 — สายวิศวกรรมและไอที (30 อาชีพ, 77 KB)
 *    js/data/data-business.js             — สายธุรกิจและการเงิน (27 อาชีพ, 72 KB)
 *    js/data/data-law.js                  — สายกฎหมายและความปลอดภัย (27 อาชีพ, 66 KB)
 *    js/data/data-arts.js                 — สายสร้างสรรค์ สื่อ และบันเทิง (42 อาชีพ, 118 KB)
 *    js/data/data-education.js            — สายการศึกษาและวิทยาศาสตร์ (36 อาชีพ, 103 KB)
 *    js/data/data-sports.js               — สายกีฬาและนันทนาการ (54 อาชีพ, 109 KB)
 *    js/data/data-food.js                 — สายอาหารและการบริการ (33 อาชีพ, 90 KB)
 *    js/data/data-aviation.js             — สายการบินและการท่องเที่ยว (24 อาชีพ, 64 KB)
 *    js/data/data-construction.js         — สายก่อสร้างและอสังหา (33 อาชีพ, 95 KB)
 *    js/data/data-agriculture.js          — สายเกษตรและนวัตกรรมอาหาร (34 อาชีพ, 98 KB)
 *    js/data/data-logistics.js            — สายโลจิสติกส์และคลังสินค้า (27 อาชีพ, 79 KB)
 *    js/data/data-factory.js              — สายโรงงานเเละยานยนต์ (15 อาชีพ, 43 KB)
 *    js/data/data-lifestyle.js            — สายความงามและสัตว์เลี้ยง (30 อาชีพ, 87 KB)
 *
 *  ════════════════════════════════════════════
 *  วิธีเพิ่มอาชีพ: แก้ไฟล์ data-[id].js ตรงๆ ได้เลย
 *  ════════════════════════════════════════════
 */

const DATA = {
  categories: [
    DATA_MEDICAL,   // สายการแพทย์และสุขภาพ
    DATA_TECH,   // สายวิศวกรรมและไอที
    DATA_BUSINESS,   // สายธุรกิจและการเงิน
    DATA_LAW,   // สายกฎหมายและความปลอดภัย
    DATA_ARTS,   // สายสร้างสรรค์ สื่อ และบันเทิง
    DATA_EDUCATION,   // สายการศึกษาและวิทยาศาสตร์
    DATA_SPORTS,   // สายกีฬาและนันทนาการ
    DATA_FOOD,   // สายอาหารและการบริการ
    DATA_AVIATION,   // สายการบินและการท่องเที่ยว
    DATA_CONSTRUCTION,   // สายก่อสร้างและอสังหา
    DATA_AGRICULTURE,   // สายเกษตรและนวัตกรรมอาหาร
    DATA_LOGISTICS,   // สายโลจิสติกส์และคลังสินค้า
    DATA_FACTORY,   // สายโรงงานเเละยานยนต์
    DATA_LIFESTYLE,   // สายความงามและสัตว์เลี้ยง
  ]
};
