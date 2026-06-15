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

const _loaded = {};

// โหลดไฟล์เดียว
function loadCategory(catId) {
  if (_loaded[catId]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = DATA_FILES[catId];
    script.onload = () => { _loaded[catId] = true; resolve(); };
    script.onerror = () => reject(new Error(`โหลด ${catId} ไม่ได้`));
    document.head.appendChild(script);
  });
}

// โหลดทุกไฟล์พร้อมกัน แล้วสร้าง DATA
async function loadAllCategories() {
  await Promise.all(Object.keys(DATA_FILES).map(id => loadCategory(id)));

  // สร้าง DATA หลังโหลดครบ
  window.DATA = {
    categories: [
      DATA_MEDICAL, DATA_TECH, DATA_BUSINESS, DATA_LAW,
      DATA_ARTS, DATA_EDUCATION, DATA_SPORTS, DATA_FOOD,
      DATA_AVIATION, DATA_CONSTRUCTION, DATA_AGRICULTURE,
      DATA_LOGISTICS, DATA_FACTORY, DATA_LIFESTYLE,
    ]
  };
}