/**
 * Career Explorer Pro - Data Loader (Dual Mode)
 * ─────────────────────────────────────────────
 * โหมด 1: ดึงข้อมูลจาก Supabase (Cloud Database)
 * โหมด 2: ถ้า Supabase ไม่ได้ → fallback ใช้ไฟล์ JS เดิม
 */

// ── Supabase Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://hqsunjyyhbovpifepnsg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ik3cIjpNua6vEN52NwIspQ_qUIAngC1';

// ── Fallback: ไฟล์ JS เดิม ───────────────────────────────────────────────────
const DATA_FILES = {
  medical:      'js/data/data-medical.js',
  tech:         'js/data/data-tech.js',
  business:     'js/data/data-business.js',
  law:          'js/data/data-law.js',
  arts:         'js/data/data-arts.js',
  education:    'js/data/data-education.js',
  sports:       'js/data/data-sports.js',
  food:         'js/data/data-food.js',
  aviation:     'js/data/data-aviation.js',
  construction: 'js/data/data-construction.js',
  agriculture:  'js/data/data-agriculture.js',
  logistics:    'js/data/data-logistics.js',
  factory:      'js/data/data-factory.js',
  lifestyle:    'js/data/data-lifestyle.js',
};

// ── State ────────────────────────────────────────────────────────────────────
const _loaded = {};
let _useSupabase = false;

// ── Helper: แปลง row จาก Supabase → structure เดิมของเว็บ ────────────────────
function rowToJob(row) {
  return {
    id:          row.id,
    nameT:       row.name_th,
    nameE:       row.name_en,
    icon:        row.icon,
    img:         row.img,
    description: row.description,
    degree:      row.degree,
    education:   row.education,
    years:       row.years,
    salary: {
      entry:  row.salary_entry,
      mid:    row.salary_mid,
      senior: row.salary_senior,
    },
    salaryBar: {
      entry:  row.salary_bar_entry,
      mid:    row.salary_bar_mid,
      senior: row.salary_bar_senior,
    },
    growth:       row.growth,
    skills:       row.skills  || [],
    tags:         row.tags    || [],
    pros:         row.pros    || [],
    cons:         row.cons    || [],
    universities: row.universities || [],
  };
}

function rowToCategory(catRow, jobs) {
  return {
    id:       catRow.id,
    nameT:    catRow.name_th,
    nameE:    catRow.name_en,
    icon:     catRow.icon_url || `img/icons/${catRow.name_en}.png`,
    color:    catRow.color      || '#fee2e2',
    iconColor: catRow.icon_color || '#be185d',
    jobs:     jobs,
  };
}

// ── โหมด 1: ดึงจาก Supabase ─────────────────────────────────────────────────
async function loadFromSupabase() {
  // ดึง categories
  const catRes = await fetch(
    `${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order.asc`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    }
  );
  if (!catRes.ok) throw new Error(`Supabase categories error: ${catRes.status}`);
  const categories = await catRes.json();

  // ดึง jobs ทั้งหมด
  const jobRes = await fetch(
    `${SUPABASE_URL}/rest/v1/jobs?select=*`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    }
  );
  if (!jobRes.ok) throw new Error(`Supabase jobs error: ${jobRes.status}`);
  const jobs = await jobRes.json();

  // จับคู่ jobs เข้า categories
  window.DATA = {
    categories: categories.map(cat => {
      const catJobs = jobs
        .filter(j => j.category_id === cat.id)
        .map(rowToJob);
      return rowToCategory(cat, catJobs);
    })
  };

  _useSupabase = true;
  console.log(`✅ Supabase: โหลดข้อมูล ${jobs.length} อาชีพ จาก ${categories.length} สายงาน`);
}

// ── โหมด 2: Fallback ใช้ไฟล์ JS เดิม ────────────────────────────────────────
function loadCategoryFromFile(catId) {
  if (_loaded[catId]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = DATA_FILES[catId];
    script.onload = () => { _loaded[catId] = true; resolve(); };
    script.onerror = () => reject(new Error(`โหลด ${catId} ไม่ได้`));
    document.head.appendChild(script);
  });
}

async function loadFromFiles() {
  await Promise.all(Object.keys(DATA_FILES).map(id => loadCategoryFromFile(id)));
  window.DATA = {
    categories: [
      DATA_MEDICAL, DATA_TECH, DATA_BUSINESS, DATA_LAW,
      DATA_ARTS, DATA_EDUCATION, DATA_SPORTS, DATA_FOOD,
      DATA_AVIATION, DATA_CONSTRUCTION, DATA_AGRICULTURE,
      DATA_LOGISTICS, DATA_FACTORY, DATA_LIFESTYLE,
    ]
  };
  console.log('📁 Fallback: โหลดข้อมูลจากไฟล์ JS');
}

// ── loadCategory (ใช้โดย render.js) ─────────────────────────────────────────
async function loadCategory(catId) {
  if (window.DATA) return; // โหลดครบแล้ว
  await loadAllCategories();
}

// ── loadAllCategories (entry point หลัก) ─────────────────────────────────────
async function loadAllCategories() {
  if (window.DATA) return; // โหลดไปแล้ว ไม่ต้องทำซ้ำ

  try {
    await loadFromSupabase();
  } catch (err) {
    console.warn('⚠️ Supabase ไม่พร้อม → ใช้ไฟล์ JS แทน:', err.message);
    await loadFromFiles();
  }
}