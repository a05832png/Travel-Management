// ============================================================
// מערכת ניהול נסיעות - Manager Console
// ============================================================

const STORAGE_KEY = 'tripManager_v4';

// Excel-accurate column schemas per line (from real Perach workbook)
const DEFAULT_LINE_SCHEMAS = {
  'perach': {
    'בני ברק': ['קו גדול 08:00', 'קו 14:00', 'קו 15:30', 'קו 16:45'],
    'אשדוד בי': ['פתיחה', 'קו 08:00', 'קו 14:00', 'קו 15:30', 'קו 16:45'],
    'מודיעין עילית': ['פתיחה', 'קו 08:00', 'קו 14:00', 'קו 16:45', 'קו צהרים קטן יום ג'],
    'יבנה אשדוד': [],
    'ראש העין': ['ראש העין פת'],
    'בני ברק יהוד': ['הלוך', 'חזור'],
    'בב רעננה': ['07:00', '13:00', '14:00', '16:45'],
    'נתניה רעננה': ['07:00', '13:00', '14:00', '16:45'],
    'תל אביב': ['הלוך', 'חזור'],
    'אלעד רעננה': ['הלוך', 'חזור'],
    'פתקי פרח': []
  },
  'airoks': {
    'קווי חולון': ['הלוך', 'חזור']
  },
  'ganei': {
    'ראשי': ['הלוך', 'חזור']
  },
  'maoz': {
    'ראשי': ['הלוך', 'חזור']
  },
  'sefer': {
    'ראשי': ['הלוך', 'חזור']
  },
  'talmidim': {
    'ראשי': ['הלוך', 'חזור']
  },
  'orhot': {
    'בית שמש נוף איילון': ['הלוך', 'חזור'],
    'ספר נוף איילון': [],
    'רמלה לוד נוף איילון': []
  },
  'ahisamach': {
    'קבוע': ['תוספת צהרים']
  },
  'friedman': {
    'ראשי': ['נסיעה']
  }
};

const EXCEL_PRICE_SEEDS = {
  'adi_jm': [
    { origin: '', destination: 'ביתר עדי נגב הלוש', price: 825, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עדי נגב ים', price: 550, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים עדי נגב הלוש', price: 1100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים נס ציונה המתנה ולביתר עילית', price: 650, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עדי נגב ים תחנה בקרית גת', price: 650, tripType: 'רגיל', active: true },
  ],
  'ahisamach': [
    { origin: 'קבוע', destination: 'תוספת צהרים', price: 150, tripType: 'רגיל', active: true },
  ],
  'airoks': [
    { origin: 'קווי חולון', destination: 'הלוך', price: 800, tripType: 'רגיל', active: true },
    { origin: 'קווי חולון', destination: 'חזור', price: 800, tripType: 'רגיל', active: true },
  ],
  'aviezri': [
    { origin: '', destination: 'ירושלים מודיעין עילית', price: 280, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ירושלים פתח תקווה', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פתח תקווה ירושלים', price: 220, tripType: 'רגיל', active: true },
  ],
  'eretz_hamda': [
    { origin: '', destination: 'בב טבריה 7 מק', price: 850, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טבריה בב', price: 600, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב יסודות סיינה', price: 450, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אלעד בב ספיישל', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר ספיישל,', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר ספיישל', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים סבא', price: 340, tripType: 'רגיל', active: true },
    { origin: '', destination: 'סבא ים', price: 340, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 250, tripType: 'רגיל', active: true },
  ],
  'fonoviz': [
    { origin: '', destination: 'בני ברק באר יעקב', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'באר יעקב בני ברק', price: 170, tripType: 'רגיל', active: true },
  ],
  'ganei': [
    { origin: 'ראשי', destination: 'הלוך', price: 100, tripType: 'רגיל', active: true },
    { origin: 'ראשי', destination: 'חזור', price: 100, tripType: 'רגיל', active: true },
  ],
  'gourmet': [
    { origin: '', destination: 'שמש עטרות', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות נתבג', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים שדה', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות ספר', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות שדה', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות רמת גן', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות מעלה מכמש', price: 210, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות אחיעזר  נתבג', price: 380, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות מעלה אדומים', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות ירושלים', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות מישור אדומים', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים פת', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תל ציון קרית יערים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים רחובות', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות שמש', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ראשון עטרות', price: 230, tripType: 'רגיל', active: true },
    { origin: '', destination: 'מישור אדומים עטרות', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות רמת שלמה', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות לרובע', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות קרית יובל', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי ים', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שדה', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות גבש', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים גת', price: 330, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עטרות ים', price: 140, tripType: 'רגיל', active: true },
  ],
  'ichud': [
    { origin: '', destination: 'כפר חיטים בב', price: 550, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר ים', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים ספר', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים בב', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'צפת אשדוד', price: 750, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים שמש', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שמש', price: 230, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש בב', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש בב סיינה המתנה', price: 380, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש ספר', price: 160, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר שמש', price: 160, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספיישל ספר כרמיאל', price: 600, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר בב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש אלעד', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ביתר ספר', price: 320, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר ביתר', price: 320, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים אלעד', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר שדה', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש הר טוב', price: 70, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ראשון', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי בב', price: 150, tripType: 'רגיל', active: true },
  ],
  'ipc': [
    { origin: '', destination: 'ים פנימי', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים שדה', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אור יהודה ים', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תלפיות גבעת זאב', price: 100, tripType: 'רגיל', active: true },
  ],
  'kartah': [
    { origin: '', destination: 'הרצליה ים', price: 350, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פתח תקווה ירושלים תל אביב', price: 550, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פתח תקווה  הרצליה', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ירושלים בני ברק', price: 300, tripType: 'רגיל', active: true },
  ],
  'keter': [
    { origin: 'טלז', destination: 'ספר', price: 320, tripType: 'רגיל', active: true },
    { origin: 'ספר', destination: 'טלז', price: 170, tripType: 'רגיל', active: true },
    { origin: 'ספר', destination: 'ים', price: 80, tripType: 'רגיל', active: true },
    { origin: 'אשדוד', destination: 'ספר', price: 240, tripType: 'רגיל', active: true },
    { origin: 'ספר', destination: 'בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז ספר הלוש', price: 320, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז שמש + 50 דק המתנה', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז כותל הלוש + שעה 360', price: 360, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז כותל הלוש + 50 דק', price: 340, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר מירון', price: 1800, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר ים', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלזסטון ספר הלוש', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'מירון מודיעין עילית', price: 1800, tripType: 'רגיל', active: true },
    { origin: '', destination: 'חפץ חיים טלז', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אשדוד ספר', price: 240, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי ים', price: 70, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר טלז', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז ספר', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים בב', price: 230, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז ים', price: 110, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר שמש', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים טלז', price: 110, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלז בב', price: 260, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי ירושלים', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים כותל טלז', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש טלז', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב טלז', price: 230, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר אחיסמך', price: 130, tripType: 'רגיל', active: true },
    { origin: '', destination: 'טלזסטון חפץ חיים', price: 320, tripType: 'רגיל', active: true },
  ],
  'lewin': [
    { origin: '', destination: 'פנימי ירושלים', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש ים', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים שמש', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ירושלים ביתר', price: 150, tripType: 'רגיל', active: true },
  ],
  'liraz': [
    { origin: '', destination: 'פנימי ים', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אחיסמך תא', price: 150, tripType: 'רגיל', active: true },
  ],
  'maayan': [
    { origin: '', destination: 'בב ספר', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פת נתבג ספרינטר הלוש', price: 1000, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר מעלה אדומים', price: 300, tripType: 'רגיל', active: true },
  ],
  'maoz': [
    { origin: 'ראשי', destination: 'הלוך', price: 180, tripType: 'רגיל', active: true },
    { origin: 'ראשי', destination: 'חזור', price: 180, tripType: 'רגיל', active: true },
  ],
  'next': [
    { origin: '', destination: 'ים שדה', price: 280, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פ ים', price: 550, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה ים', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נתיבות מעלה אדומים', price: 1400, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש ים', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שדה הלוש', price: 350, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי  פת', price: 70, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פת ים', price: 130, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים נווה דניאל', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה נתיבות ספיישל', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אורה חיפה', price: 650, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי ים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'מבשרת שדה', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ראשון ים', price: 370, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה שמש', price: 1100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה פת', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אחיסמך ים', price: 200, tripType: 'רגיל', active: true },
  ],
  'orhot': [
    { origin: 'בית שמש נוף איילון', destination: 'הלוך', price: 180, tripType: 'רגיל', active: true },
    { origin: 'בית שמש נוף איילון', destination: 'חזור', price: 180, tripType: 'רגיל', active: true },
  ],
  'perach': [
    { origin: 'בני ברק', destination: 'קו גדול 08:00', price: 320, tripType: 'רגיל', active: true },
    { origin: 'בני ברק', destination: 'קו 14:00', price: 320, tripType: 'רגיל', active: true },
    { origin: 'בני ברק', destination: 'קו 15:30', price: 170, tripType: 'רגיל', active: true },
    { origin: 'בני ברק', destination: 'קו 16:45', price: 320, tripType: 'רגיל', active: true },
    { origin: 'אשדוד בי', destination: 'פתיחה', price: 300, tripType: 'רגיל', active: true },
    { origin: 'אשדוד בי', destination: 'קו 08:00', price: 420, tripType: 'רגיל', active: true },
    { origin: 'אשדוד בי', destination: 'קו 14:00', price: 300, tripType: 'רגיל', active: true },
    { origin: 'אשדוד בי', destination: 'קו 15:30', price: 340, tripType: 'רגיל', active: true },
    { origin: 'אשדוד בי', destination: 'קו 16:45', price: 350, tripType: 'רגיל', active: true },
    { origin: 'מודיעין עילית', destination: 'פתיחה', price: 320, tripType: 'רגיל', active: true },
    { origin: 'מודיעין עילית', destination: 'קו 08:00', price: 500, tripType: 'רגיל', active: true },
    { origin: 'מודיעין עילית', destination: 'קו 14:00', price: 500, tripType: 'רגיל', active: true },
    { origin: 'מודיעין עילית', destination: 'קו 16:45', price: 300, tripType: 'רגיל', active: true },
    { origin: 'מודיעין עילית', destination: 'קו צהרים קטן יום ג', price: 160, tripType: 'רגיל', active: true },
    { origin: 'ראש העין', destination: 'ראש העין פת', price: 120, tripType: 'רגיל', active: true },
    { origin: 'בני ברק יהוד', destination: 'הלוך', price: 320, tripType: 'רגיל', active: true },
    { origin: 'בני ברק יהוד', destination: 'חזור', price: 320, tripType: 'רגיל', active: true },
    { origin: 'בב רעננה', destination: '07:00', price: 150, tripType: 'רגיל', active: true },
    { origin: 'בב רעננה', destination: '13:00', price: 150, tripType: 'רגיל', active: true },
    { origin: 'בב רעננה', destination: '14:00', price: 150, tripType: 'רגיל', active: true },
    { origin: 'בב רעננה', destination: '16:45', price: 150, tripType: 'רגיל', active: true },
    { origin: 'נתניה רעננה', destination: '07:00', price: 390, tripType: 'רגיל', active: true },
    { origin: 'נתניה רעננה', destination: '13:00', price: 240, tripType: 'רגיל', active: true },
    { origin: 'נתניה רעננה', destination: '14:00', price: 240, tripType: 'רגיל', active: true },
    { origin: 'נתניה רעננה', destination: '16:45', price: 240, tripType: 'רגיל', active: true },
    { origin: 'תל אביב', destination: 'הלוך', price: 320, tripType: 'רגיל', active: true },
    { origin: 'תל אביב', destination: 'חזור', price: 320, tripType: 'רגיל', active: true },
    { origin: 'אלעד רעננה', destination: 'הלוך', price: 190, tripType: 'רגיל', active: true },
    { origin: 'אלעד רעננה', destination: 'חזור', price: 180, tripType: 'רגיל', active: true },
  ],
  'rosenbaum': [
    { origin: '', destination: 'ספר קרית יובל', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'קרית יובל ספר', price: 220, tripType: 'רגיל', active: true },
  ],
  'rubinstein': [
    { origin: '', destination: 'רמת השרון ראשון לציון', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'זיתן נווה אילן', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תל אביב נווה אילן', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נתניה נווה אילן', price: 350, tripType: 'רגיל', active: true },
    { origin: '', destination: 'דימונה תל אביב', price: 600, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עזריה תל אביב', price: 350, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נחלים תל אביב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אשדוד תל אביב', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'רמת גן ירושלים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'זיתן ירושלים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ירושלים לוד', price: 240, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פתח תקווה זיתן תל אביב', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'מעלה אדומים תל אביב', price: 320, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בת ים תא', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תא מעלה אדומים', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'מעלה אדומים נתב״ג', price: 300, tripType: 'רגיל', active: true },
  ],
  'salam': [
    { origin: '', destination: 'שדה טלזסטון', price: 500, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה אופקים', price: 500, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה ים', price: 550, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שמש שדה', price: 250, tripType: 'רגיל', active: true },
  ],
  'sefer': [
    { origin: 'ראשי', destination: 'הלוך', price: 120, tripType: 'רגיל', active: true },
    { origin: 'ראשי', destination: 'חזור', price: 120, tripType: 'רגיל', active: true },
  ],
  'shimi': [
    { origin: '', destination: 'שמש בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי ים', price: 130, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי בני ברק הלוך חזור', price: 90, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שרתון', price: 270, tripType: 'רגיל', active: true },
    { origin: '', destination: 'באר יעקב בב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים ספר', price: 160, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תל השומר בב', price: 90, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב באר יעקב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב איכילוב', price: 110, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פת בב', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אחיסמך', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'איכילוב בב', price: 120, tripType: 'רגיל', active: true },
  ],
  'shmulik': [
    { origin: '', destination: 'ים בב הלוש', price: 430, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פ ים', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים פרסה במבשרת לב"ש', price: 400, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שרתון בב', price: 330, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב נתניה', price: 50, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שדה', price: 240, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי בני ברק שעה וחצי', price: 800, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב הרצליה', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נתניה בב', price: 400, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב גבע"ז', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אשדוד בב', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שמש', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר ראשון סיבובים', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ראשון בב', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים מירון הלוש', price: 1950, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פ בב', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אשדוד', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים תחנות', price: 380, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים אשדוד', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אלעד', price: 380, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נתיבות בב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'חבד בב', price: 140, tripType: 'רגיל', active: true },
  ],
  'taharot': [
    { origin: '', destination: 'בב ספר הלוש נק', price: 330, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר הלוש', price: 320, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב פת ים בב כביש 6', price: 570, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים הלוש', price: 640, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב נהרייה מירון נק חיפה', price: 850, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב מירון צפת מירון בני ברק', price: 1350, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ביתר', price: 500, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בני ברק נווה יעקב + משלוח', price: 520, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אחיסמך', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שמש 2 שיעורים', price: 530, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 430, tripType: 'רגיל', active: true },
    { origin: '', destination: 'שדה בב', price: 150, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים + המתנה', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אופקים הלוש', price: 800, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב פת הלוש', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ראשון בב', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב חיפה', price: 800, tripType: 'רגיל', active: true },
  ],
  'talmidim': [
    { origin: 'ראשי', destination: 'הלוך', price: 100, tripType: 'רגיל', active: true },
    { origin: 'ראשי', destination: 'חזור', price: 100, tripType: 'רגיל', active: true },
  ],
  'trudos': [
    { origin: '', destination: 'ראש העין בב', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב גבע"ז', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'גבעז בב', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב עמק חפר', price: 480, tripType: 'רגיל', active: true },
    { origin: '', destination: 'עמק חפר בב', price: 400, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ים', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים בב', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב אלעד', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אלעד בב', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב גבעת שאול', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אשדוד בב', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב נחשונים', price: 130, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אלעד בב (נחשונים)', price: 130, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב תא', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב חוות גלעד', price: 400, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תא בב', price: 140, tripType: 'רגיל', active: true },
    { origin: '', destination: 'נתניה בב', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב נתניה', price: 300, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פריימריז', price: 2100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פנימי בב', price: 70, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שדה הלוש', price: 450, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים מודיעין עילית', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב שדה', price: 280, tripType: 'רגיל', active: true },
  ],
  'yellow': [
    { origin: '', destination: 'ספר גבעת וושינגטון', price: 280, tripType: 'רגיל', active: true },
    { origin: '', destination: 'תא ספר', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'קאסם בב', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'קאסם ביתר', price: 370, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר ים', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר בב', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'חולון ספר', price: 180, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר מודיעין', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר רג', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר חיפה', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ים ספר', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר פנימי', price: 45, tripType: 'רגיל', active: true },
    { origin: '', destination: 'קאסם ספר', price: 220, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר שילת', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'חריש ספר', price: 270, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר שמש', price: 170, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ראשון ספר', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'אשדוד ספר', price: 250, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר חדרה', price: 380, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר אחיסמך', price: 120, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר מלאכי', price: 230, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פת בב', price: 100, tripType: 'רגיל', active: true },
    { origin: '', destination: 'ספר פת', price: 200, tripType: 'רגיל', active: true },
    { origin: '', destination: 'בב ספר', price: 80, tripType: 'רגיל', active: true },
    { origin: '', destination: 'פת ספר', price: 170, tripType: 'רגיל', active: true },
  ],
};



// Default customers – with lines (for multi-route customers like פרח)
// and typicalRoutes (common trips per customer for smart suggestions)
const DEFAULT_CUSTOMERS = [
  {
    id: 'perach', name: 'פרח', vat: true, notes: 'קווים קבועים + חריגים',
    lines: [
      'בני ברק', 'אשדוד בי', 'מודיעין עילית', 'יבנה אשדוד',
      'ראש העין', 'בני ברק יהוד', 'בב רעננה', 'נתניה רעננה',
      'תל אביב', 'אלעד רעננה', 'פתקי פרח'
    ],
    typicalRoutes: [
      'קו גדול 08:00', 'קו 14:00', 'קו 15:30', 'קו 16:45', 'פתיחה',
      'בב ים', 'ים בב', 'אלעד ים', 'ים אלעד', 'שדרות נתיבות', 'נתיבות שדרות'
    ],
    priceList: [
      { id: 'pl1', origin: 'בני ברק', destination: 'קו 08:00', price: 320, tripType: 'רגיל', active: true },
      { id: 'pl2', origin: 'בני ברק', destination: 'קו 14:00', price: 320, tripType: 'רגיל', active: true },
      { id: 'pl3', origin: 'בני ברק', destination: 'קו 15:30', price: 170, tripType: 'רגיל', active: true },
      { id: 'pl4', origin: 'אשדוד בי', destination: 'פתיחה', price: 300, tripType: 'רגיל', active: true },
      { id: 'pl5', origin: 'אשדוד בי', destination: 'קו 08:00', price: 420, tripType: 'רגיל', active: true },
      { id: 'pl6', origin: 'אשדוד בי', destination: 'קו 14:00', price: 300, tripType: 'רגיל', active: true },
      { id: 'pl7', origin: 'מודיעין עילית', destination: 'קו 08:00', price: 500, tripType: 'רגיל', active: true },
      { id: 'pl8', origin: 'בני ברק', destination: 'ירושלים', price: 200, tripType: 'רגיל', active: true },
      { id: 'pl9', origin: 'ירושלים', destination: 'בני ברק', price: 200, tripType: 'רגיל', active: true }
    ]
  },
  {
    id: 'orhot', name: 'אורחות חינוך', vat: true, notes: '',
    lines: ['ספר נוף איילון', 'רמלה לוד נוף איילון', 'בית שמש נוף איילון'],
    typicalRoutes: ['ספר נוף איילון', 'רמלה לוד', 'בית שמש נוף איילון', 'ספר בב', 'בב ספר']
  },
  {
    id: 'airoks', name: 'אירוקס', vat: true, notes: 'קווי חולון',
    lines: ['קווי חולון'],
    typicalRoutes: ['בב חולון', 'חולון בב', 'בב ים', 'ים בב']
  },
  {
    id: 'shmulik', name: 'שמוליק', vat: true, notes: '',
    lines: [],
    typicalRoutes: [
      'בב ים', 'ים בב', 'בב נתניה', 'נתניה בב', 'בב שמש', 'שמש בב',
      'בב אשדוד', 'אשדוד בב', 'בב ספר', 'ספר בב', 'פנימי בני ברק',
      'בב הרצליה', 'בב גבע"ז', 'ים מירון'
    ]
  },
  {
    id: 'gourmet', name: 'גורמה', vat: true, notes: '',
    lines: [],
    typicalRoutes: [
      'עטרות שדה', 'שמש עטרות', 'עטרות שמש', 'עטרות רמת גן',
      'עטרות מעלה מכמש', 'עטרות אחיעזר', 'עטרות נתבג', 'עטרות מעלה אדומים',
      'עטרות ירושלים', 'עטרות מישור אדומים', 'ים פת', 'עטרות בית אל',
      'טלזסטון תל ציון', 'פנימי ים', 'בב שדה'
    ]
  },
  {
    id: 'trudos', name: 'טרודוס ימין נדלן', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה', 'נתניה בב', 'בב שמש', 'פנימי בב']
  },
  {
    id: 'ganei', name: 'גני תקווה', vat: true, notes: '',
    lines: ['ראשי'],
    typicalRoutes: ['בב גני תקווה', 'גני תקווה בב', 'ספר גני תקווה']
  },
  {
    id: 'next', name: 'נקסט לבל', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה', 'ספר בב']
  },
  {
    id: 'carrefour', name: 'קארפור', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'אשדוד בב', 'בב אשדוד']
  },
  {
    id: 'ahisamach', name: 'אחיסמך', vat: true, notes: '',
    lines: ['קבוע'],
    typicalRoutes: ['ספר אחיסמך', 'אחיסמך ספר', 'בב אחיסמך', 'אחיסמך בב']
  },
  {
    id: 'adi_bb', name: 'עדי בני ברק', vat: true, notes: '',
    lines: ['משרד'],
    typicalRoutes: ['בב ים', 'ים בב', 'בב ספר', 'ספר בב']
  },
  {
    id: 'adi_jm', name: 'עדי ירושלים', vat: true, notes: '',
    lines: ['משרד'],
    typicalRoutes: ['ים בב', 'בב ים', 'ים ספר', 'ספר ים', 'ים טלז']
  },
  {
    id: 'yellow', name: 'יילו פרינט', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה']
  },
  {
    id: 'lewin', name: 'לוין אנדרס', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב שמש']
  },
  {
    id: 'maayan', name: 'מעיני הישועה', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'ספר בב']
  },
  {
    id: 'maoz', name: 'מעוז', vat: true, notes: '',
    lines: ['ראשי'],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה', 'ספר בב']
  },
  {
    id: 'fonoviz', name: 'פונוביז', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'ספר ים']
  },
  {
    id: 'friedman', name: 'פרידמן', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'rosenbaum', name: 'רוזנבוים', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב שמש']
  },
  {
    id: 'rubinstein', name: 'רובינשטיין הפקות', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה', 'נתניה בב']
  },
  {
    id: 'shimi', name: 'שימי קורלנסקי (בית השם)', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב שמש', 'שמש בב']
  },
  {
    id: 'salam', name: 'סלאם', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'sefer', name: 'ספר שעלבים', vat: true, notes: '',
    lines: ['ראשי'],
    typicalRoutes: ['ספר בב', 'בב ספר', 'ספר ים', 'ים ספר', 'ספר שמש']
  },
  {
    id: 'keter', name: 'כתר תורה', vat: true, notes: 'מזמינים לפי מסלול – קריטי',
    lines: ['שוטף'],
    typicalRoutes: [
      'ים טלזסטון', 'בב טלזסטון', 'טלזסטון בב', 'טלז ים', 'ים טלז',
      'ספר ים', 'טלז ספר', 'טלז ספר הלוש', 'טלז כותל', 'טלז שמש',
      'טלזסטון ספר הלוש', 'ספר מירון', 'מירון מודיעין עילית', 'חפץ חיים טלז',
      'אשדוד ספר', 'פנימי ים', 'ספר טלז', 'ספר בב', 'ים בב', 'ספר שמש',
      'טלז בב', 'פנימי ירושלים', 'ים כותל טלז', 'שמש טלז'
    ],
    orderers: [
      'הרב שפירא', 'ברמן+קסלר', 'פשוורסקי', 'הרב פריד', 'הרב זיסקינד',
      'וולף', 'פריד', 'קסלר', 'הרב שכטר', 'יעקובוביץ', 'הרבנית זיסקינד',
      'מזוודה', 'הרב פינקוס', '0527671503', '0533167663', '0548415508', '0549140352'
    ],
    ordererByRoute: {
      'ים טלזסטון': 'הרב שפירא',
      'בב טלזסטון': 'ברמן+קסלר',
      'טלזסטון בב': 'פשוורסקי',
      'טלז ים': 'פריד',
      'ים טלז': 'פריד',
      'ספר ים': 'וולף',
      'אשדוד ספר': 'וולף',
      'ספר בב': 'וולף',
      'ספר שמש': 'וולף',
      'פנימי ירושלים': 'וולף',
      'פנימי ים': 'מזוודה',
      'טלז ספר הלוש': 'הרב זיסקינד',
      'טלז כותל': 'הרב זיסקינד',
      'טלז שמש': 'הרב זיסקינד',
      'טלזסטון ספר הלוש': 'הרב זיסקינד',
      'ים כותל טלז': 'הרב זיסקינד',
      'חפץ חיים טלז': 'הרבנית זיסקינד',
      'ספר מירון': 'יעקובוביץ',
      'שמש טלז': 'הרב פינקוס'
    },
    priceList: [
      { id: 'kt1', origin: 'ים', destination: 'טלזסטון', price: 0, tripType: 'רגיל', active: false },
      { id: 'kt2', origin: 'בב', destination: 'טלזסטון', price: 0, tripType: 'רגיל', active: false },
      { id: 'kt3', origin: 'טלזסטון', destination: 'בב', price: 0, tripType: 'רגיל', active: false },
      { id: 'kt4', origin: 'ספר', destination: 'ים', price: 80, tripType: 'רגיל', active: true },
      { id: 'kt5', origin: 'אשדוד', destination: 'ספר', price: 240, tripType: 'רגיל', active: true },
      { id: 'kt6', origin: 'ספר', destination: 'בב', price: 100, tripType: 'רגיל', active: true },
      { id: 'kt7', origin: 'טלז', destination: 'ספר', price: 320, tripType: 'רגיל', active: true },
      { id: 'kt8', origin: 'טלז', destination: 'כותל', price: 360, tripType: 'רגיל', active: true }
    ]
  },
  {
    id: 'taharot', name: 'כולל טהרות', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'ספר בב']
  },
  {
    id: 'kartah', name: 'קרתא נדלן', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'aviezri', name: 'אבי עזרי', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב נתניה']
  },
  {
    id: 'ichud', name: 'איחוד הנוער', vat: true, notes: '',
    lines: ['שוטף'],
    typicalRoutes: ['בב ים', 'ים בב', 'ספר בב', 'בב ספר']
  },
  {
    id: 'ipc', name: 'איי פי סי קולג', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'eretz', name: 'ארץ הצבי', vat: false, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'batei', name: 'בתי אבות', vat: false, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'בב שמש']
  },
  {
    id: 'liraz', name: 'לירז ביאת הישועה', vat: true, notes: '',
    lines: ['ביאת הישועה שוטף'],
    typicalRoutes: ['בב ים', 'ים בב']
  },
  {
    id: 'talmidim', name: 'תלמידים פת', vat: true, notes: '',
    lines: ['ראשי'],
    typicalRoutes: ['פת ספר', 'ספר פת', 'פת ים', 'ים פת', 'בב פת']
  },
  {
    id: 'eretz_hamda', name: 'י א. ארץ חמדה', vat: true, notes: '',
    lines: [],
    typicalRoutes: ['בב ים', 'ים בב', 'ספר בב']
  },
];

// Fallback global routes
const COMMON_ROUTES = [
  'בב ים', 'ים בב', 'בב נתניה', 'נתניה בב', 'ספר בב', 'בב ספר',
  'ים ספר', 'ספר ים', 'בב חולון', 'בב שמש', 'שמש בב', 'טלז ים',
  'ים טלז', 'אשדוד בב', 'בב אשדוד', 'אלעד בב', 'בב אלעד',
  'פנימי בב', 'פנימי ספר', 'פנימי ים', 'שדה ים', 'ים שדה',
  'פת ספר', 'ספר שמש', 'עטרות שמש', 'עטרות נתבג'
];


// Default drivers (from Excel notes + phones found in files)
const DEFAULT_DRIVERS = [
  { id: 'd_amin', name: 'אמין', phone: '', favorite: true, customerId: 'shmulik' },
  { id: 'd_dudi', name: 'דודי', phone: '', favorite: true, customerId: 'shimi' },
  { id: 'd_dudi_trop', name: 'דודי טרופ', phone: '', favorite: false, customerId: 'shimi' },
  { id: 'd_david_h', name: 'דוד הורביץ', phone: '', favorite: true, customerId: 'maayan' },
  { id: 'd_david_k', name: "ר' דוד קורלנסקי", phone: '', favorite: true, customerId: 'taharot' },
];

const ABBREV_HINTS = {
  'בב': 'בני ברק', 'ים': 'ירושלים', 'ספר': 'מודיעין עילית',
  'מע': 'מודיעין עילית', 'טלז': 'טלז סטון', 'בש': 'בית שמש',
  'שמש': 'בית שמש', 'פת': 'פתח תקווה', 'שדה': 'שדה תעופה'
};

// ---------- State ----------
let state = {
  customers: [],
  trips: [],
  drivers: [],
  workingMonth: '',
  editingCustomerId: null,
  editingDriverId: null,
  defaultVat: 18,
  importPending: [],
  deskPrefs: {},
  geminiApiKey: '',
  lastBackupAt: 0
};

// Early init for vars used before their original declaration (avoid TDZ crash on load)
let _calSelectedDays = new Set();
let _editingPriceList = [];
let _editingLines = [];
let _editingTripId = null;
let _pendingTrip = null;
let _lastSuggestion = null;
let _matrixCustomerId = null;
let _excelRaw = null;
let _excelMapping = {};
let _importPending = [];
let _importBatchId = null;

function loadState() {
  // Cloud-first: initialize from safe defaults. The async cloud hydrator below
  // replaces this state after authentication; no business data is stored locally.
  state.customers = JSON.parse(JSON.stringify(DEFAULT_CUSTOMERS));
  state.trips = [];
  state.drivers = JSON.parse(JSON.stringify(DEFAULT_DRIVERS));
  state.workingMonth = currentMonthStr();
  state.defaultVat = 18;
  state.deskPrefs = {};
  state.geminiApiKey = '';
  state.lastBackupAt = 0;
}

let _cloudSaveTimer = null;
let _cloudApplying = false;

function getPersistedState() {
  return {
    customers: state.customers,
    trips: state.trips,
    drivers: state.drivers,
    workingMonth: state.workingMonth,
    defaultVat: state.defaultVat,
    deskPrefs: state.deskPrefs || {},
    geminiApiKey: state.geminiApiKey || '',
    lastBackupAt: state.lastBackupAt || 0
  };
}

function saveState() {
  if (_cloudApplying) return;
  if (window.CloudSync && typeof window.CloudSync.scheduleSave === 'function') {
    window.CloudSync.scheduleSave(getPersistedState());
  } else {
    console.warn('CloudSync is not ready; changes are kept in memory until cloud connection is available.');
  }
}

function applyCloudState(data) {
  if (!data) return;
  _cloudApplying = true;
  try {
    state.customers = data.customers || [];
    state.trips = data.trips || [];
    state.drivers = data.drivers || [];
    state.workingMonth = data.workingMonth || currentMonthStr();
    state.defaultVat = data.defaultVat ?? 18;
    state.deskPrefs = data.deskPrefs || {};
    state.geminiApiKey = data.geminiApiKey || '';
    state.lastBackupAt = data.lastBackupAt || 0;
  } finally {
    _cloudApplying = false;
  }
}

async function resetAllCloudData() {
  if (!window.CloudSync) return;
  const fresh = {
    customers: JSON.parse(JSON.stringify(DEFAULT_CUSTOMERS)),
    trips: [],
    drivers: JSON.parse(JSON.stringify(DEFAULT_DRIVERS)),
    workingMonth: currentMonthStr(),
    defaultVat: 18,
    deskPrefs: {},
    geminiApiKey: '',
    lastBackupAt: 0
  };
  applyCloudState(fresh);
  await window.CloudSync.saveNow(getPersistedState());
  initUI();
  showTab('quick');
  toast('הנתונים אופסו בענן');
}

function currentMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------- Toast ----------
function toast(msg, ms = 2500) {
  try {
    const el = document.getElementById('toast');
    if (!el) { console.log('[toast]', msg); return; }
    el.textContent = msg;
    el.classList.remove('opacity-0');
    el.classList.add('opacity-100');
    setTimeout(() => {
      el.classList.remove('opacity-100');
      el.classList.add('opacity-0');
    }, ms || 2500);
  } catch (e) { console.log('[toast]', msg); }
}

// ---------- Tabs ----------
function showTab(name) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active', 'border-blue-600', 'text-blue-700');
    btn.classList.add('border-transparent', 'text-slate-500');
  });
  const section = document.getElementById('tab-' + name);
  if (section) section.classList.remove('hidden');
  const btn = document.querySelector(`[data-tab="${name}"]`);
  if (btn) {
    btn.classList.add('active', 'border-blue-600', 'text-blue-700');
    btn.classList.remove('border-transparent', 'text-slate-500');
  }
  if (name === 'trips') renderTrips();
  if (name === 'customers') renderCustomers();
  if (name === 'export') renderExportList();
  if (name === 'drivers') renderDrivers();
  if (name === 'ai') { initAIChat(); updateGeminiStatus(); }
  if (name === 'dashboard') renderDashboard();
  if (name === 'desk') initSecretaryDesk();
  if (name === 'reports') { populateAnalysisCustomer(); renderDeviations(); renderCustomerAnalysis(); }
  if (name === 'import') {
    const ex = document.getElementById('excelCustomer');
    if (ex) {
      const cur = ex.value;
      ex.innerHTML = '<option value="">— זהה מהקובץ / בחר —</option>';
      state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
        const o = document.createElement('option');
        o.value = c.id; o.textContent = c.name;
        ex.appendChild(o);
      });
      if (cur) ex.value = cur;
    }
    // populate import customer select
    const el = document.getElementById('importCustomer');
    if (el) {
      const cur = el.value;
      el.innerHTML = '<option value="">— ללא שיוך אוטומטי —</option>';
      state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
        const o = document.createElement('option');
        o.value = c.id; o.textContent = c.name;
        el.appendChild(o);
      });
      if (cur) el.value = cur;
    }
  }
  if (name === 'settings') {
    const wm = document.getElementById('workingMonth');
    if (wm) wm.value = state.workingMonth;
    const dv = document.getElementById('defaultVat');
    if (dv) dv.value = state.defaultVat;
  }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ---------- Parse WhatsApp paste ----------
function parsePaste() {
  const text = document.getElementById('pasteArea').value.trim();
  if (!text) {
    toast('הדבק הודעה קודם');
    return;
  }

  let date = null;
  let price = null;
  let route = '';
  let notes = '';

  // Date patterns: DD/MM, DD/MM/YYYY, DD.MM, YYYY-MM-DD, or Hebrew date mentions
  const datePatterns = [
    /(\d{1,2})[\/\.](\d{1,2})(?:[\/\.](\d{2,4}))?/,
    /(\d{4})-(\d{2})-(\d{2})/
  ];
  for (const p of datePatterns) {
    const m = text.match(p);
    if (m) {
      if (p === datePatterns[1]) {
        date = `${m[1]}-${m[2]}-${m[3]}`;
      } else {
        let day = m[1].padStart(2, '0');
        let month = m[2].padStart(2, '0');
        let year = m[3] ? (m[3].length === 2 ? '20' + m[3] : m[3]) : state.workingMonth.slice(0, 4);
        // If month > 12, swap (sometimes people write MM/DD)
        if (parseInt(month) > 12) {
          [day, month] = [month, day];
        }
        date = `${year}-${month}-${day}`;
      }
      break;
    }
  }
  if (!date) {
    // default to today within working month
    const [y, m] = state.workingMonth.split('-');
    const today = new Date();
    if (today.getFullYear() == y && (today.getMonth() + 1) == parseInt(m)) {
      date = today.toISOString().slice(0, 10);
    } else {
      date = `${state.workingMonth}-01`;
    }
  }

  // Price: standalone number 50-5000, or after ₪ / ש"ח
  const pricePatterns = [
    /(?:₪|ש"ח|שח|מחיר)[:\s]*(\d{2,5})/,
    /(?:^|\s)(\d{2,4})(?:\s|$)/
  ];
  for (const p of pricePatterns) {
    const m = text.match(p);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 40 && n <= 5000) {
        price = n;
        break;
      }
    }
  }

  // Route: look for known patterns
  const lower = text;
  for (const r of COMMON_ROUTES) {
    if (lower.includes(r)) {
      route = r;
      break;
    }
  }
  // If no known route, take first meaningful line without pure numbers/dates
  if (!route) {
    const lines = text.split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (!/^\d+[\/\.]?\d*$/.test(line) && !/^\d{2,5}$/.test(line) && line.length > 2 && line.length < 40) {
        route = line;
        break;
      }
    }
  }

  // Notes keywords
  const noteKeywords = ['ספיישל', 'ספרינטר', 'המתנה', 'קאפ', 'מיניבוס', 'סיינה', 'פנימי', 'הלוך', 'חזור', 'תחנות'];
  const foundNotes = noteKeywords.filter(k => text.includes(k));
  if (foundNotes.length) notes = foundNotes.join(', ');

  // Suggest customer by keywords
  let suggestedCustomer = '';
  const custKeywords = {
    'perach': ['פרח'],
    'gourmet': ['גורמה', 'עטרות'],
    'airoks': ['אירוקס', 'חולון'],
    'shmulik': ['שמוליק'],
    'orhot': ['אורחות'],
  };
  for (const [cid, keys] of Object.entries(custKeywords)) {
    if (keys.some(k => text.includes(k))) {
      suggestedCustomer = cid;
      break;
    }
  }

  // Fill form
  document.getElementById('formDate').value = date;
  document.getElementById('formPrice').value = price || '';
  document.getElementById('formRoute').value = route;
  document.getElementById('formNotes').value = notes;
  if (suggestedCustomer) {
    document.getElementById('formCustomer').value = suggestedCustomer;
  }

  renderRouteSuggestions(route);
  toast(price || route ? 'נותח בהצלחה – אשר ושמור' : 'לא זוהו פרטים ברורים – מלא ידנית');
  try { checkWhatsAppPriceAgainstList(); } catch(_e) {}
}

function onCustomerChange() {
  const cid = document.getElementById('formCustomer').value;
  const c = getCustomer(cid);
  const lineRow = document.getElementById('lineRow');
  const formLine = document.getElementById('formLine');

  // Lines dropdown
  if (c && c.lines && c.lines.length) {
    lineRow.classList.remove('hidden');
    formLine.innerHTML = '<option value="">— בחר קו —</option>';
    c.lines.forEach(line => {
      const opt = document.createElement('option');
      opt.value = line;
      opt.textContent = line;
      formLine.appendChild(opt);
    });
  } else {
    lineRow.classList.add('hidden');
    formLine.innerHTML = '<option value="">— בחר קו —</option>';
  }
  onFormLineChange();

  // Smart route suggestions for this customer
  renderRouteSuggestions(cid);
  try { refreshOrdererSuggestions(); } catch (_e) {}
  renderDriverFavorites(cid);
  refreshPriceSuggestion();
  refreshPlaceList();
}

function getSuggestionsForCustomer(customerId) {
  const suggestions = [];
  const seen = new Set();

  const c = getCustomer(customerId);
  // 0) Preferred routes learned (most used first)
  if (c && c.preferredRoutes && c.preferredRoutes.length) {
    c.preferredRoutes.slice().sort((a,b)=>(b.count||0)-(a.count||0)).forEach(p => {
      if (p.route && !seen.has(p.route)) { seen.add(p.route); suggestions.push(p.route); }
    });
  }

  // 1) From customer's predefined typicalRoutes
  if (c && c.typicalRoutes) {
    c.typicalRoutes.forEach(r => {
      if (!seen.has(r)) { seen.add(r); suggestions.push(r); }
    });
  }

  // 2) From historical trips of this customer (most frequent first)
  if (customerId) {
    const counts = {};
    state.trips
      .filter(t => t.customerId === customerId && t.route)
      .forEach(t => {
        counts[t.route] = (counts[t.route] || 0) + 1;
      });
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([route]) => {
        if (!seen.has(route)) { seen.add(route); suggestions.push(route); }
      });
  }

  // 3) Fallback global
  if (suggestions.length < 8) {
    COMMON_ROUTES.forEach(r => {
      if (!seen.has(r)) { seen.add(r); suggestions.push(r); }
    });
  }

  return suggestions.slice(0, 16);
}

function renderRouteSuggestions(customerId) {
  const box = document.getElementById('routeSuggestions');
  box.innerHTML = '';
  const routes = getSuggestionsForCustomer(customerId || document.getElementById('formCustomer').value);

  if (!routes.length) return;

  // Label
  const label = document.createElement('span');
  label.className = 'text-xs text-slate-400 w-full mb-0.5';
  label.textContent = customerId ? 'מסלולים נפוצים ללקוח זה:' : 'מסלולים נפוצים:';
  box.appendChild(label);

  routes.forEach(r => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg transition border border-blue-100';
    btn.textContent = r;
    btn.onclick = () => {
      pickRouteSuggestion(r);
    };
    box.appendChild(btn);
  });
}


function requirePriceOrConfirm(price, contextLabel) {
  const p = parseFloat(price);
  if (p && p > 0) return true;
  const msg = contextLabel
    ? `לא הוזן מחיר${contextLabel}. לשמור בכל זאת?`
    : 'לא הוזן מחיר. לשמור בכל זאת?';
  return confirm('⚠️ ' + msg);
}

// ---------- Save trip ----------
// _pendingTrip/_lastSuggestion at top

function saveTrip() {
  const customerId = document.getElementById('formCustomer').value;
  const line = document.getElementById('formLine').value || '';
  const formCol = (document.getElementById('formColumn')?.value || '').trim();
  const date = document.getElementById('formDate').value;
  const price = parseFloat(document.getElementById('formPrice').value) || 0;
  const route = document.getElementById('formRoute').value.trim();
  const notes = document.getElementById('formNotes').value.trim();
  const driver = document.getElementById('formDriver').value.trim();
  const origin = (document.getElementById('formOrigin')?.value || '').trim() || line;
  const destination = (document.getElementById('formDestination')?.value || '').trim() || formCol;

  if (!customerId) { toast('נא לבחור לקוח'); return; }
  if (!price && !route && !origin) { toast('נא למלא מחיר או מסלול'); return; }

  // Multi-day from calendar, or single date
  const days = (window._calSelectedDays && _calSelectedDays.size)
    ? Array.from(_calSelectedDays).sort()
    : (date ? [date] : []);
  if (!days.length) { toast('נא לבחור תאריך או ימים בלוח'); return; }

  if (!requirePriceOrConfirm(price)) {
    toast('השמירה בוטלה – חסר מחיר');
    document.getElementById('formPrice')?.focus();
    return;
  }

  const suggestion = suggestPrice(customerId, origin, destination, route, days[0]);
  const listPrice = suggestion.sourceTier <= 2 ? suggestion.price : null;
  const routeFinal = route || (line && formCol ? `${line} · ${formCol}` : [origin, destination].filter(Boolean).join(' → '));
  // column from explicit select, or detect from route
  let columnKey = formCol || '';
  if (!columnKey && (/\d{1,2}:\d{2}/.test(routeFinal) || /^(קו |פתיחה|הלוך|חזור)/.test(routeFinal))) {
    columnKey = routeFinal;
  }

  // Expand הלוך+חזור into two separate trips (editable/deletable later)
  let columnKeys = [columnKey];
  let pricesPerCol = [price];
  if (formCol === '__BOTH_HALOCH_HAZOR__' || columnKey === '__BOTH_HALOCH_HAZOR__' || /הלוך\s*\+\s*חזור/.test(routeFinal)) {
    columnKeys = ['הלוך', 'חזור'];
    const date0 = days[0];
    const s1 = suggestPrice(customerId, line, 'הלוך', 'הלוך', date0, line, 'הלוך');
    const s2 = suggestPrice(customerId, line, 'חזור', 'חזור', date0, line, 'חזור');
    // If user entered a single total price and both list prices known, split; else same price each or half
    if (s1.price && s2.price) {
      pricesPerCol = [s1.price, s2.price];
    } else if (price && price > 0) {
      // same price for each leg if not in list
      pricesPerCol = [price, price];
    } else {
      pricesPerCol = [s1.price || 0, s2.price || 0];
    }
  }

  const trips = [];
  days.forEach(d => {
    columnKeys.forEach((ck, i) => {
      const p = pricesPerCol[i] != null ? pricesPerCol[i] : price;
      const sug = suggestPrice(customerId, line || origin, ck, ck, d, line, ck);
      trips.push({
        id: uid(),
        customerId,
        line,
        columnKey: ck,
        date: d,
        price: p,
        listPrice: sug.sourceTier <= 2 ? sug.price : listPrice,
        suggestedPrice: sug.price || suggestion.price,
        priceSource: sug.source || suggestion.source,
        origin: origin || line,
        destination: ck,
        route: line ? `${line} · ${ck}` : ck,
        notes,
        driver,
        source: 'manual',
        createdAt: new Date().toISOString()
      });
    });
  });

  // Dup check on first
  const dups = findDuplicateTrips(trips[0]);
  if (dups.length && trips.length === 1) {
    _pendingTrip = trips[0];
    showDupModal(dups);
    return;
  }

  trips.forEach(t => state.trips.unshift(t));
  const learned = learnFromTrips(trips);
  saveState();
  toastLearned(learned);
  document.getElementById('formPrice').value = '';
  document.getElementById('formRoute').value = '';
  document.getElementById('formNotes').value = '';
  const fo = document.getElementById('formOrigin'); if (fo) fo.value = '';
  const fd = document.getElementById('formDestination'); if (fd) fd.value = '';
  document.getElementById('pasteArea').value = '';
  if (days.length === 1) document.getElementById('formDate').value = days[0];
  calClearDays();
  hidePriceBoxes();
  toast(trips.length > 1 ? `✅ נשמרו ${trips.length} נסיעות` : '✅ הנסיעה נשמרה');
  renderRecent();
  refreshPlaceList();
}

function confirmSaveTrip(force, trip) {
  const t = trip || _pendingTrip;
  if (!t) return;
  closeDupModal();
  state.trips.unshift(t);
  const _learned = learnFromTrip(t); saveState(); toastLearned(_learned);
  _pendingTrip = null;

  document.getElementById('formPrice').value = '';
  document.getElementById('formRoute').value = '';
  document.getElementById('formNotes').value = '';
  const fo = document.getElementById('formOrigin'); if (fo) fo.value = '';
  const fd = document.getElementById('formDestination'); if (fd) fd.value = '';
  document.getElementById('pasteArea').value = '';
  document.getElementById('formDate').value = t.date;
  hidePriceBoxes();

  toast('✅ הנסיעה נשמרה');
  renderRecent();
  refreshPlaceList();
}

function findDuplicateTrips(trip) {
  return state.trips.filter(t =>
    t.customerId === trip.customerId &&
    t.date === trip.date &&
    (t.route || '') === (trip.route || '') &&
    Math.abs((t.price || 0) - (trip.price || 0)) < 0.01 &&
    (t.origin || '') === (trip.origin || '') &&
    (t.destination || '') === (trip.destination || '')
  ).slice(0, 3);
}

function showDupModal(dups) {
  const el = document.getElementById('dupDetails');
  el.innerHTML = dups.map(t =>
    `<div class="border border-slate-200 rounded-lg p-2">תאריך ${formatDate(t.date)} · ${t.route || '—'} · ${formatMoney(t.price)}</div>`
  ).join('');
  document.getElementById('dupModal').classList.remove('hidden');
  document.getElementById('dupModal').classList.add('flex');
}

function closeDupModal() {
  const m = document.getElementById('dupModal');
  if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
  _pendingTrip = null;
}

// ---------- Render helpers ----------
function getCustomer(id) {
  const c = state.customers.find(c => c.id === id);
  if (c) {
    if (!c.lines) c.lines = [];
    if (!c.typicalRoutes) c.typicalRoutes = [];
    if (!c.priceList) c.priceList = [];
    return c;
  }
  const def = DEFAULT_CUSTOMERS.find(c => c.id === id);
  if (def) {
    if (!def.priceList) def.priceList = [];
    return def;
  }
  return { id, name: id, vat: true, lines: [], typicalRoutes: [], priceList: [] };
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function formatMoney(n) {
  return (n || 0).toLocaleString('he-IL') + ' ₪';
}

function populateCustomerSelects() {
  const selects = ['formCustomer', 'filterCustomer'];
  selects.forEach(sid => {
    const el = document.getElementById(sid);
    if (!el) return;
    const current = el.value;
    const firstOpt = el.options[0] ? el.options[0].outerHTML : '';
    el.innerHTML = sid === 'filterCustomer'
      ? '<option value="">כל הלקוחות</option>'
      : '<option value="">— בחר לקוח —</option>';
    state.customers
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'he'))
      .forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name + (c.vat ? '' : ' (ללא מע״מ)');
        el.appendChild(opt);
      });
    if (current) el.value = current;
  });
}

function renderRecent() {
  const box = document.getElementById('recentTrips');
  const recent = state.trips.slice(0, 8);
  if (!recent.length) {
    box.innerHTML = '<p class="text-slate-400 text-sm">עדיין אין נסיעות</p>';
    return;
  }
  box.innerHTML = recent.map(t => {
    const c = getCustomer(t.customerId);
    return `
      <div class="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl text-sm gap-2">
        <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onclick="editTrip('${t.id}')">
          <span class="text-slate-500 shrink-0">${formatDate(t.date)}</span>
          <span class="font-medium text-blue-700 shrink-0">${c.name}${t.line ? ' · ' + t.line : ''}</span>
          <span class="text-slate-600 truncate">${t.route || '—'}</span>
        </div>
        <span class="font-semibold shrink-0">${formatMoney(t.price)}${t.listPrice != null && t.listPrice !== t.price ? ` <span class="text-xs text-amber-600" title="מחירון ${t.listPrice}">⚠️</span>` : ''}</span>
        <button onclick="editTrip('${t.id}')" class="text-blue-600 text-xs shrink-0 hover:underline">ערוך</button>
      </div>`;
  }).join('');
}

function onFilterCustomerChange() {
  const cid = document.getElementById('filterCustomer').value;
  const lineSel = document.getElementById('filterLine');
  const routeSel = document.getElementById('filterRoute');
  if (!lineSel) { renderTrips(); return; }
  if (cid) {
    const c = getCustomer(cid);
    const lines = c.lines || [];
    lineSel.innerHTML = '<option value="">כל הקווים</option>';
    lines.forEach(l => {
      const o = document.createElement('option');
      o.value = l; o.textContent = l;
      lineSel.appendChild(o);
    });
    lineSel.classList.toggle('hidden', !lines.length);
  } else {
    lineSel.innerHTML = '<option value="">כל הקווים</option>';
    lineSel.classList.add('hidden');
  }
  if (routeSel) { routeSel.innerHTML = '<option value="">כל המסלולים</option>'; routeSel.classList.add('hidden'); }
  renderTrips();
}

function onFilterLineChange() {
  const cid = document.getElementById('filterCustomer').value;
  const line = document.getElementById('filterLine').value;
  const routeSel = document.getElementById('filterRoute');
  if (!routeSel) { renderTrips(); return; }
  routeSel.innerHTML = '<option value="">כל המסלולים</option>';
  if (cid && line) {
    const routes = new Set();
    // schema columns as "routes" within line
    getLineSchema(cid, line).forEach(col => routes.add(col));
    // actual routes from trips
    state.trips.filter(t => t.customerId === cid && t.line === line).forEach(t => {
      if (t.route) routes.add(t.route);
      if (t.columnKey) routes.add(t.columnKey);
    });
    Array.from(routes).sort((a,b)=>a.localeCompare(b,'he')).forEach(r => {
      const o = document.createElement('option');
      o.value = r; o.textContent = r;
      routeSel.appendChild(o);
    });
    routeSel.classList.toggle('hidden', routes.size === 0);
  } else {
    routeSel.classList.add('hidden');
  }
  renderTrips();
}

function renderTrips() {
  const custFilter = document.getElementById('filterCustomer').value;
  const lineFilter = document.getElementById('filterLine')?.value || '';
  const routeFilter = document.getElementById('filterRoute')?.value || '';
  const monthFilter = document.getElementById('filterMonth').value || state.workingMonth;
  const search = (document.getElementById('filterSearch').value || '').trim().toLowerCase();

  let list = state.trips.filter(t => {
    if (custFilter && t.customerId !== custFilter) return false;
    if (lineFilter && t.line !== lineFilter && !(t.route||'').includes(lineFilter)) return false;
    if (routeFilter) {
      const hit = (t.route||'') === routeFilter || t.columnKey === routeFilter ||
        (t.route||'').includes(routeFilter) || (t.destination||'') === routeFilter;
      if (!hit) return false;
    }
    if (monthFilter && !t.date.startsWith(monthFilter)) return false;
    if (search) {
      const hay = `${t.route} ${t.notes} ${t.driver} ${t.line||''} ${t.columnKey||''} ${getCustomer(t.customerId).name}`.toLowerCase();
      if (!hay.includes(search)) return false;
    }
    return true;
  });

  const tbody = document.getElementById('tripsTableBody');
  const empty = document.getElementById('tripsEmpty');

  if (!list.length) {
    tbody.innerHTML = '';
    empty.classList.remove('hidden');
    document.getElementById('tripsCount').textContent = '';
    document.getElementById('tripsSum').textContent = '';
    return;
  }
  empty.classList.add('hidden');

  tbody.innerHTML = list.map(t => {
    const c = getCustomer(t.customerId);
    const dev = t.listPrice != null && Math.abs(t.listPrice - t.price) > 0.5;
    const routeLabel = t.columnKey || t.route || '—';
    const notesLabel = cleanTripNotes(t);
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50">
        <td class="py-2.5 px-2 text-center"><input type="checkbox" class="trip-check rounded" value="${t.id}" /></td>
        <td class="py-2.5 px-3">${formatDate(t.date)}</td>
        <td class="py-2.5 px-3 font-medium">${c.name}${t.line ? ' <span class="text-xs text-slate-400">(' + t.line + ')</span>' : ''}</td>
        <td class="py-2.5 px-3">${routeLabel}</td>
        <td class="py-2.5 px-3">
          <input type="number" value="${t.price || 0}" onchange="quickEditPrice('${t.id}', this.value)"
            class="w-20 border border-slate-200 rounded-lg px-1.5 py-1 text-sm font-semibold text-center ${dev ? 'bg-amber-50 border-amber-300' : ''}" />
        </td>
        <td class="py-2.5 px-3 text-slate-500">${notesLabel}</td>
        <td class="py-2.5 px-3 text-slate-500">${t.driver || ''}</td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap">
          <button onclick="editTrip('${t.id}')" class="text-blue-600 hover:text-blue-800 text-xs font-medium ml-1">ערוך</button>
          <button onclick="deleteTrip('${t.id}')" class="text-red-500 hover:text-red-700 text-xs">מחק</button>
        </td>
      </tr>`;
  }).join('');
  const selAll = document.getElementById('tripSelectAll');
  if (selAll) selAll.checked = false;
  // auto excel view when customer+line selected
  if (document.getElementById('tripsExcelView') && !document.getElementById('tripsExcelView').classList.contains('hidden')) {
    renderTripsExcelView();
  }

  const total = list.reduce((s, t) => s + (t.price || 0), 0);
  document.getElementById('tripsCount').textContent = `${list.length} נסיעות`;
  document.getElementById('tripsSum').textContent = `סה״כ: ${formatMoney(total)}`;
}

function deleteTrip(id) {
  state.trips = state.trips.filter(t => t.id !== id);
  saveState();
  renderTrips();
  renderRecent();
  toast('נמחק');
}

// _editingTripId declared at top

function editTrip(id) {
  const t = state.trips.find(x => x.id === id);
  if (!t) return;
  _editingTripId = id;
  const sel = document.getElementById('editTripCustomer');
  sel.innerHTML = '';
  state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    if (c.id === t.customerId) o.selected = true;
    sel.appendChild(o);
  });
  document.getElementById('editTripDate').value = t.date || '';
  document.getElementById('editTripPrice').value = t.price || '';
  document.getElementById('editTripOrigin').value = t.origin || '';
  document.getElementById('editTripDest').value = t.destination || t.columnKey || '';
  document.getElementById('editTripRoute').value = t.route || '';
  document.getElementById('editTripDriver').value = t.driver || '';
  document.getElementById('editTripNotes').value = t.notes || '';
  onEditTripCustomerChange();
  const lineSel = document.getElementById('editTripLine');
  if (lineSel && t.line) lineSel.value = t.line;
  document.getElementById('tripEditModal').classList.remove('hidden');
  document.getElementById('tripEditModal').classList.add('flex');
}

function onEditTripCustomerChange() {
  const cid = document.getElementById('editTripCustomer').value;
  const c = getCustomer(cid);
  const row = document.getElementById('editTripLineRow');
  const lineSel = document.getElementById('editTripLine');
  if (c && c.lines && c.lines.length) {
    row.classList.remove('hidden');
    lineSel.innerHTML = '<option value="">— ללא קו —</option>';
    c.lines.forEach(l => {
      const o = document.createElement('option');
      o.value = l; o.textContent = l;
      lineSel.appendChild(o);
    });
  } else {
    row.classList.add('hidden');
    lineSel.innerHTML = '';
  }
}

function closeTripEdit() {
  document.getElementById('tripEditModal').classList.add('hidden');
  document.getElementById('tripEditModal').classList.remove('flex');
  _editingTripId = null;
}

function saveTripEdit() {
  const t = state.trips.find(x => x.id === _editingTripId);
  if (!t) return;
  t.customerId = document.getElementById('editTripCustomer').value;
  t.line = document.getElementById('editTripLine')?.value || '';
  t.date = document.getElementById('editTripDate').value;
  t.price = parseFloat(document.getElementById('editTripPrice').value) || 0;
  t.origin = document.getElementById('editTripOrigin').value.trim();
  t.destination = document.getElementById('editTripDest').value.trim();
  t.columnKey = t.destination || t.columnKey || '';
  t.route = document.getElementById('editTripRoute').value.trim() ||
    [t.line, t.columnKey || t.destination].filter(Boolean).join(' · ');
  t.driver = document.getElementById('editTripDriver').value.trim();
  t.notes = document.getElementById('editTripNotes').value.trim();
  t.updatedAt = new Date().toISOString();
  const _learned = learnFromTrip(t);
  saveState();
  closeTripEdit();
  renderTrips();
  renderRecent();
  toast('הנסיעה עודכנה');
  toastLearned(_learned);
}

function deleteTripFromEdit() {
  if (!_editingTripId) return;
  state.trips = state.trips.filter(t => t.id !== _editingTripId);
  saveState();
  closeTripEdit();
  renderTrips();
  renderRecent();
  toast('נמחק');
}

// ---------- Customers ----------
function renderCustomers() {
  const grid = document.getElementById('customersGrid');
  const month = state.workingMonth;

  grid.innerHTML = state.customers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'he'))
    .map(c => {
      const monthTrips = state.trips.filter(t => t.customerId === c.id && t.date.startsWith(month));
      const sum = monthTrips.reduce((s, t) => s + (t.price || 0), 0);
      const vatAmount = c.vat ? sum * (state.defaultVat / 100) : 0;
      const linesStr = (c.lines && c.lines.length) ? c.lines.join(' · ') : '';
      return `
        <div class="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h3 class="font-semibold">${c.name}</h3>
              <span class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${c.vat ? 'badge-vat' : 'badge-no-vat'}">
                ${c.vat ? 'כולל מע״מ' : 'ללא מע״מ'}
              </span>
            </div>
            <button onclick="editCustomer('${c.id}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">ערוך</button>
          </div>
          ${c.notes ? `<p class="text-xs text-slate-500 mt-2">${c.notes}</p>` : ''}
          ${linesStr ? `<p class="text-xs text-indigo-500 mt-1">קווים: ${linesStr}</p>` : ''}
          ${(c.priceList && c.priceList.length) ? `<p class="text-xs text-emerald-600 mt-0.5">📋 מחירון: ${c.priceList.filter(p=>p.active!==false).length} מחירים</p>` : ''}
          <div class="mt-3 pt-3 border-t border-slate-100 text-sm">
            <div class="flex justify-between"><span class="text-slate-500">נסיעות החודש</span><span class="font-medium">${monthTrips.length}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">סה״כ</span><span class="font-semibold">${formatMoney(sum)}</span></div>
            ${c.vat ? `<div class="flex justify-between text-xs text-slate-400"><span>מע״מ</span><span>${formatMoney(vatAmount)}</span></div>` : ''}
          </div>
          ${(c.lines && c.lines.length) ? `<button onclick="openMatrix('${c.id}')" class="mt-3 w-full text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg transition">📊 תצוגת קווים מסודרת (כמו אקסל)</button>` : ''}
        </div>`;
    }).join('');
}

// _editingLines declared at top

function showAddCustomer() {
  state.editingCustomerId = null;
  _editingLines = [];
  _editingPriceList = [];
  _editingOrderers = [];
  document.getElementById('customerModalTitle').textContent = 'הוסף לקוח';
  document.getElementById('custName').value = '';
  document.getElementById('custVat').checked = true;
  document.getElementById('custNotes').value = '';
  document.getElementById('custRoutes').value = '';
  document.getElementById('custDeleteBtn').classList.add('hidden');
  renderCustLinesEditor();
  renderPriceListEditor();
  renderCustOrderersEditor();
  document.getElementById('customerModal').classList.remove('hidden');
  document.getElementById('customerModal').classList.add('flex');
}

function editCustomer(id) {
  const c = getCustomer(id);
  state.editingCustomerId = id;
  _editingLines = [...(c.lines || [])];
  _editingPriceList = JSON.parse(JSON.stringify(c.priceList || []));
  _editingOrderers = [...(c.orderers || [])];
  document.getElementById('customerModalTitle').textContent = 'ערוך לקוח';
  document.getElementById('custName').value = c.name;
  document.getElementById('custVat').checked = !!c.vat;
  document.getElementById('custNotes').value = c.notes || '';
  document.getElementById('custRoutes').value = (c.typicalRoutes || []).join(', ');
  document.getElementById('custDeleteBtn').classList.remove('hidden');
  renderCustLinesEditor();
  renderPriceListEditor();
  renderCustOrderersEditor();
  document.getElementById('customerModal').classList.remove('hidden');
  document.getElementById('customerModal').classList.add('flex');
}

function renderCustLinesEditor() {
  const box = document.getElementById('custLinesList');
  if (!box) return;
  if (!_editingLines.length) {
    box.innerHTML = '<p class="text-xs text-slate-400">אין קווים – הוסף למטה</p>';
    return;
  }
  box.innerHTML = _editingLines.map((line, i) => `
    <div class="flex items-center gap-2">
      <input type="text" value="${line.replace(/"/g, '&quot;')}" onchange="_editingLines[${i}]=this.value"
        class="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
      <button type="button" onclick="_editingLines.splice(${i},1);renderCustLinesEditor()"
        class="text-red-500 hover:text-red-700 text-sm px-2">✕</button>
    </div>`).join('');
}

function addCustLine() {
  const inp = document.getElementById('custNewLine');
  const v = inp.value.trim();
  if (!v) return;
  _editingLines.push(v);
  inp.value = '';
  renderCustLinesEditor();
}

function closeCustomerModal() {
  document.getElementById('customerModal').classList.add('hidden');
  document.getElementById('customerModal').classList.remove('flex');
}

function saveCustomer() {
  const name = document.getElementById('custName').value.trim();
  if (!name) {
    toast('נא למלא שם');
    return;
  }
  const vat = document.getElementById('custVat').checked;
  const notes = document.getElementById('custNotes').value.trim();
  const routesRaw = document.getElementById('custRoutes').value.trim();
  const typicalRoutes = routesRaw ? routesRaw.split(/[,،]/).map(s => s.trim()).filter(Boolean) : [];
  // sync orderers from editor inputs
  const ordInputs = document.querySelectorAll('#custOrderersList input');
  if (ordInputs.length) {
    _editingOrderers = [...ordInputs].map(i => i.value.trim()).filter(Boolean);
  }
  // sync lines from inputs
  const lineInputs = document.querySelectorAll('#custLinesList input');
  if (lineInputs.length) {
    _editingLines = [...lineInputs].map(i => i.value.trim()).filter(Boolean);
  }

  // collect price list from editor
  const priceList = collectPriceListFromEditor();

  if (state.editingCustomerId) {
    const c = state.customers.find(x => x.id === state.editingCustomerId);
    if (c) {
      c.name = name;
      c.vat = vat;
      c.notes = notes;
      c.lines = [..._editingLines];
      c.typicalRoutes = typicalRoutes;
      c.orderers = [..._editingOrderers];
      c.priceList = priceList;
    }
  } else {
    state.customers.push({
      id: 'c_' + uid(),
      name,
      vat,
      notes,
      lines: [..._editingLines],
      typicalRoutes,
      orderers: [..._editingOrderers],
      priceList
    });
  }
  saveState();
  populateCustomerSelects();
  closeCustomerModal();
  renderCustomers();
  onCustomerChange();
  toast('נשמר');
}

function deleteCustomer() {
  if (!state.editingCustomerId) return;
  const c = getCustomer(state.editingCustomerId);
  const count = state.trips.filter(t => t.customerId === state.editingCustomerId).length;
  if (!confirm(`למחוק את הלקוח "${c.name}"?${count ? '\nיש ' + count + ' נסיעות משויכות (לא יימחקו, רק השיוך).' : ''}`)) return;
  state.customers = state.customers.filter(x => x.id !== state.editingCustomerId);
  saveState();
  populateCustomerSelects();
  closeCustomerModal();
  renderCustomers();
  toast('לקוח נמחק');
}

// ---------- Export ----------
function renderExportList() {
  const box = document.getElementById('exportCustomerList');
  const month = document.getElementById('exportMonth').value || state.workingMonth;
  box.innerHTML = state.customers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, 'he'))
    .map(c => {
      const count = state.trips.filter(t => t.customerId === c.id && t.date.startsWith(month)).length;
      return `
        <label class="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-lg cursor-pointer">
          <input type="checkbox" class="export-cust rounded" value="${c.id}" ${count ? 'checked' : ''} />
          <span class="flex-1 text-sm">${c.name}</span>
          <span class="text-xs text-slate-400">${count} נסיעות</span>
        </label>`;
    }).join('');
}

function selectAllCustomers(on) {
  document.querySelectorAll('.export-cust').forEach(cb => { cb.checked = on; });
}

function doExport() {
  const month = document.getElementById('exportMonth').value || state.workingMonth;
  const separate = document.getElementById('exportSeparate').checked;
  const selected = [...document.querySelectorAll('.export-cust:checked')].map(cb => cb.value);

  if (!selected.length) {
    toast('בחר לפחות לקוח אחד');
    return;
  }

  const [year, mon] = month.split('-');
  const monthLabel = `${mon}-${year}`;

  if (separate) {
    selected.forEach(cid => {
      const c = getCustomer(cid);
      // Multi-line customers → Excel-like matrix sheets per line
      if (c.lines && c.lines.length) {
        exportCustomerExcelLike(cid, month);
      } else {
        const trips = state.trips
          .filter(t => t.customerId === cid && t.date.startsWith(month))
          .sort((a, b) => a.date.localeCompare(b.date));
        if (!trips.length) return;
        downloadCustomerExcel(c, trips, monthLabel);
      }
    });
    toast(`יורדים ${selected.length} קבצים...`);
  } else {
    // Single combined workbook
    const wb = XLSX.utils.book_new();
    selected.forEach(cid => {
      const c = getCustomer(cid);
      const trips = state.trips
        .filter(t => t.customerId === cid && t.date.startsWith(month))
        .sort((a, b) => a.date.localeCompare(b.date));
      if (!trips.length) return;

      // Multi-line customer (like פרח): one sheet per line
      if (c.lines && c.lines.length) {
        const byLine = {};
        trips.forEach(t => {
          const key = t.line || 'כללי';
          if (!byLine[key]) byLine[key] = [];
          byLine[key].push(t);
        });
        Object.entries(byLine).forEach(([lineName, lineTrips]) => {
          const ws = buildSheet(c, lineTrips);
          const safe = (c.name + '-' + lineName).replace(/[\\\/\?\*\[\]]/g, '').slice(0, 28);
          XLSX.utils.book_append_sheet(wb, ws, safe || 'קו');
        });
      } else {
        const ws = buildSheet(c, trips);
        const safeName = c.name.replace(/[\\\/\?\*\[\]]/g, '').slice(0, 28);
        XLSX.utils.book_append_sheet(wb, ws, safeName || 'לקוח');
      }
    });
    // Summary sheet
    const summary = buildSummarySheet(selected, month);
    XLSX.utils.book_append_sheet(wb, summary, 'סהכ');
    XLSX.writeFile(wb, `סיכום_נסיעות_${monthLabel}.xlsx`);
    toast('הקובץ ירד');
  }
}

function buildSheet(customer, trips) {
  const hasLines = trips.some(t => t.line);
  const rows = hasLines
    ? [['תאריך', 'קו', 'מסלול / תיאור', 'מחיר', 'הערות', 'מזמין']]
    : [['תאריך', 'מסלול / תיאור', 'מחיר', 'הערות', 'מזמין']];
  trips.forEach(t => {
    if (hasLines) {
      rows.push([
        formatDate(t.date),
        t.line || '',
        t.route || '',
        t.price || 0,
        t.notes || '',
        t.driver || ''
      ]);
    } else {
      rows.push([
        formatDate(t.date),
        t.route || '',
        t.price || 0,
        t.notes || '',
        t.driver || ''
      ]);
    }
  });

  const total = trips.reduce((s, t) => s + (t.price || 0), 0);
  rows.push([]);
  if (hasLines) {
    rows.push(['סה״כ לפני מע״מ', '', '', total, '', '']);
    if (customer.vat) {
      const vat = Math.round(total * (state.defaultVat / 100) * 100) / 100;
      rows.push(['מע״מ ' + state.defaultVat + '%', '', '', vat, '', '']);
      rows.push(['סה״כ כולל מע״מ', '', '', total + vat, '', '']);
    } else {
      rows.push(['ללא מע״מ', '', '', '', '', '']);
      rows.push(['סה״כ לתשלום', '', '', total, '', '']);
    }
  } else {
    rows.push(['סה״כ לפני מע״מ', '', total, '', '']);
    if (customer.vat) {
      const vat = Math.round(total * (state.defaultVat / 100) * 100) / 100;
      rows.push(['מע״מ ' + state.defaultVat + '%', '', vat, '', '']);
      rows.push(['סה״כ כולל מע״מ', '', total + vat, '', '']);
    } else {
      rows.push(['ללא מע״מ', '', '', '', '']);
      rows.push(['סה״כ לתשלום', '', total, '', '']);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = hasLines
    ? [{ wch: 12 }, { wch: 16 }, { wch: 28 }, { wch: 12 }, { wch: 22 }, { wch: 14 }]
    : [{ wch: 12 }, { wch: 28 }, { wch: 12 }, { wch: 22 }, { wch: 14 }];
  return ws;
}

function buildSummarySheet(customerIds, month) {
  const rows = [
    ['לקוח', 'מספר נסיעות', 'סה״כ לפני מע״מ', 'מע״מ', 'סה״כ כולל', 'חייב במע״מ']
  ];
  let grandBefore = 0, grandVat = 0;

  customerIds.forEach(cid => {
    const c = getCustomer(cid);
    const trips = state.trips.filter(t => t.customerId === cid && t.date.startsWith(month));
    const sum = trips.reduce((s, t) => s + (t.price || 0), 0);
    const vat = c.vat ? Math.round(sum * (state.defaultVat / 100) * 100) / 100 : 0;
    grandBefore += sum;
    grandVat += vat;
    rows.push([
      c.name,
      trips.length,
      sum,
      vat,
      sum + vat,
      c.vat ? 'כן' : 'לא'
    ]);
  });
  rows.push([]);
  rows.push(['סה״כ כללי', '', grandBefore, grandVat, grandBefore + grandVat, '']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 12 }];
  return ws;
}

function downloadCustomerExcel(customer, trips, monthLabel) {
  const wb = XLSX.utils.book_new();

  // Multi-line customer → one sheet per line (like פרח)
  if (customer.lines && customer.lines.length) {
    const byLine = {};
    trips.forEach(t => {
      const key = t.line || 'כללי';
      if (!byLine[key]) byLine[key] = [];
      byLine[key].push(t);
    });
    Object.entries(byLine).forEach(([lineName, lineTrips]) => {
      const ws = buildSheet(customer, lineTrips);
      const safe = lineName.replace(/[\\\/\?\*\[\]]/g, '').slice(0, 28);
      XLSX.utils.book_append_sheet(wb, ws, safe || 'קו');
    });
    // Summary within the file
    const sumWs = buildSheet(customer, trips);
    XLSX.utils.book_append_sheet(wb, sumWs, 'סהכ');
  } else {
    const ws = buildSheet(customer, trips);
    XLSX.utils.book_append_sheet(wb, ws, 'נסיעות');
  }

  const safe = customer.name.replace(/[\\\/\?\*\[\]]/g, '').slice(0, 40);
  XLSX.writeFile(wb, `${safe}_${monthLabel}.xlsx`);
}


// ---------- Settings / Backup ----------
function setWorkingMonth() {
  const val = document.getElementById('workingMonth').value || currentMonthStr();
  changeWorkingMonth(val);
}

function updateMonthLabel() {
  const el = document.getElementById('headerMonth');
  if (el) el.value = state.workingMonth;
  // also sync settings + filters if present
  const wm = document.getElementById('workingMonth');
  if (wm) wm.value = state.workingMonth;
  const fm = document.getElementById('filterMonth');
  if (fm && !fm.value) fm.value = state.workingMonth;
  const em = document.getElementById('exportMonth');
  if (em && !em.value) em.value = state.workingMonth;
}

function changeWorkingMonth(val) {
  if (!val) return;
  state.workingMonth = val;
  saveState();
  updateMonthLabel();
  // sync filter and export month pickers
  const fm = document.getElementById('filterMonth');
  if (fm) fm.value = val;
  const em = document.getElementById('exportMonth');
  if (em) em.value = val;
  const wm = document.getElementById('workingMonth');
  if (wm) wm.value = val;
  // refresh relevant views
  renderRecent();
  if (!document.getElementById('tab-trips').classList.contains('hidden')) renderTrips();
  if (!document.getElementById('tab-customers').classList.contains('hidden')) renderCustomers();
  calClearDays();
  renderDayCalendar();
  toast('חודש העבודה: ' + val);
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `backup_trips_${state.workingMonth}.json`;
  a.click();
  toast('גיבוי ירד');
}

function importBackup(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.trips && data.customers) {
        state.customers = data.customers;
        state.trips = data.trips;
        state.workingMonth = data.workingMonth || currentMonthStr();
        state.defaultVat = data.defaultVat ?? 18;
        saveState();
        initUI();
        toast('הגיבוי שוחזר בהצלחה');
      } else {
        toast('קובץ לא תקין');
      }
    } catch {
      toast('שגיאה בקריאת הקובץ');
    }
  };
  reader.readAsText(file);
}


// ---------- Drivers ----------
function renderDrivers() {
  const grid = document.getElementById('driversGrid');
  if (!grid) return;
  if (!state.drivers.length) {
    grid.innerHTML = '<p class="text-slate-400 text-sm col-span-full">אין מזמינים עדיין – הוסף מזמין</p>';
    return;
  }
  grid.innerHTML = state.drivers
    .slice()
    .sort((a, b) => (b.favorite - a.favorite) || a.name.localeCompare(b.name, 'he'))
    .map(d => {
      const cust = d.customerId ? getCustomer(d.customerId).name : 'כללי';
      return `
        <div class="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2 ${d.favorite ? 'bg-amber-50 border-amber-200' : ''}">
          <div class="min-w-0">
            <div class="font-medium truncate">${d.favorite ? '⭐ ' : ''}${d.name}</div>
            <div class="text-xs text-slate-500">${d.phone || 'ללא טלפון'} · ${cust}</div>
          </div>
          <button onclick="editDriver('${d.id}')" class="text-blue-600 text-sm shrink-0">ערוך</button>
        </div>`;
    }).join('');
}

function showAddDriver() {
  state.editingDriverId = null;
  document.getElementById('driverModalTitle').textContent = 'הוסף מזמין';
  document.getElementById('drvName').value = '';
  document.getElementById('drvPhone').value = '';
  document.getElementById('drvFavorite').checked = true;
  document.getElementById('drvDeleteBtn').classList.add('hidden');
  populateDrvCustomerSelect();
  document.getElementById('drvCustomer').value = '';
  document.getElementById('driverModal').classList.remove('hidden');
  document.getElementById('driverModal').classList.add('flex');
}

function editDriver(id) {
  const d = state.drivers.find(x => x.id === id);
  if (!d) return;
  state.editingDriverId = id;
  document.getElementById('driverModalTitle').textContent = 'ערוך מזמין';
  document.getElementById('drvName').value = d.name;
  document.getElementById('drvPhone').value = d.phone || '';
  document.getElementById('drvFavorite').checked = !!d.favorite;
  document.getElementById('drvDeleteBtn').classList.remove('hidden');
  populateDrvCustomerSelect();
  document.getElementById('drvCustomer').value = d.customerId || '';
  document.getElementById('driverModal').classList.remove('hidden');
  document.getElementById('driverModal').classList.add('flex');
}

function populateDrvCustomerSelect() {
  const el = document.getElementById('drvCustomer');
  if (!el) return;
  el.innerHTML = '<option value="">— כללי —</option>';
  state.customers.slice().sort((a,b) => a.name.localeCompare(b.name, 'he')).forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    el.appendChild(opt);
  });
}

function closeDriverModal() {
  document.getElementById('driverModal').classList.add('hidden');
  document.getElementById('driverModal').classList.remove('flex');
}

function saveDriver() {
  const name = document.getElementById('drvName').value.trim();
  if (!name) { toast('נא למלא שם'); return; }
  const phone = document.getElementById('drvPhone').value.trim();
  const customerId = document.getElementById('drvCustomer').value || '';
  const favorite = document.getElementById('drvFavorite').checked;

  if (state.editingDriverId) {
    const d = state.drivers.find(x => x.id === state.editingDriverId);
    if (d) {
      d.name = name; d.phone = phone; d.customerId = customerId; d.favorite = favorite;
    }
  } else {
    state.drivers.push({ id: 'd_' + uid(), name, phone, customerId, favorite });
  }
  saveState();
  closeDriverModal();
  renderDrivers();
  renderDriverFavorites();
  toast('נשמר');
}

function deleteDriver() {
  if (!state.editingDriverId) return;
  if (!confirm('למחוק מזמין זה?')) return;
  state.drivers = state.drivers.filter(x => x.id !== state.editingDriverId);
  saveState();
  closeDriverModal();
  renderDrivers();
  renderDriverFavorites();
  toast('נמחק');
}

function renderDriverFavorites(customerId) {
  const box = document.getElementById('driverFavorites');
  const list = document.getElementById('driverList');
  if (!box) return;

  const cid = customerId || document.getElementById('formCustomer')?.value;
  const favs = state.drivers.filter(d =>
    d.favorite && (!d.customerId || d.customerId === cid)
  );

  box.innerHTML = '';
  favs.forEach(d => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 transition';
    btn.textContent = '⭐ ' + d.name;
    btn.onclick = () => { document.getElementById('formDriver').value = d.name; };
    box.appendChild(btn);
  });

  if (list) {
    list.innerHTML = state.drivers.map(d =>
      `<option value="${d.name}">${d.phone || ''}</option>`
    ).join('');
  }
  renderOrdererChips(cid);
  refreshOrdererSuggestions();
}

function getCustomerOrderers(cid) {
  const c = getCustomer(cid);
  if (!c) return [];
  const set = new Set();
  (c.orderers || []).forEach(o => { if (o && String(o).trim()) set.add(String(o).trim()); });
  // from trips
  state.trips.filter(t => t.customerId === cid && t.driver).forEach(t => set.add(t.driver.trim()));
  // from drivers linked to customer
  state.drivers.filter(d => d.customerId === cid || !d.customerId).forEach(d => set.add(d.name));
  return [...set];
}

function renderOrdererChips(cid) {
  const box = document.getElementById('ordererChips');
  if (!box) return;
  cid = cid || document.getElementById('formCustomer')?.value;
  const c = getCustomer(cid);
  box.innerHTML = '';
  if (!c) return;

  // Rank orderers: explicit list first, then by frequency in trips
  const freq = {};
  state.trips.filter(t => t.customerId === cid && t.driver).forEach(t => {
    freq[t.driver] = (freq[t.driver] || 0) + 1;
  });
  const list = getCustomerOrderers(cid);
  list.sort((a, b) => (freq[b] || 0) - (freq[a] || 0));

  if (!list.length) {
    box.innerHTML = '<span class="text-xs text-slate-400">אין מזמינים – הוסף בניהול מזמינים</span>';
    return;
  }

  const top = list.slice(0, 12);
  top.forEach(name => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'text-xs bg-violet-50 hover:bg-violet-100 text-violet-900 px-2.5 py-1 rounded-lg border border-violet-200 transition';
    const n = freq[name] || 0;
    btn.textContent = n ? `${name} (${n})` : name;
    btn.title = 'בחר מזמין';
    btn.onclick = () => {
      document.getElementById('formDriver').value = name;
      const sug = document.getElementById('ordererSuggestBox');
      if (sug) sug.classList.add('hidden');
    };
    box.appendChild(btn);
  });
}

function suggestOrdererForRoute(cid, route) {
  const c = getCustomer(cid);
  if (!c || !route) return null;
  const r = route.trim().toLowerCase();

  // 1. explicit ordererByRoute map
  if (c.ordererByRoute) {
    for (const [key, ord] of Object.entries(c.ordererByRoute)) {
      if (r === key.toLowerCase() || r.includes(key.toLowerCase()) || key.toLowerCase().includes(r)) {
        return ord;
      }
    }
  }

  // 2. history: most common orderer for similar route
  const counts = {};
  state.trips.filter(t => t.customerId === cid && t.driver && t.route).forEach(t => {
    const tr = (t.route || '').toLowerCase();
    if (tr === r || tr.includes(r) || r.includes(tr)) {
      counts[t.driver] = (counts[t.driver] || 0) + 1;
    }
  });
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (best) return best[0];
  return null;
}

function applyOrdererSuggestion() {
  const cid = document.getElementById('formCustomer')?.value;
  const route = document.getElementById('formRoute')?.value || '';
  const sugBox = document.getElementById('ordererSuggestBox');
  const drv = document.getElementById('formDriver');
  if (!cid || !route) {
    if (sugBox) sugBox.classList.add('hidden');
    return;
  }
  const suggested = suggestOrdererForRoute(cid, route);
  if (!suggested) {
    if (sugBox) sugBox.classList.add('hidden');
    return;
  }
  // auto-fill if empty
  if (drv && !drv.value.trim()) {
    drv.value = suggested;
  }
  if (sugBox) {
    sugBox.classList.remove('hidden');
    sugBox.innerHTML = `מזמין מומלץ למסלול: <b>${suggested}</b>
      <button type="button" class="underline mr-2" onclick="document.getElementById('formDriver').value='${suggested.replace(/'/g, "\'")}'">החל</button>`;
  }
}

function onOrdererInput() {
  // no-op placeholder for future filter
}

function openOrderersManager() {
  const cid = document.getElementById('formCustomer')?.value || state.editingCustomerId;
  if (!cid) { toast('בחר לקוח קודם'); return; }
  const c = getCustomer(cid);
  if (!c) return;
  if (!c.orderers) c.orderers = [];
  window._orderersMgrCid = cid;
  document.getElementById('orderersModalCust').textContent = c.name;
  renderOrderersManagerList();
  const m = document.getElementById('orderersModal');
  m.classList.remove('hidden');
  m.classList.add('flex');
  document.getElementById('newOrdererName')?.focus();
}

function closeOrderersManager() {
  const m = document.getElementById('orderersModal');
  m.classList.add('hidden');
  m.classList.remove('flex');
  renderOrdererChips(window._orderersMgrCid);
  refreshOrdererSuggestions();
}

function renderOrderersManagerList() {
  const box = document.getElementById('orderersManagerList');
  const c = getCustomer(window._orderersMgrCid);
  if (!box || !c) return;
  const list = c.orderers || [];
  if (!list.length) {
    box.innerHTML = '<p class="text-sm text-slate-400">אין מזמינים עדיין</p>';
    return;
  }
  box.innerHTML = list.map((name, i) => `
    <div class="flex items-center gap-2">
      <input type="text" value="${escAttr(name)}" onchange="updateOrdererAt(${i}, this.value)"
        class="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
      <button type="button" onclick="removeOrdererAt(${i})" class="text-red-500 hover:text-red-700 px-2">✕</button>
    </div>`).join('');
}

function updateOrdererAt(i, val) {
  const c = getCustomer(window._orderersMgrCid);
  if (!c || !c.orderers) return;
  c.orderers[i] = val.trim();
  saveState();
}

function removeOrdererAt(i) {
  const c = getCustomer(window._orderersMgrCid);
  if (!c || !c.orderers) return;
  c.orderers.splice(i, 1);
  saveState();
  renderOrderersManagerList();
}

function addOrdererFromManager() {
  const inp = document.getElementById('newOrdererName');
  const val = (inp?.value || '').trim();
  if (!val) return;
  const c = getCustomer(window._orderersMgrCid);
  if (!c) return;
  if (!c.orderers) c.orderers = [];
  if (c.orderers.includes(val)) { toast('כבר קיים'); return; }
  c.orderers.push(val);
  saveState();
  inp.value = '';
  renderOrderersManagerList();
  toast('מזמין נוסף');
}

// Customer modal orderers editor
let _editingOrderers = [];

function renderCustOrderersEditor() {
  const box = document.getElementById('custOrderersList');
  if (!box) return;
  if (!_editingOrderers.length) {
    box.innerHTML = '<p class="text-xs text-slate-400">אין מזמינים</p>';
    return;
  }
  box.innerHTML = _editingOrderers.map((name, i) => `
    <div class="flex items-center gap-2">
      <input type="text" value="${escAttr(name)}" onchange="_editingOrderers[${i}]=this.value"
        class="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm" />
      <button type="button" onclick="_editingOrderers.splice(${i},1);renderCustOrderersEditor()" class="text-red-500 px-2">✕</button>
    </div>`).join('');
}

function addCustOrderer() {
  const inp = document.getElementById('custNewOrderer');
  const v = (inp?.value || '').trim();
  if (!v) return;
  _editingOrderers.push(v);
  inp.value = '';
  renderCustOrderersEditor();
}


// ---------- WhatsApp TXT Import ----------
function parseWhatsAppFile() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  if (!file) { toast('בחר קובץ'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    let text = e.target.result;
    // Handle possible UTF-8 BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);

    const messages = parseWhatsAppTxt(text);
    // Filter messages that look like trip reports (have price or route keywords)
    const tripLike = messages.filter(m => looksLikeTrip(m.body));

    state.importPending = tripLike.map(m => {
      const parsed = extractTripFromText(m.body, m.date);
      return {
        selected: true,
        date: parsed.date || m.date || '',
        price: parsed.price || 0,
        route: parsed.route || '',
        notes: parsed.notes || '',
        raw: m.body,
        sender: m.sender || ''
      };
    });

    renderImportResults();
    toast(`נמצאו ${tripLike.length} הודעות שנראות כנסיעות (מתוך ${messages.length})`);
  };
  reader.readAsText(file, 'UTF-8');
}

function parseWhatsAppTxt(text) {
  // WhatsApp export formats (Android / iOS):
  // [DD/MM/YYYY, HH:MM:SS] Sender: message
  // DD/MM/YYYY, HH:MM - Sender: message
  // ‏[DD.MM.YYYY, HH:MM:SS] Sender: message
  const lines = text.split(/\r?\n/);
  const messages = [];
  const headerRe = /^[^\d]*(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]?\s*([^:]+):\s*(.*)$/;
  const headerRe2 = /^\[(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/;

  let current = null;
  for (const line of lines) {
    let m = line.match(headerRe2) || line.match(headerRe);
    if (m) {
      if (current) messages.push(current);
      let day = m[1].padStart(2, '0');
      let month = m[2].padStart(2, '0');
      let year = m[3].length === 2 ? '20' + m[3] : m[3];
      if (parseInt(month) > 12) { [day, month] = [month, day]; }
      current = {
        date: `${year}-${month}-${day}`,
        time: m[4],
        sender: m[5].trim(),
        body: (m[6] || '').trim()
      };
    } else if (current && line.trim()) {
      current.body += '\n' + line.trim();
    }
  }
  if (current) messages.push(current);
  return messages;
}

function looksLikeTrip(body) {
  if (!body || body.length < 3) return false;
  // Has a price-like number
  if (/\b([1-9]\d{2,3})\b/.test(body)) return true;
  // Has route keywords
  const keys = ['בב', 'ים', 'ספר', 'נתניה', 'אשדוד', 'שמש', 'טלז', 'אלעד', 'חולון', 'פת', 'עטרות', 'הלוך', 'חזור', 'פנימי'];
  if (keys.some(k => body.includes(k))) return true;
  return false;
}

function extractTripFromText(text, fallbackDate) {
  let date = fallbackDate || '';
  let price = null;
  let route = '';
  let notes = '';

  const dateM = text.match(/(\d{1,2})[\/\.](\d{1,2})(?:[\/\.](\d{2,4}))?/);
  if (dateM) {
    let day = dateM[1].padStart(2, '0');
    let month = dateM[2].padStart(2, '0');
    let year = dateM[3] ? (dateM[3].length === 2 ? '20' + dateM[3] : dateM[3]) : (state.workingMonth || '').slice(0, 4);
    if (parseInt(month) > 12) [day, month] = [month, day];
    date = `${year}-${month}-${day}`;
  }

  const priceM = text.match(/(?:₪|ש"ח|שח|מחיר)?[:\s]*(\d{2,4})\b/);
  if (priceM) {
    const n = parseInt(priceM[1], 10);
    if (n >= 40 && n <= 5000) price = n;
  }
  // fallback: any standalone 3-4 digit
  if (!price) {
    const all = [...text.matchAll(/\b(\d{3,4})\b/g)];
    for (const m of all) {
      const n = parseInt(m[1], 10);
      if (n >= 50 && n <= 3000) { price = n; break; }
    }
  }

  for (const r of COMMON_ROUTES) {
    if (text.includes(r)) { route = r; break; }
  }
  if (!route) {
    // take non-numeric short phrase
    const parts = text.split(/[\n,]+/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 40 && !/^\d+$/.test(s));
    if (parts.length) route = parts[0].replace(/\d{3,4}/g, '').trim();
  }

  const noteKw = ['ספיישל', 'ספרינטר', 'המתנה', 'קאפ', 'מיניבוס', 'סיינה', 'פנימי', 'הלוך', 'חזור', 'תחנות', 'אמין'];
  notes = noteKw.filter(k => text.includes(k)).join(', ');

  return { date, price, route, notes };
}

function renderImportResults() {
  const box = document.getElementById('importResults');
  const list = document.getElementById('importList');
  if (!state.importPending.length) {
    box.classList.add('hidden');
    return;
  }
  box.classList.remove('hidden');
  const defaultCust = document.getElementById('importCustomer').value;

  list.innerHTML = state.importPending.map((item, i) => `
    <div class="border border-slate-200 rounded-xl p-3 ${item.selected ? 'bg-green-50 border-green-200' : 'bg-slate-50 opacity-60'}">
      <div class="flex items-start gap-3">
        <input type="checkbox" ${item.selected ? 'checked' : ''} onchange="state.importPending[${i}].selected=this.checked"
          class="mt-1 rounded" />
        <div class="flex-1 min-w-0 space-y-1">
          <div class="text-xs text-slate-400 truncate">${item.raw.slice(0, 120)}${item.raw.length > 120 ? '…' : ''}</div>
          <div class="flex flex-wrap gap-2 items-center">
            <input type="date" value="${item.date || ''}" onchange="state.importPending[${i}].date=this.value"
              class="border border-slate-200 rounded-lg px-2 py-1 text-xs" />
            <input type="number" value="${item.price || ''}" placeholder="מחיר" onchange="state.importPending[${i}].price=+this.value"
              class="border border-slate-200 rounded-lg px-2 py-1 text-xs w-20" />
            <input type="text" value="${(item.route || '').replace(/"/g, '&quot;')}" placeholder="מסלול" onchange="state.importPending[${i}].route=this.value"
              class="border border-slate-200 rounded-lg px-2 py-1 text-xs flex-1 min-w-[100px]" />
            <input type="text" value="${(item.notes || '').replace(/"/g, '&quot;')}" placeholder="הערות" onchange="state.importPending[${i}].notes=this.value"
              class="border border-slate-200 rounded-lg px-2 py-1 text-xs w-28" />
          </div>
        </div>
      </div>
    </div>`).join('');
}

function importSelectedTrips() {
  const custId = document.getElementById('importCustomer').value;
  if (!custId) {
    toast('נא לבחור לקוח לייבוא');
    return;
  }
  const selected = state.importPending.filter(x => x.selected);
  if (!selected.length) {
    toast('לא נבחרו הודעות');
    return;
  }
  let added = 0;
  selected.forEach(item => {
    if (!item.date && !item.price && !item.route) return;
    state.trips.unshift({
      id: uid(),
      customerId: custId,
      line: '',
      date: item.date || (state.workingMonth + '-01'),
      price: item.price || 0,
      route: item.route || '',
      notes: item.notes || '',
      driver: item.sender || '',
      createdAt: new Date().toISOString()
    });
    added++;
  });
  saveState();
  state.importPending = [];
  document.getElementById('importResults').classList.add('hidden');
  renderRecent();
  toast(`יובאו ${added} נסיעות`);
  showTab('trips');
}


// ---------- Init ----------
function initUI() {
  populateCustomerSelects();
  updateMonthLabel();
  const _fm = document.getElementById('filterMonth'); if (_fm) _fm.value = state.workingMonth;
  const _em = document.getElementById('exportMonth'); if (_em) _em.value = state.workingMonth;
  const _fd = document.getElementById('formDate'); if (_fd) _fd.value = new Date().toISOString().slice(0, 10);
  renderRecent();
  renderRouteSuggestions('');
  renderDriverFavorites();
  // Migrate old customers missing lines/typicalRoutes
  let migrated = false;
  state.customers.forEach(c => {
    const def = DEFAULT_CUSTOMERS.find(d => d.id === c.id);
    if (def) {
      if (!c.lines || !c.lines.length) { c.lines = def.lines || []; migrated = true; }
      if (!c.typicalRoutes || !c.typicalRoutes.length) { c.typicalRoutes = def.typicalRoutes || []; migrated = true; }
      else if (def.typicalRoutes && def.typicalRoutes.length) {
        const set = new Set(c.typicalRoutes);
        def.typicalRoutes.forEach(r => { if (!set.has(r)) { c.typicalRoutes.push(r); migrated = true; } });
      }
      if (!c.orderers && def.orderers) { c.orderers = [...def.orderers]; migrated = true; }
      else if (def.orderers && def.orderers.length) {
        if (!c.orderers) c.orderers = [];
        const set = new Set(c.orderers);
        def.orderers.forEach(r => { if (!set.has(r)) { c.orderers.push(r); migrated = true; } });
      }
      if (def.ordererByRoute && !c.ordererByRoute) { c.ordererByRoute = {...def.ordererByRoute}; migrated = true; }
      else if (def.ordererByRoute) {
        if (!c.ordererByRoute) c.ordererByRoute = {};
        Object.entries(def.ordererByRoute).forEach(([k,v]) => {
          if (!c.ordererByRoute[k]) { c.ordererByRoute[k] = v; migrated = true; }
        });
      }
      if (!c.priceList || !c.priceList.length) {
        if (def.priceList && def.priceList.length) { c.priceList = JSON.parse(JSON.stringify(def.priceList)); migrated = true; }
        else c.priceList = [];
      }
    } else {
      if (!c.lines) c.lines = [];
      if (!c.typicalRoutes) c.typicalRoutes = [];
      if (!c.priceList) c.priceList = [];
    }
  });
  if (!state.drivers || !state.drivers.length) {
    state.drivers = [...DEFAULT_DRIVERS];
    migrated = true;
  }
    refreshPlaceList();
  seedMissingPriceLists();
  try { seedAllExcelPrices(false); } catch (_e) { console.warn(_e); }
  renderDayCalendar();
  updateGeminiStatus();
  try { scrubAiAutoNotes(); } catch(_e) {}
  if (migrated) saveState();
}

function cloudSetAuthMsg(msg, ok = false) {
  const el = document.getElementById('cloudAuthMsg');
  if (!el) return;
  el.textContent = msg || '';
  el.className = 'text-center text-xs mt-4 min-h-5 ' + (ok ? 'text-emerald-600' : 'text-slate-500');
}
async function cloudLogin() {
  const email = (document.getElementById('cloudEmail')?.value || '').trim();
  const password = document.getElementById('cloudPassword')?.value || '';
  if (!email || !password) return cloudSetAuthMsg('נא להזין אימייל וסיסמה');
  cloudSetAuthMsg('מתחבר…');
  try {
    await CloudSync.signIn(email, password);
    cloudSetAuthMsg('התחברת בהצלחה', true);
  } catch (e) {
    cloudSetAuthMsg('שגיאת כניסה: ' + (e.message || e));
  }
}
async function cloudSignup() {
  const email = (document.getElementById('cloudEmail')?.value || '').trim();
  const password = document.getElementById('cloudPassword')?.value || '';
  if (!email || password.length < 6) return cloudSetAuthMsg('נא להזין אימייל וסיסמה של 6 תווים לפחות');
  cloudSetAuthMsg('יוצר חשבון…');
  try {
    const data = await CloudSync.signUp(email, password);
    if (data?.session) cloudSetAuthMsg('החשבון נוצר והתחברת', true);
    else cloudSetAuthMsg('החשבון נוצר. אם מופעל אימות אימייל, יש לאשר את האימייל ואז להתחבר.', true);
  } catch (e) {
    cloudSetAuthMsg('שגיאת יצירת חשבון: ' + (e.message || e));
  }
}
async function cloudLogout() {
  try { await CloudSync.signOut(); } catch (e) { cloudSetAuthMsg('שגיאת יציאה: ' + (e.message || e)); }
}
async function cloudForceSave() {
  try {
    await CloudSync.saveNow(getPersistedState());
    toast('☁️ כל הנתונים נשמרו בענן');
  } catch (e) {
    toast('⚠️ שמירה נכשלה: ' + (e.message || e), 5000);
  }
}
function updateCloudHeader() {
  const user = CloudSync?.currentUser;
  const email = document.getElementById('cloudHeaderEmail');
  const status = document.getElementById('cloudSettingsStatus');
  if (email) email.textContent = user?.email || 'ענן מחובר';
  if (status) {
    status.textContent = user ? 'מחובר ומסונכרן' : 'לא מחובר';
    status.className = 'text-xs px-2.5 py-1 rounded-full ' + (user ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700');
  }
}
window.DEFAULT_CUSTOMERS = DEFAULT_CUSTOMERS;
window.DEFAULT_DRIVERS = DEFAULT_DRIVERS;

async function bootCloudApp() {
  try {
    loadState();
    if (!window.CloudSync) throw new Error('CloudSync לא נטען');
    const result = await window.CloudSync.init({
      onState: (data, source) => {
        if (!data) return;
        applyCloudState(data);
        if (document.body.dataset.cloudReady === 'true') {
          initUI();
          if (source === 'realtime') toast('☁️ הנתונים עודכנו ממכשיר אחר');
        }
      },
      onAuth: (user) => {
        window.CloudSync.currentUser = user || null;
        const login = document.getElementById('cloudLogin');
        if (user) {
          if (login) login.classList.add('hidden');
          document.body.dataset.cloudReady = 'true';
          initUI();
          showTab('quick');
          if (typeof updateCloudHeader === 'function') updateCloudHeader();
        } else {
          if (login) login.classList.remove('hidden');
          document.body.dataset.cloudReady = 'false';
        }
      }
    });
    if (result?.state) {
      applyCloudState(result.state);
      document.body.dataset.cloudReady = 'true';
      initUI();
      showTab('quick');
    }
  } catch (bootErr) {
    console.error('Boot error', bootErr);
    const err = document.getElementById('cloudBootError');
    if (err) {
      err.textContent = 'שגיאת חיבור לענן: ' + (bootErr.message || bootErr);
      err.classList.remove('hidden');
    }
  }
}
window.addEventListener('load', bootCloudApp);

// Save default VAT on change
document.getElementById('defaultVat')?.addEventListener('change', e => {
  state.defaultVat = parseFloat(e.target.value) || 18;
  saveState();
});



// ============================================================
// Matrix view – Excel-accurate per-line sheets with editing
// ============================================================
// _matrixCustomerId at top

function getLineSchema(customerId, lineName) {
  const c = getCustomer(customerId);
  // customer-specific schemas
  if (c.lineSchemas && c.lineSchemas[lineName]) return c.lineSchemas[lineName];
  // defaults by customer id
  const defs = DEFAULT_LINE_SCHEMAS[customerId];
  if (defs && defs[lineName]) return defs[lineName];
  // fuzzy match line name
  if (defs) {
    const ln = (lineName || '').trim();
    const key = Object.keys(defs).find(k => {
      const kt = k.trim();
      return kt === ln || ln.includes(kt) || kt.includes(ln);
    });
    if (key) return defs[key];
  }
  // discover from existing trips
  const cols = new Set();
  state.trips.filter(t => t.customerId === customerId && t.line === lineName).forEach(t => {
    if (t.columnKey) cols.add(t.columnKey);
  });
  if (cols.size) return Array.from(cols);
  // fallback single price column
  return ['מחיר'];
}

function openMatrix(customerId) {
  _matrixCustomerId = customerId;
  const c = getCustomer(customerId);
  if (!c) return;
  document.getElementById('matrixTitle').textContent = `📊 ${c.name} – תצוגת קווים (כמו אקסל)`;
  const sel = document.getElementById('matrixLineSelect');
  sel.innerHTML = '';
  const lines = (c.lines || []).filter(l => l && !/סה.?כ|סיכום/.test(l));
  lines.forEach(line => {
    const o = document.createElement('option');
    o.value = line;
    o.textContent = line;
    sel.appendChild(o);
  });
  if (!lines.length) {
    const o = document.createElement('option');
    o.value = ''; o.textContent = '— אין קווים —';
    sel.appendChild(o);
  }
  document.getElementById('matrixModal').classList.remove('hidden');
  document.getElementById('matrixModal').classList.add('flex');
  renderMatrixBody();
}

function closeMatrix() {
  document.getElementById('matrixModal').classList.add('hidden');
  document.getElementById('matrixModal').classList.remove('flex');
}

function renderMatrixBody() {
  const c = getCustomer(_matrixCustomerId);
  if (!c) return;
  const line = document.getElementById('matrixLineSelect').value;
  const month = state.workingMonth;
  const body = document.getElementById('matrixBody');
  const columns = getLineSchema(c.id, line);

  if (!columns.length) {
    // free-form list for lines without fixed columns (e.g. פתקי פרח)
    const trips = state.trips.filter(t => t.customerId === c.id && t.date && t.date.startsWith(month) &&
      (!line || t.line === line || (t.route||'').includes(line)));
    let html = `<div class="mb-2 flex gap-2 items-center">
      <span class="text-sm font-medium">קו: ${line || 'כללי'} (רשימה חופשית)</span>
      <button onclick="matrixAddFreeTrip()" class="text-xs bg-green-600 text-white px-2 py-1 rounded-lg">+ הוסף שורה</button>
    </div>
    <table class="min-w-full border-collapse text-xs">
      <thead><tr class="bg-slate-100">
        <th class="border px-2 py-1">תאריך</th><th class="border px-2 py-1">מסלול / יעד</th>
        <th class="border px-2 py-1">מחיר</th><th class="border px-2 py-1">הערות</th><th class="border px-2 py-1"></th>
      </tr></thead><tbody>`;
    trips.forEach(t => {
      html += `<tr>
        <td class="border px-1 py-0.5"><input type="date" value="${t.date}" onchange="matrixUpdateTrip('${t.id}','date',this.value)" class="w-full border-0 text-xs"/></td>
        <td class="border px-1 py-0.5"><input value="${escAttr(t.route||'')}" onchange="matrixUpdateTrip('${t.id}','route',this.value)" class="w-full border-0 text-xs"/></td>
        <td class="border px-1 py-0.5"><input type="number" value="${t.price||''}" onchange="matrixUpdateTrip('${t.id}','price',+this.value)" class="w-20 border-0 text-xs text-center"/></td>
        <td class="border px-1 py-0.5"><input value="${escAttr(t.notes||'')}" onchange="matrixUpdateTrip('${t.id}','notes',this.value)" class="w-full border-0 text-xs"/></td>
        <td class="border px-1 py-0.5 text-center"><button onclick="matrixDeleteTrip('${t.id}')" class="text-red-500">✕</button></td>
      </tr>`;
    });
    html += `</tbody></table>
      <p class="text-xs text-slate-400 mt-2">${trips.length} שורות · סה״כ ${formatMoney(trips.reduce((s,t)=>s+(t.price||0),0))}</p>`;
    body.innerHTML = html;
    return;
  }

  // Build lookup: date -> columnKey -> {price, tripId}
  const trips = state.trips.filter(t =>
    t.customerId === c.id && t.date && t.date.startsWith(month) &&
    (t.line === line || (!t.line && line && (t.route||'').includes(line)))
  );
  const lookup = {};
  trips.forEach(t => {
    if (!lookup[t.date]) lookup[t.date] = {};
    let col = t.columnKey;
    if (!col) {
      // match trip to a column by route/notes
      col = columns.find(ck => (t.route||'').includes(ck) || (t.notes||'').includes(ck) ||
        (t.route||'') === ck || (t.route||'').includes(ck.replace('קו ','')));
    }
    if (!col) col = columns[0]; // assign to first if single-ish
    if (col) {
      // if multiple, sum or take last
      if (!lookup[t.date][col]) lookup[t.date][col] = { price: 0, tripIds: [] };
      lookup[t.date][col].price += (t.price || 0);
      lookup[t.date][col].tripIds.push(t.id);
    }
  });

  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const dayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

  let html = `<div class="mb-2 flex flex-wrap gap-2 items-center text-sm">
    <span class="font-medium text-indigo-800">גיליון: ${line}</span>
    <span class="text-xs text-slate-400">לחץ על תא כדי לערוך מחיר · Enter לשמירה</span>
    <button onclick="renderMatrixBody()" class="text-xs bg-slate-100 px-2 py-1 rounded-lg mr-auto">↻ רענן</button>
  </div>
  <div class="overflow-x-auto"><table class="min-w-full border-collapse text-xs">
    <thead><tr class="bg-slate-100 sticky top-0">
      <th class="border border-slate-200 px-2 py-1.5 text-right sticky right-0 bg-slate-100 z-10 min-w-[130px]">תאריך</th>`;
  columns.forEach(col => {
    html += `<th class="border border-slate-200 px-2 py-1.5 text-center whitespace-nowrap min-w-[90px]">${col}</th>`;
  });
  html += `<th class="border border-slate-200 px-2 py-1.5 text-center bg-slate-50">סה״כ</th></tr></thead><tbody>`;

  let grandCols = columns.map(() => 0);
  let grandTotal = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const ds = `${month}-${String(day).padStart(2,'0')}`;
    const dt = new Date(y, mo - 1, day);
    const dn = dayNames[dt.getDay()];
    const isWE = dt.getDay() === 5 || dt.getDay() === 6;
    const rowBg = isWE ? 'bg-slate-50' : '';
    let dayTotal = 0;
    html += `<tr class="${rowBg}"><td class="border border-slate-200 px-2 py-0.5 sticky right-0 ${isWE?'bg-slate-50':'bg-white'} z-10 whitespace-nowrap">יום ${dn}, ${day}/${mo}</td>`;
    columns.forEach((col, ci) => {
      const cell = lookup[ds] && lookup[ds][col];
      const val = cell ? cell.price : '';
      if (val) { dayTotal += val; grandCols[ci] += val; }
      const tripId = cell && cell.tripIds.length === 1 ? cell.tripIds[0] : '';
      html += `<td class="border border-slate-200 p-0 text-center">
        <input type="number" min="0" step="1"
          data-date="${ds}" data-col="${escAttr(col)}" data-trip="${tripId}"
          value="${val || ''}"
          placeholder="—"
          onchange="matrixCellChange(this)"
          class="w-full text-center py-1.5 px-1 border-0 bg-transparent focus:bg-indigo-50 focus:outline-none text-xs ${val ? 'font-medium text-emerald-700' : 'text-slate-300'}"
        /></td>`;
    });
    grandTotal += dayTotal;
    html += `<td class="border border-slate-200 px-2 py-1 text-center font-semibold ${dayTotal?'':'text-slate-300'}">${dayTotal ? formatMoney(dayTotal) : '—'}</td></tr>`;
  }

  const vatRateM = state.defaultVat || 18;
  const appliesVatM = !c || c.vat !== false;
  const vatTotalM = appliesVatM ? Math.round(grandTotal * (vatRateM / 100) * 100) / 100 : 0;

  html += `<tr class="bg-slate-100 font-semibold"><td class="border border-slate-200 px-2 py-1.5 sticky right-0 bg-slate-100 z-10">סה״כ לפני מע״מ</td>`;
  grandCols.forEach(g => {
    html += `<td class="border border-slate-200 px-2 py-1.5 text-center">${g ? formatMoney(g) : '—'}</td>`;
  });
  html += `<td class="border border-slate-200 px-2 py-1.5 text-center">${grandTotal ? formatMoney(grandTotal) : '—'}</td></tr>`;
  if (appliesVatM) {
    html += `<tr class="bg-amber-50 font-medium"><td class="border border-slate-200 px-2 py-1.5 sticky right-0 bg-amber-50 z-10">מע״מ ${vatRateM}%</td>`;
    grandCols.forEach(g => {
      const v = g ? Math.round(g * (vatRateM / 100) * 100) / 100 : 0;
      html += `<td class="border border-slate-200 px-2 py-1.5 text-center text-amber-800">${v ? formatMoney(v) : '—'}</td>`;
    });
    html += `<td class="border border-slate-200 px-2 py-1.5 text-center text-amber-900 font-semibold">${vatTotalM ? formatMoney(vatTotalM) : '—'}</td></tr>`;
    html += `<tr class="bg-indigo-50 font-bold"><td class="border border-slate-200 px-2 py-1.5 sticky right-0 bg-indigo-50 z-10">סה״כ כולל מע״מ</td>`;
    grandCols.forEach(g => {
      const v = g ? Math.round(g * (1 + vatRateM / 100) * 100) / 100 : 0;
      html += `<td class="border border-slate-200 px-2 py-1.5 text-center">${v ? formatMoney(v) : '—'}</td>`;
    });
    html += `<td class="border border-slate-200 px-2 py-1.5 text-center text-indigo-900">${formatMoney(grandTotal + vatTotalM)}</td></tr>`;
  }
  html += `</tbody></table></div>
    <p class="text-xs text-slate-400 mt-2">עמודות לפי מבנה האקסל של הקו. שינוי מחיר נשמר מיד כנסיעה (לקוח + קו + תאריך + עמודת זמן).</p>`;
  body.innerHTML = html;
}

function matrixCellChange(input) {
  const date = input.dataset.date;
  const col = input.dataset.col;
  const tripId = input.dataset.trip;
  const price = parseFloat(input.value);
  const c = getCustomer(_matrixCustomerId);
  const line = document.getElementById('matrixLineSelect').value;

  if (!price && price !== 0) {
    // empty = delete trip(s)
    if (tripId) {
      state.trips = state.trips.filter(t => t.id !== tripId);
      saveState();
      toast('נסיעה נמחקה');
    } else {
      // delete all matching
      state.trips = state.trips.filter(t => !(
        t.customerId === c.id && t.date === date && t.line === line && t.columnKey === col
      ));
      saveState();
    }
    renderMatrixBody();
    return;
  }

  if (tripId) {
    const t = state.trips.find(x => x.id === tripId);
    if (t) {
      t.price = price;
      t.columnKey = col;
      t.line = line;
      t.route = `${line} · ${col}`;
      const _learnedU = learnFromTrip(t);
      saveState();
      toast('עודכן ₪' + price);
      toastLearned(_learnedU);
      // update style without full redraw for speed
      input.className = input.className.replace('text-slate-300', 'font-medium text-emerald-700');
      return;
    }
  }

  // create new
  const trip = {
    id: uid(),
    customerId: c.id,
    line,
    columnKey: col,
    date,
    price,
    route: `${line} · ${col}`,
    origin: line,
    destination: col,
    notes: '',
    driver: '',
    listPrice: null,
    suggestedPrice: price,
    priceSource: 'עריכת מטריצה',
    source: 'matrix',
    createdAt: new Date().toISOString()
  };
  state.trips.unshift(trip);
  const _learnedM = learnFromTrip(trip);
  saveState();
  toast('נוספה נסיעה ₪' + price);
  toastLearned(_learnedM);
  renderMatrixBody();
}

function matrixUpdateTrip(id, field, value) {
  const t = state.trips.find(x => x.id === id);
  if (!t) return;
  t[field] = value;
  saveState();
  toast('עודכן');
}

function matrixDeleteTrip(id) {
  state.trips = state.trips.filter(t => t.id !== id);
  saveState();
  renderMatrixBody();
  toast('נמחק');
}

function matrixAddFreeTrip() {
  const c = getCustomer(_matrixCustomerId);
  const line = document.getElementById('matrixLineSelect').value;
  const month = state.workingMonth;
  state.trips.unshift({
    id: uid(),
    customerId: c.id,
    line,
    date: month + '-01',
    price: 0,
    route: '',
    notes: '',
    driver: '',
    source: 'matrix',
    createdAt: new Date().toISOString()
  });
  saveState();
  renderMatrixBody();
}



// ============================================================
// AI Agent – conversational Hebrew assistant with memory
// ============================================================
const aiCtx = {
  customerId: null,
  line: null,
  columnKey: null,
  time: null,
  price: null,
  lastIntent: null,
  dayFrom: null,  // 1-31 inclusive start
  dayTo: null,    // 1-31 inclusive end
  excludeFri: false,
  excludeSat: false,
  history: []
};

const LINE_ALIASES = {
  'בב': 'בני ברק', 'בני ברק': 'בני ברק', 'ב"ב': 'בני ברק',
  'אשדוד': 'אשדוד בי', 'אשדוד בי': 'אשדוד בי',
  'מודיעין': 'מודיעין עילית', 'ספר': 'מודיעין עילית', 'מודיעין עילית': 'מודיעין עילית',
  'יבנה': 'יבנה אשדוד',
  'ראש העין': 'ראש העין', 'רע': 'ראש העין',
  'יהוד': 'בני ברק יהוד',
  'רעננה': 'בב רעננה', 'בב רעננה': 'בב רעננה',
  'נתניה': 'נתניה רעננה',
  'תל אביב': 'תל אביב', 'תא': 'תל אביב',
  'אלעד': 'אלעד רעננה',
  'פתקים': 'פתקי פרח', 'פתקי': 'פתקי פרח'
};

function initAIChat() {
  const chat = document.getElementById('aiChat');
  if (chat && !chat.dataset.ready) {
    chat.dataset.ready = '1';
    aiAppend('bot', 'שלום! אני עוזר לניהול נסיעות עם זיכרון שיחה.\n\nדוגמאות:\n• "בפרח בקו בב שעה 8 שנה מחיר ל־320 עד ה־14 בלי שישי שבת"\n• "מחק נסיעות אחרי 14 בספטמבר"\n• "כמה נסיעות לפרח בקו בני ברק?"\n\nאפשר להמשיך קצר: "שנה ל־200", "מחק את זה".');
  }
}

function fillAI(text) {
  const el = document.getElementById('aiInput');
  if (el) { el.value = text; el.focus(); }
}

function aiAppend(who, text) {
  const chat = document.getElementById('aiChat');
  if (!chat) return;
  const div = document.createElement('div');
  div.className = who === 'user'
    ? 'bg-indigo-600 text-white rounded-2xl rounded-bl-md px-4 py-2 max-w-[90%] mr-auto'
    : 'bg-white border border-slate-200 rounded-2xl rounded-br-md px-4 py-2 max-w-[90%] ml-auto whitespace-pre-wrap';
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  aiCtx.history.push({ role: who, text });
  if (aiCtx.history.length > 40) aiCtx.history = aiCtx.history.slice(-40);
}

async function runAICommand() {
  const input = document.getElementById('aiInput');
  const text = (input.value || '').trim();
  if (!text) return;
  aiAppend('user', text);
  input.value = '';
  const btn = document.getElementById('aiSendBtn');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  let result;
  const key = getGeminiKey();
  try {
    if (key) {
      result = await runGeminiAI(text);
    } else {
      result = parseAndExecuteAI(text);
      result = '⚠️ אין מפתח Gemini – מצב מקומי.\n\n' + result;
    }
  } catch (e) {
    console.error(e);
    const msg = String(e.message || e);
    const busy = /high demand|rate|quota|unavailable|overload|503|429/i.test(msg);
    try {
      result = parseAndExecuteAI(text);
      if (busy) {
        result = '⏳ Gemini עמוס כרגע – בוצע במצב מקומי (נסה שוב בעוד דקה):\n\n' + result;
      } else {
        result = '⚠️ Gemini: ' + msg.slice(0, 120) + '\n\nמצב מקומי:\n' + result;
      }
    } catch (e2) {
      result = 'שגיאה: ' + msg;
    }
  }
  aiAppend('bot', result);
  if (/✓|הוספ|נמחק|עודכ|שונ|נוצר/.test(result)) {
    saveState();
    try { renderTrips(); renderRecent(); renderCustomers(); renderDashboard(); } catch (_) {}
  }
  if (btn) { btn.disabled = false; btn.textContent = 'שלח'; }
}


function aiFindCustomer(text) {
  const t = (text || '').toLowerCase();
  let best = null, bestLen = 0;
  for (const c of state.customers) {
    const n = c.name.toLowerCase();
    // whole-word-ish: name appears as token
    if ((t.includes(n) || t.includes('של ' + n) || t.includes('ל' + n)) && n.length > bestLen) {
      best = c; bestLen = n.length;
    }
  }
  if (best) return best;
  if (/פרח|perach/.test(t)) return state.customers.find(x => x.id === 'perach') || null;
  if (/אורחות/.test(t)) return state.customers.find(x => x.id === 'orhot') || null;
  if (/אירוקס/.test(t)) return state.customers.find(x => x.id === 'airoks') || null;
  if (/שמוליק/.test(t)) return state.customers.find(x => x.id === 'shmulik') || null;
  if (/גורמה/.test(t)) return state.customers.find(x => x.id === 'gourmet') || null;
  if (aiCtx.customerId) return getCustomer(aiCtx.customerId);
  return null;
}

function aiScoreLine(lineName, text) {
  const t = (text || '').toLowerCase();
  const ln = lineName.toLowerCase().trim();
  let score = 0;
  if (t.includes(ln)) score += 100 + ln.length;
  // aliases pointing to this line
  for (const [alias, target] of Object.entries(LINE_ALIASES)) {
    if (target === lineName || target === ln || lineName.includes(target)) {
      // alias as whole token
      const re = new RegExp('(?:^|\\s|קו\\s+)' + alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:\\s|$|שעה|,)', 'i');
      if (re.test(text) || t.includes('קו ' + alias) || t.includes('בקו ' + alias)) {
        score += 80 + alias.length;
      }
    }
  }
  // "בב" special → בני ברק stronger than בב רעננה if not "רעננה"
  if ((ln === 'בני ברק' || ln.startsWith('בני ברק')) && /(?:קו\s+)?בב(?!\s*רעננה)/i.test(text) && !/רעננה/.test(t)) {
    score += 90;
  }
  if (ln === 'בב רעננה' && /בב\s*רעננה|רעננה/.test(t)) score += 90;
  // token overlap
  ln.split(/\s+/).forEach(p => {
    if (p.length > 2 && t.includes(p)) score += 10;
  });
  return score;
}

function aiFindLine(text, customer) {
  if (!customer || !customer.lines || !customer.lines.length) return aiCtx.line || null;
  let best = null, bestScore = 0;
  for (const l of customer.lines) {
    const s = aiScoreLine(l, text);
    if (s > bestScore) { bestScore = s; best = l; }
  }
  if (bestScore >= 50) return best;
  // explicit "בקו X"
  const m = text.match(/ב?קו\s+(?:של\s+)?([א-ת"']+)/);
  if (m) {
    const hint = m[1].trim();
    const expanded = LINE_ALIASES[hint] || LINE_ALIASES[hint.replace(/"/g, '')] || hint;
    for (const l of customer.lines) {
      if (l === expanded || l.includes(expanded) || expanded.includes(l.split(' ')[0])) return l;
    }
  }
  return aiCtx.line || null;
}

function aiExtractTime(text) {
  const t = text || '';
  let m = t.match(/(\d{1,2}):(\d{2})/);
  if (m) return m[1].padStart(2, '0') + ':' + m[2];
  // שעה 8 / בשעה 8 / ב-8
  m = t.match(/שעה\s*(\d{1,2})\b/);
  if (m) return m[1].padStart(2, '0') + ':00';
  m = t.match(/(?:בשעה\s*|ב־\s*|ב-\s*)(\d{1,2})\b/);
  if (m) return m[1].padStart(2, '0') + ':00';
  m = t.match(/קו\s+(?:של\s+|גדול\s+)?(\d{1,2})\b/);
  if (m) return m[1].padStart(2, '0') + ':00';
  if (/פתיחה/.test(t)) return 'פתיחה';
  if (/הלוך/.test(t)) return 'הלוך';
  if (/חזור/.test(t)) return 'חזור';
  if (/צהרים/.test(t)) return 'צהרים';
  return null; // don't always fall back – allow explicit clear
}

function aiExtractPrice(text) {
  const t = text || '';
  const patterns = [
    /(?:ל[־\-]?\s*|ב[־\-]?\s*|מחיר\s*(?:ל[־\-]?)?|סכום\s*)(\d{2,5})\s*(?:ש["״']?ח|₪)?/,
    /(\d{2,5})\s*(?:ש["״']?ח|₪)/,
    /(?:שנה|עדכן|שים|החלף).*?(\d{2,5})/,
  ];
  for (const p of patterns) {
    const m = t.match(p);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function aiExtractDayRange(text) {
  const t = text || '';
  let dayFrom = null, dayTo = null;
  // אחרי 14 / לאחר 14
  let m = t.match(/(?:אחרי|לאחר)\s*(?:ה[־\-]?)?(\d{1,2})/);
  if (m) dayFrom = parseInt(m[1], 10) + 1;
  // עד ה-14 / לפני 14 / עד 14
  m = t.match(/(?:עד\s*ה?[־\-]?\s*|לפני\s*)(\d{1,2})/);
  if (m) dayTo = parseInt(m[1], 10);
  // מה-1 עד ה-14
  m = t.match(/מ(?:ה?[־\-]?)?(\d{1,2})\s*עד\s*ה?[־\-]?\s*(\d{1,2})/);
  if (m) { dayFrom = parseInt(m[1], 10); dayTo = parseInt(m[2], 10); }
  // "ואחרי 14 לחודש לא היו נסיעות" → means we should only affect days 1-14
  if (/אחרי\s*\d{1,2}.*לא\s*היו|לא\s*היו.*אחרי\s*\d{1,2}/.test(t)) {
    m = t.match(/אחרי\s*(?:ה?[־\-]?)?(\d{1,2})/);
    if (m) dayTo = parseInt(m[1], 10);
  }
  return { dayFrom, dayTo };
}

function aiExtractColumnKey(text, customer, line, time) {
  if (!customer) return time;
  const cols = getLineSchema(customer.id, line || '') || [];
  const t = (text || '').toLowerCase();
  for (const col of cols) {
    if (t.includes(col.toLowerCase())) return col;
  }
  if (time) {
    // 08:00 → קו גדול 08:00 or קו 08:00
    const hit = cols.find(c => c.includes(time) || c.includes(time.replace(/^0/, '')));
    if (hit) return hit;
    const hour = time.slice(0, 2);
    const hit2 = cols.find(c => {
      const cm = c.match(/(\d{1,2}):(\d{2})/);
      return cm && cm[1].padStart(2, '0') === hour;
    });
    if (hit2) return hit2;
  }
  return time || null;
}

function aiTripMatchesContext(t, c, line, colKey, dayFrom, dayTo, excludeFri, excludeSat) {
  if (c && t.customerId !== c.id) return false;
  const month = state.workingMonth;
  if (!t.date || !t.date.startsWith(month)) return false;
  const day = parseInt(t.date.slice(8, 10), 10);
  if (dayFrom != null && day < dayFrom) return false;
  if (dayTo != null && day > dayTo) return false;
  if (excludeFri || excludeSat) {
    const [y, mo] = month.split('-').map(Number);
    const dt = new Date(y, mo - 1, day);
    const dow = dt.getDay();
    if (excludeFri && dow === 5) return false;
    if (excludeSat && dow === 6) return false;
  }
  if (line) {
    const lineOk = t.line === line ||
      (t.line && t.line.trim() === line.trim()) ||
      (t.route || '').includes(line) ||
      (t.origin || '') === line;
    if (!lineOk) {
      // abbreviation: trip line בני ברק vs filter בב
      const expanded = LINE_ALIASES[line] || line;
      if (!(t.line === expanded || (t.route || '').includes(expanded))) return false;
    }
  }
  if (colKey) {
    const txt = `${t.route || ''} ${t.columnKey || ''} ${t.destination || ''} ${t.notes || ''}`;
    const timePart = (colKey.match(/\d{1,2}:\d{2}/) || [])[0];
    const ok = t.columnKey === colKey ||
      txt.includes(colKey) ||
      (timePart && (txt.includes(timePart) || (t.columnKey || '').includes(timePart))) ||
      (timePart && (t.columnKey || '').includes(timePart.replace(/^0/, '')));
    if (!ok) return false;
  }
  return true;
}

function parseAndExecuteAI(raw) {
  const text = raw.trim();
  const lower = text.toLowerCase();

  // --- extract entities ---
  const cust = aiFindCustomer(text);
  if (cust) aiCtx.customerId = cust.id;
  const c = aiCtx.customerId ? getCustomer(aiCtx.customerId) : null;

  const line = aiFindLine(text, c);
  if (line) aiCtx.line = line;

  const timeEx = aiExtractTime(text);
  if (timeEx) aiCtx.time = timeEx;

  const priceEx = aiExtractPrice(text);
  if (priceEx != null) aiCtx.price = priceEx;

  const range = aiExtractDayRange(text);
  if (range.dayFrom != null) aiCtx.dayFrom = range.dayFrom;
  if (range.dayTo != null) aiCtx.dayTo = range.dayTo;
  // reset range if new message clearly about full month without constraint
  if (/כל\s*החודש|כל\s*הנסיעות/.test(lower) && !/אחרי|לפני|עד/.test(lower)) {
    aiCtx.dayFrom = null; aiCtx.dayTo = null;
  }

  if (/שישי/.test(lower)) aiCtx.excludeFri = true;
  if (/שבת/.test(lower)) aiCtx.excludeSat = true;
  if (/בלי\s*שישי|ללא\s*שישי|חוץ.*שישי/.test(lower)) aiCtx.excludeFri = true;
  if (/בלי\s*שבת|ללא\s*שבת|חוץ.*שבת/.test(lower)) aiCtx.excludeSat = true;

  const col = aiExtractColumnKey(text, c, aiCtx.line, aiCtx.time || timeEx);
  if (col) aiCtx.columnKey = col;

  // intents – can be multiple in one sentence
  const intentAdd = /הוסף|הוספ|תוסיף|צור|כל\s*יום|יומי/.test(lower);
  const intentDel = /מחק|תמחק|הסר|מחיקה|תוריד/.test(lower);
  const intentCount = /כמה|ספור|מספר\s*נסיעות/.test(lower);
  const intentShow = /הצג|הראה|תראה|רשימת|איזה\s*קווים|קווים\s*של/.test(lower);
  const intentChange = /שנה|עדכן|תשנה|תעדכן|החלף|שים\s*(?:את\s*)?ה?מחיר|ל־\s*\d|ל-\s*\d/.test(lower) ||
    (/מחיר/.test(lower) && /\d{2,5}/.test(lower) && !intentAdd);
  const intentHelp = /עזרה|מה\s*אפשר|help|איך/.test(lower);
  const intentStatus = /מה\s*המצב|סיכום\s*חודש|סטטוס/.test(lower);

  // short follow-up
  const isShort = text.length < 35;
  if (!intentAdd && !intentDel && !intentCount && !intentShow && !intentChange && !intentHelp && !intentStatus) {
    if (isShort && aiCtx.lastIntent) {
      // keep last intent for "ל־320", "את זה", etc.
      if (priceEx != null && aiCtx.lastIntent === 'change') { /* change */ }
      else if (/את\s*זה|הכל/.test(lower) && aiCtx.lastIntent === 'delete') { /* del */ }
    }
  }

  let intent = null;
  if (intentChange) intent = 'change';
  else if (intentAdd) intent = 'add';
  else if (intentDel) intent = 'delete';
  else if (intentCount) intent = 'count';
  else if (intentShow) intent = 'show';
  else if (intentHelp) intent = 'help';
  else if (intentStatus) intent = 'status';
  else if (isShort && aiCtx.lastIntent) intent = aiCtx.lastIntent;
  else if (priceEx != null && c && (aiCtx.time || aiCtx.columnKey || aiCtx.line)) intent = 'change';

  if (intent) aiCtx.lastIntent = intent;

  const ctxSummary = () => {
    const parts = [];
    if (c) parts.push(c.name);
    if (aiCtx.line) parts.push('קו ' + aiCtx.line);
    if (aiCtx.columnKey || aiCtx.time) parts.push(aiCtx.columnKey || aiCtx.time);
    if (aiCtx.price) parts.push('₪' + aiCtx.price);
    if (aiCtx.dayTo) parts.push('עד יום ' + aiCtx.dayTo);
    if (aiCtx.dayFrom) parts.push('מיום ' + aiCtx.dayFrom);
    if (aiCtx.excludeFri || aiCtx.excludeSat) parts.push('ללא ' + [aiCtx.excludeFri && 'שישי', aiCtx.excludeSat && 'שבת'].filter(Boolean).join('/'));
    return parts.length ? parts.join(' · ') : 'אין הקשר';
  };

  // ---- HELP ----
  if (intent === 'help' || (!intent && !c && !intentDel)) {
    return 'הקשר: ' + ctxSummary() + '\n\nאפשר:\n• שינוי מחיר: "בפרח בקו בב שעה 8 שנה ל־320 עד ה־14 בלי שישי שבת"\n• מחיקה: "מחק נסיעות אחרי 14"\n• הוספה: "הוסף כל יום 150 בקו ..."\n• ספירה / הצג קווים';
  }

  // ---- SHOW ----
  if (intent === 'show') {
    if (!c) return 'לאיזה לקוח? למשל "הצג קווים של פרח"';
    const lines = c.lines || [];
    let msg = `קווים של ${c.name}:\n` + lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    if (aiCtx.line) {
      const cols = getLineSchema(c.id, aiCtx.line) || [];
      if (cols.length) msg += `\n\nעמודות ב"${aiCtx.line}":\n` + cols.map(x => '• ' + x).join('\n');
    }
    return msg;
  }

  // ---- COUNT ----
  if (intent === 'count') {
    const trips = state.trips.filter(t =>
      aiTripMatchesContext(t, c, aiCtx.line, aiCtx.columnKey || aiCtx.time, aiCtx.dayFrom, aiCtx.dayTo, false, false)
    );
    // if no line/col filter and only customer
    let list = trips;
    if (!c) list = state.trips.filter(t => t.date && t.date.startsWith(state.workingMonth));
    const sum = list.reduce((s, t) => s + (t.price || 0), 0);
    return `הקשר: ${ctxSummary()}\n• ${list.length} נסיעות\n• סה״כ ${formatMoney(sum)}`;
  }

  // ---- STATUS ----
  if (intent === 'status') {
    const trips = state.trips.filter(t => t.date && t.date.startsWith(state.workingMonth));
    const sum = trips.reduce((s, t) => s + (t.price || 0), 0);
    return `חודש ${state.workingMonth}: ${trips.length} נסיעות · ${formatMoney(sum)}\nהקשר AI: ${ctxSummary()}`;
  }

  // ---- DELETE ----
  if (intent === 'delete') {
    if (!c && !aiCtx.dayFrom && !/הכל|את\s*זה/.test(lower)) {
      // allow delete by date range only if context has customer
      if (!aiCtx.customerId) return 'לאיזה לקוח למחוק? או ציין "מחק נסיעות אחרי 14 בפרח"';
    }
    const target = c || (aiCtx.customerId ? getCustomer(aiCtx.customerId) : null);
    // "אחרי 14" on delete → dayFrom = 15
    let dFrom = aiCtx.dayFrom, dTo = aiCtx.dayTo;
    const mAfter = lower.match(/(?:אחרי|לאחר)\s*(?:ה?[־\-]?)?(\d{1,2})/);
    if (mAfter && intentDel) {
      dFrom = parseInt(mAfter[1], 10) + 1;
      dTo = null;
    }
    const before = state.trips.length;
    state.trips = state.trips.filter(t => {
      if (!aiTripMatchesContext(t, target, aiCtx.line, aiCtx.columnKey || aiCtx.time, dFrom, dTo, false, false)) {
        // if only date filter without line
        if (target && t.customerId === target.id && t.date && t.date.startsWith(state.workingMonth)) {
          const day = parseInt(t.date.slice(8, 10), 10);
          if (dFrom != null && day >= dFrom && !aiCtx.line && !aiCtx.columnKey && !aiCtx.time) return false;
          if (dTo != null && day <= dTo && !aiCtx.line && !aiCtx.columnKey && !aiCtx.time && dFrom == null) return false;
        }
        return true; // keep
      }
      return false; // delete match
    });
    const deleted = before - state.trips.length;
    if (deleted === 0) {
      return `לא מצאתי נסיעות למחיקה.\nהקשר: ${ctxSummary()}\nנסה: "מחק בפרח בקו בב שעה 8 אחרי 14"`;
    }
    return `✓ נמחקו ${deleted} נסיעות.\nהקשר: ${ctxSummary()}`;
  }

  // ---- CHANGE PRICE ----
  if (intent === 'change') {
    if (!c) return 'לאיזה לקוח? למשל "בפרח ..."';
    const newPrice = priceEx != null ? priceEx : aiCtx.price;
    if (newPrice == null) return `לאיזה מחיר? הקשר: ${ctxSummary()}\nלדוגמה: "שנה ל־320"`;

    // default: if user said no trips after 14, limit to dayTo=14
    let dFrom = aiCtx.dayFrom;
    let dTo = aiCtx.dayTo;
    // "לא היו נסיעות בשישי ושבת" means exclude those days from update (or they shouldn't exist)
    const exF = aiCtx.excludeFri;
    const exS = aiCtx.excludeSat;

    let n = 0;
    const matched = [];
    state.trips.forEach(t => {
      if (!aiTripMatchesContext(t, c, aiCtx.line, aiCtx.columnKey || aiCtx.time, dFrom, dTo, exF, exS)) return;
      t.price = newPrice;
      n++;
      matched.push(t);
    });

    // If nothing matched – try looser: customer + time only
    if (n === 0 && (aiCtx.time || aiCtx.columnKey)) {
      const timePart = aiCtx.time || (aiCtx.columnKey.match(/\d{1,2}:\d{2}/) || [])[0];
      state.trips.forEach(t => {
        if (t.customerId !== c.id) return;
        if (!t.date || !t.date.startsWith(state.workingMonth)) return;
        const day = parseInt(t.date.slice(8, 10), 10);
        if (dTo != null && day > dTo) return;
        if (dFrom != null && day < dFrom) return;
        const txt = `${t.route || ''} ${t.columnKey || ''} ${t.destination || ''}`;
        if (timePart && (txt.includes(timePart) || txt.includes(timePart.replace(/^0/, '')) ||
            (t.columnKey || '').includes(timePart.slice(0, 2)))) {
          t.price = newPrice;
          n++;
        }
      });
    }

    // Still nothing – try match line בני ברק via בב alias without column
    if (n === 0 && aiCtx.line) {
      state.trips.forEach(t => {
        if (t.customerId !== c.id) return;
        if (!t.date || !t.date.startsWith(state.workingMonth)) return;
        if (t.line === aiCtx.line || (t.route || '').includes(aiCtx.line)) {
          const day = parseInt(t.date.slice(8, 10), 10);
          if (dTo != null && day > dTo) return;
          if (dFrom != null && day < dFrom) return;
          t.price = newPrice;
          n++;
        }
      });
    }

    if (!n) {
      return `לא מצאתי נסיעות לעדכון.\nהקשר: ${ctxSummary()}\n\nטיפים:\n• ודא שיש נסיעות בחודש העבודה (${state.workingMonth})\n• נסה: "פרח קו בני ברק שעה 08:00 שנה ל־320"\n• או פתח תצוגת קווים של פרח ובדוק ידנית`;
    }
    aiCtx.price = newPrice;
    return `✓ עודכן מחיר ל־${formatMoney(newPrice)} ב־${n} נסיעות.\nהקשר: ${ctxSummary()}`;
  }

  // ---- ADD ----
  if (intent === 'add') {
    if (!c) return 'לאיזה לקוח להוסיף?';
    const addPrice = priceEx != null ? priceEx : aiCtx.price;
    if (addPrice == null) return `באיזה מחיר? הקשר: ${ctxSummary()}`;

    let colKey = aiCtx.columnKey || aiCtx.time || 'מחיר';
    if (aiCtx.line) {
      const cols = getLineSchema(c.id, aiCtx.line) || [];
      const match = cols.find(x => x.includes(colKey) || (aiCtx.time && x.includes(aiCtx.time)));
      if (match) colKey = match;
      else if (aiCtx.time) {
        const hour = aiCtx.time.slice(0, 2);
        const byH = cols.find(x => {
          const cm = x.match(/(\d{1,2}):/);
          return cm && cm[1].padStart(2, '0') === hour;
        });
        if (byH) colKey = byH;
      }
    }

    const month = state.workingMonth;
    const [y, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const lineName = aiCtx.line || '';
    let dFrom = aiCtx.dayFrom || 1;
    let dTo = aiCtx.dayTo || daysInMonth;
    const exF = aiCtx.excludeFri || /שישי/.test(lower);
    const exS = aiCtx.excludeSat || /שבת/.test(lower);

    let added = 0;
    for (let day = dFrom; day <= dTo; day++) {
      const dt = new Date(y, mo - 1, day);
      const dow = dt.getDay();
      if (exF && dow === 5) continue;
      if (exS && dow === 6) continue;
      if (!exF && !exS && /כל\s*יום|יומי/.test(lower) && (dow === 5 || dow === 6)) continue;
      const ds = `${month}-${String(day).padStart(2, '0')}`;
      const exists = state.trips.some(t =>
        t.customerId === c.id && t.date === ds && t.line === lineName &&
        (t.columnKey === colKey || (t.route || '').includes(colKey))
      );
      if (exists) continue;
      state.trips.push({
        id: uid(),
        customerId: c.id,
        line: lineName,
        columnKey: colKey,
        date: ds,
        price: addPrice,
        route: `${lineName} · ${colKey}`,
        origin: lineName,
        destination: colKey,
        notes: '',
        driver: '',
        source: 'ai',
        createdAt: new Date().toISOString()
      });
      learnFromTrip(state.trips[state.trips.length - 1] || state.trips[0]);
      added++;
    }
    if (!added) return 'לא נוספו (אולי כבר קיימות). ' + ctxSummary();
    aiCtx.price = addPrice;
    aiCtx.columnKey = colKey;
    return `✓ הוספתי ${added} נסיעות.\n${ctxSummary()} · ${formatMoney(addPrice)}\nאפשר: "שנה ל־200" / "מחק את זה"`;
  }

  return `לא הבנתי לגמרי.\nהקשר: ${ctxSummary()}\nנסה: הוסף / מחק / שנה מחיר / כמה נסיעות / הצג קווים`;
}


// ============================================================
// STAGE A – Pricing Engine, Price List, History, Autocomplete
// ============================================================

// _editingPriceList declared at top

function normalizePlace(s) {
  if (!s) return '';
  let t = String(s).trim().toLowerCase()
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ');
  // common abbreviations
  const map = {
    'בב': 'בני ברק', 'ב"ב': 'בני ברק', 'בני-ברק': 'בני ברק',
    'ים': 'ירושלים', 'ירושלם': 'ירושלים',
    'ספר': 'מודיעין עילית', 'מע': 'מודיעין עילית',
    'שמש': 'בית שמש', 'בש': 'בית שמש',
    'פת': 'פתח תקווה', 'שדה': 'שדה תעופה', 'נתבג': 'שדה תעופה'
  };
  if (map[t]) return map[t];
  for (const [k, v] of Object.entries(map)) {
    if (t === k || t.startsWith(k + ' ') || t.endsWith(' ' + k)) {
      t = t.replace(k, v);
    }
  }
  return t;
}

function placesMatch(a, b) {
  const na = normalizePlace(a);
  const nb = normalizePlace(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

/** Priority:
 * 1 exact customer price list (origin+dest)
 * 2 broader customer price list (partial)
 * 3 customer history
 * 4 route history (other customers)
 * 5 none
 */
function suggestPrice(customerId, origin, destination, route, date, line, columnKey) {
  const result = { price: null, source: 'אין מספיק מידע', sourceTier: 5, stats: null };
  const c = getCustomer(customerId);
  const o = origin || '';
  const d = destination || '';
  const r = route || '';
  const lineName = line || document.getElementById('formLine')?.value || '';
  const col = columnKey || '';

  // --- Tier 1: exact price list ---
  if (c && c.priceList && c.priceList.length) {
    const active = c.priceList.filter(p => p.active !== false);
    // line + time column (Perach style)
    if (lineName || col || r) {
      const hitLine = active.find(p => {
        const po = (p.origin || '').trim();
        const pd = (p.destination || '').trim();
        const lineOk = !lineName || po === lineName || placesMatch(po, lineName) || (r && r.includes(po));
        const colOk = (col && (pd === col || pd.includes(col) || col.includes(pd))) ||
          (r && (pd === r || r.includes(pd) || pd.includes(r)));
        return lineOk && colOk && (p.price > 0);
      });
      if (hitLine) {
        result.price = hitLine.price;
        result.source = `🎯 מחירון: ${hitLine.origin} → ${hitLine.destination}`;
        result.sourceTier = 1;
        result.listEntry = hitLine;
        return withHistoryStats(result, customerId, o, d, r);
      }
    }
    // exact origin+dest
    let hit = active.find(p => placesMatch(p.origin, o) && placesMatch(p.destination, d));
    // or origin/dest against route text
    if (!hit && r) {
      hit = active.find(p => {
        const po = normalizePlace(p.origin);
        const pd = normalizePlace(p.destination);
        const rt = normalizePlace(r);
        return (po && rt.includes(po) && pd && rt.includes(pd)) ||
               (po && rt.includes(po)) ||
               (pd && rt.includes(pd));
      });
    }
    // match line-style: origin is line name, dest is time
    if (!hit && r) {
      hit = active.find(p => r.includes(p.origin) || r.includes(p.destination) ||
        (p.destination && r.includes(p.destination.replace('קו ', ''))));
    }
    if (hit) {
      result.price = hit.price;
      result.source = `🎯 מחירון לקוח: ${c.name} (${hit.origin} → ${hit.destination})`;
      result.sourceTier = 1;
      result.listEntry = hit;
      return withHistoryStats(result, customerId, o, d, r);
    }
    // Tier 1b: destination-only / route-only (free-form Excel prices)
    if (!hit) {
      const key = normalizePlace(d || r || col);
      if (key) {
        hit = active.find(p => {
          const pd = normalizePlace(p.destination || '');
          const po = normalizePlace(p.origin || '');
          if (!pd && !po) return false;
          // empty origin in list = route label in destination
          if ((!p.origin || !String(p.origin).trim()) && pd && (key.includes(pd) || pd.includes(key) || key === pd)) return true;
          if (pd && (pd === key || key.includes(pd) || pd.includes(key))) return true;
          if (po && (po === key || key.includes(po))) return true;
          return false;
        });
      }
    }
    if (hit) {
      result.price = hit.price;
      result.source = `🎯 מחירון: ${hit.origin || hit.destination} → ${hit.destination}`;
      result.sourceTier = 1;
      result.listEntry = hit;
      return withHistoryStats(result, customerId, o, d, r);
    }
    // Tier 2: general / one-sided
    hit = active.find(p => placesMatch(p.origin, o) || placesMatch(p.destination, d));
    if (hit) {
      result.price = hit.price;
      result.source = `🎯 מחירון לקוח (התאמה חלקית): ${hit.origin} → ${hit.destination}`;
      result.sourceTier = 2;
      result.listEntry = hit;
      return withHistoryStats(result, customerId, o, d, r);
    }
  }

  // --- Tier 3: customer history ---
  const custHist = getRouteHistory(customerId, o, d, r, true);
  if (custHist.count >= 1) {
    result.price = custHist.last;
    result.source = `📊 היסטוריית לקוח: ממוצע ${formatMoney(custHist.avg)} · אחרון ${formatMoney(custHist.last)} (${custHist.count} נסיעות)`;
    result.sourceTier = 3;
    result.stats = custHist;
    return result;
  }

  // --- Tier 4: global route history ---
  const globalHist = getRouteHistory(null, o, d, r, true);
  if (globalHist.count >= 2) {
    result.price = globalHist.avg;
    result.source = `📊 היסטוריית מסלול: ממוצע ${formatMoney(globalHist.avg)} (${globalHist.count} נסיעות)`;
    result.sourceTier = 4;
    result.stats = globalHist;
    return result;
  }

  result.source = '⚪ אין מספיק נתונים להצעת מחיר';
  return result;
}

function withHistoryStats(result, customerId, o, d, r) {
  const hist = getRouteHistory(customerId, o, d, r, true);
  if (hist.count) result.stats = hist;
  return result;
}

function getRouteHistory(customerId, origin, destination, route, approvedOnly) {
  let trips = state.trips.filter(t => t.price > 0);
  // only use verified for pricing (source not excel-pending) – for now all manual/ai count
  if (customerId) trips = trips.filter(t => t.customerId === customerId);

  const o = normalizePlace(origin);
  const d = normalizePlace(destination);
  const r = normalizePlace(route);

  trips = trips.filter(t => {
    const to = normalizePlace(t.origin || '');
    const td = normalizePlace(t.destination || '');
    const tr = normalizePlace(t.route || '');
    if (o && d) {
      return (placesMatch(to, origin) && placesMatch(td, destination)) ||
             (tr.includes(o) && tr.includes(d));
    }
    if (r) {
      // token overlap
      const tokens = r.split(/\s+/).filter(x => x.length > 1);
      return tokens.length && tokens.every(tok => tr.includes(tok) || to.includes(tok) || td.includes(tok));
    }
    if (o) return placesMatch(to, origin) || tr.includes(o);
    return false;
  });

  if (!trips.length) return { count: 0, avg: 0, last: 0, min: 0, max: 0, median: 0 };

  const prices = trips.map(t => t.price).sort((a, b) => a - b);
  const sum = prices.reduce((a, b) => a + b, 0);
  const last = trips.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0].price;
  return {
    count: prices.length,
    avg: Math.round(sum / prices.length),
    last,
    min: prices[0],
    max: prices[prices.length - 1],
    median: prices[Math.floor(prices.length / 2)]
  };
}

function refreshPriceSuggestion() {
  const customerId = document.getElementById('formCustomer')?.value;
  const origin = document.getElementById('formOrigin')?.value || '';
  const destination = document.getElementById('formDestination')?.value || '';
  const route = document.getElementById('formRoute')?.value || '';
  const date = document.getElementById('formDate')?.value || '';

  const box = document.getElementById('priceSuggestionBox');
  if (!box) return;

  if (!customerId) {
    hidePriceBoxes();
    return;
  }

  const s = suggestPrice(customerId, origin, destination, route, date);
  _lastSuggestion = s;

  if (s.price != null) {
    box.classList.remove('hidden');
    document.getElementById('priceSuggestionMain').textContent = formatMoney(s.price);
    document.getElementById('priceSuggestionSource').textContent = s.source;
    let hint = '';
    if (s.stats && s.stats.count) {
      hint = `היסטוריה: אחרון ${formatMoney(s.stats.last)} · ממוצע ${formatMoney(s.stats.avg)} · מינ׳ ${formatMoney(s.stats.min)} · מקס׳ ${formatMoney(s.stats.max)} · ${s.stats.count} נסיעות`;
    }
    document.getElementById('priceHistoryHint').textContent = hint;
  } else {
    box.classList.remove('hidden');
    document.getElementById('priceSuggestionMain').textContent = '—';
    document.getElementById('priceSuggestionSource').textContent = s.source;
    document.getElementById('priceHistoryHint').textContent = '';
  }

  onPriceInput(); // update deviation
}

function applySuggestedPrice() {
  if (_lastSuggestion && _lastSuggestion.price != null) {
    document.getElementById('formPrice').value = _lastSuggestion.price;
    onPriceInput();
    toast('הוחל מחיר מוצע: ' + formatMoney(_lastSuggestion.price));
  }
}

function onPriceInput() {
  const price = parseFloat(document.getElementById('formPrice')?.value) || 0;
  const box = document.getElementById('priceDeviationBox');
  if (!box) return;
  const s = _lastSuggestion;
  if (!s || s.sourceTier > 2 || s.price == null || !price) {
    box.classList.add('hidden');
    return;
  }
  const diff = price - s.price;
  if (Math.abs(diff) < 0.5) {
    box.classList.add('hidden');
    return;
  }
  box.classList.remove('hidden');
  const pct = s.price ? Math.round((diff / s.price) * 100) : 0;
  document.getElementById('priceDeviationText').textContent =
    `מחירון: ${formatMoney(s.price)} · מחיר בפועל: ${formatMoney(price)} · חריגה: ${diff > 0 ? '+' : ''}${formatMoney(diff)} (${pct > 0 ? '+' : ''}${pct}%)`;
}

function onRouteFieldsChange() {
  // sync route from origin/dest if route empty-ish
  const o = document.getElementById('formOrigin')?.value.trim();
  const d = document.getElementById('formDestination')?.value.trim();
  const routeEl = document.getElementById('formRoute');
  if (o && d && routeEl && !routeEl.value.trim()) {
    routeEl.value = o + ' ' + d;
  }
  refreshPriceSuggestion();
  try { applyOrdererSuggestion(); } catch (_e) {}
}

function hidePriceBoxes() {
  document.getElementById('priceSuggestionBox')?.classList.add('hidden');
  document.getElementById('priceDeviationBox')?.classList.add('hidden');
  _lastSuggestion = null;
}

// ---- Price list editor ----
function renderPriceListEditor() {
  const box = document.getElementById('custPriceList');
  if (!box) return;
  if (!_editingPriceList.length) {
    box.innerHTML = '<p class="text-xs text-slate-400">אין מחירון – לחץ "+ מחיר"</p>';
    return;
  }
  box.innerHTML = _editingPriceList.map((p, i) => `
    <div class="grid grid-cols-12 gap-1 items-center text-xs border border-slate-200 rounded-lg p-1.5">
      <input data-i="${i}" data-f="origin" value="${escAttr(p.origin || '')}" placeholder="מוצא" class="col-span-3 border border-slate-200 rounded px-1.5 py-1" onchange="updatePriceListField(${i},'origin',this.value)" />
      <input data-i="${i}" data-f="destination" value="${escAttr(p.destination || '')}" placeholder="יעד" class="col-span-3 border border-slate-200 rounded px-1.5 py-1" onchange="updatePriceListField(${i},'destination',this.value)" />
      <input type="number" data-i="${i}" data-f="price" value="${p.price || ''}" placeholder="מחיר" class="col-span-2 border border-slate-200 rounded px-1.5 py-1" onchange="updatePriceListField(${i},'price',+this.value)" />
      <input data-i="${i}" data-f="tripType" value="${escAttr(p.tripType || 'רגיל')}" placeholder="סוג" class="col-span-2 border border-slate-200 rounded px-1.5 py-1" onchange="updatePriceListField(${i},'tripType',this.value)" />
      <label class="col-span-1 flex justify-center"><input type="checkbox" ${p.active !== false ? 'checked' : ''} onchange="updatePriceListField(${i},'active',this.checked)" title="פעיל" /></label>
      <button type="button" onclick="_editingPriceList.splice(${i},1);renderPriceListEditor()" class="col-span-1 text-red-500 text-center">✕</button>
    </div>
  `).join('');
}

function escAttr(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function updatePriceListField(i, field, val) {
  if (_editingPriceList[i]) _editingPriceList[i][field] = val;
}

function addPriceListRow() {
  _editingPriceList.push({
    id: 'pl_' + uid(),
    origin: '',
    destination: '',
    price: 0,
    tripType: 'רגיל',
    conditions: '',
    validFrom: '',
    validTo: '',
    notes: '',
    active: true
  });
  renderPriceListEditor();
}

function collectPriceListFromEditor() {
  return (_editingPriceList || []).filter(p => p.origin || p.destination || p.price).map(p => ({
    id: p.id || ('pl_' + uid()),
    origin: p.origin || '',
    destination: p.destination || '',
    price: Number(p.price) || 0,
    tripType: p.tripType || 'רגיל',
    conditions: p.conditions || '',
    validFrom: p.validFrom || '',
    validTo: p.validTo || '',
    notes: p.notes || '',
    active: p.active !== false
  }));
}

// ---- Place autocomplete ----
function refreshPlaceList() {
  const dl = document.getElementById('placeList');
  if (!dl) return;
  const places = new Set();
  Object.values(ABBREV_HINTS).forEach(p => places.add(p));
  Object.keys(ABBREV_HINTS).forEach(p => places.add(p));
  state.trips.forEach(t => {
    if (t.origin) places.add(t.origin);
    if (t.destination) places.add(t.destination);
    // split route tokens
    (t.route || '').split(/[\s→\-,]+/).forEach(x => {
      if (x.length > 1) places.add(x);
    });
  });
  state.customers.forEach(c => {
    (c.priceList || []).forEach(p => {
      if (p.origin) places.add(p.origin);
      if (p.destination) places.add(p.destination);
    });
  });
  dl.innerHTML = Array.from(places).sort((a, b) => a.localeCompare(b, 'he'))
    .map(p => `<option value="${escAttr(p)}">`).join('');
}

// enhance route suggestion click to also fill origin/dest when possible
function pickRouteSuggestion(route) {
  const el = document.getElementById('formRoute');
  if (el) el.value = route;
  const fo = document.getElementById('formOrigin');
  const fd = document.getElementById('formDestination');
  // Time-column style (קו גדול 08:00, פתיחה, הלוך...) – NOT origin/destination
  const isTimeCol = /^(קו\s|פתיחה|הלוך|חזור|\d{1,2}:\d{2})/.test(route) ||
    /\d{1,2}:\d{2}/.test(route) && !/\s(ים|בב|ספר|נתניה|אשדוד|שמש)\s/.test(route);
  if (isTimeCol) {
    if (fo) fo.value = '';
    if (fd) fd.value = '';
  } else {
    // Real route like "בב ים" → origin/destination
    const parts = route.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && fo && fd) {
      fo.value = parts[0];
      fd.value = parts.slice(1).join(' ');
    }
  }
  refreshPriceSuggestion();
}


// ============================================================
// Excel Import + Human Review Queue
// ============================================================
// excel import vars at top

const EXCEL_FIELD_HINTS = {
  date: [/תאריך/, /date/i, /יום/],
  price: [/מחיר/, /סכום/, /price/i, /סה.?כ/, /amount/i],
  route: [/תיאור/, /מסלול/, /יעד/, /פירוט/, /route/i, /description/i],
  origin: [/מוצא/, /מ$/, /^מ\s/, /מאיפה/, /from/i],
  destination: [/יעד/, /ל$/, /^ל\s/, /לאן/, /to/i],
  driver: [/נהג/, /מזמין/, /driver/i],
  notes: [/הערות/, /הערה/, /notes/i, /remark/i],
  customer: [/לקוח/, /customer/i, /שם/],
  line: [/קו/, /גיליון/, /line/i]
};

function startExcelImport() {
  const fileInput = document.getElementById('excelFile');
  const file = fileInput?.files?.[0];
  if (!file) { toast('בחר קובץ'); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array', cellDates: true });
      const sheets = wb.SheetNames.map(name => {
        const ws = wb.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
        return { name, rows };
      });
      _excelRaw = { sheets, fileName: file.name };
      // auto-detect customer from filename
      const fname = file.name.replace(/\.[^.]+$/, '');
      const matched = state.customers.find(c => fname.includes(c.name) || c.name.includes(fname.replace(/עותק של |אגוסט|ספטמבר|\d+/g,'').trim()));
      const sel = document.getElementById('excelCustomer');
      if (sel) {
        sel.innerHTML = '<option value="">— זהה מהקובץ / בחר —</option>';
        state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
          const o = document.createElement('option');
          o.value = c.id; o.textContent = c.name;
          if (matched && matched.id === c.id) o.selected = true;
          sel.appendChild(o);
        });
      }
      // Use first non-empty / non-summary sheet for mapping preview
      const main = sheets.find(s => s.rows.length > 1 && !/סה.?כ|סיכום|total/i.test(s.name)) || sheets[0];
      autoMapColumns(main);
      document.getElementById('excelMappingBox').classList.remove('hidden');
      document.getElementById('excelPendingBox').classList.add('hidden');
      toast('קובץ נטען: ' + sheets.length + ' גיליונות');
    } catch (err) {
      console.error(err);
      toast('שגיאה בקריאת הקובץ');
    }
  };
  reader.readAsArrayBuffer(file);
}

function autoMapColumns(sheet) {
  const headerRow = sheet.rows[0] || [];
  _excelMapping = {};
  const mappingHtml = ['<table class="min-w-full border-collapse"><thead><tr class="bg-slate-100">',
    '<th class="border px-2 py-1 text-right">עמודה בקובץ</th>',
    '<th class="border px-2 py-1 text-right">משמעות</th>',
    '<th class="border px-2 py-1 text-right">ביטחון</th></tr></thead><tbody>'];

  headerRow.forEach((h, i) => {
    if (h === '' || h == null) return;
    const hs = String(h).trim();
    let field = '';
    let conf = '⚪';
    for (const [f, patterns] of Object.entries(EXCEL_FIELD_HINTS)) {
      if (patterns.some(p => p.test(hs))) {
        field = f;
        conf = '🟢';
        break;
      }
    }
    // time-like headers (קו 08:00) -> treat as price columns in matrix sheets
    if (!field && (/קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור/.test(hs))) {
      field = 'priceCol:' + hs;
      conf = '🟢';
    }
    _excelMapping[i] = field || 'skip';
    const options = [
      ['skip','— דלג —'],['date','תאריך'],['price','מחיר'],['route','מסלול/תיאור'],
      ['origin','מוצא'],['destination','יעד'],['driver','מזמין'],['notes','הערות'],
      ['customer','לקוח'],['line','קו'],['priceCol:'+hs, 'עמודת מחיר: '+hs]
    ];
    const opts = options.map(([v,l]) =>
      `<option value="${v}" ${(_excelMapping[i]===v || (_excelMapping[i]||'').startsWith('priceCol') && v.startsWith('priceCol'))?'selected':''}>${l}</option>`
    ).join('');
    mappingHtml.push(`<tr>
      <td class="border px-2 py-1">${escAttr(hs)}</td>
      <td class="border px-2 py-1"><select data-col="${i}" onchange="_excelMapping[${i}]=this.value" class="border rounded px-1 py-0.5 text-xs w-full">${opts}</select></td>
      <td class="border px-2 py-1 text-center">${conf}</td>
    </tr>`);
  });
  mappingHtml.push('</tbody></table>');
  mappingHtml.push(`<p class="text-xs text-slate-400 mt-1">גיליון לדוגמה: ${sheet.name} · ${sheet.rows.length} שורות</p>`);
  document.getElementById('excelMappingTable').innerHTML = mappingHtml.join('');
}

function runExcelParse() {
  if (!_excelRaw) return;
  const customerId = document.getElementById('excelCustomer')?.value || '';
  const batchId = 'IMP-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6);
  _importBatchId = batchId;
  _importPending = [];

  _excelRaw.sheets.forEach(sheet => {
    if (/סה.?כ|סיכום|total/i.test(sheet.name)) return;
    const rows = sheet.rows;
    if (!rows.length) return;
    const header = rows[0];

    // Detect matrix style (date + multiple price columns)
    const priceCols = [];
    Object.entries(_excelMapping).forEach(([idx, field]) => {
      if (String(field).startsWith('priceCol:')) {
        priceCols.push({ idx: +idx, name: String(field).replace('priceCol:', '') });
      }
    });
    // Also re-detect from header for this sheet
    header.forEach((h, i) => {
      const hs = String(h||'').trim();
      if (/קו\s*\d|^\d{1,2}:\d{2}|פתיחה|הלוך|חזור|ראש העין/.test(hs) && !priceCols.some(p => p.idx === i)) {
        priceCols.push({ idx: i, name: hs });
      }
    });

    const dateIdx = Object.entries(_excelMapping).find(([i,f]) => f === 'date');
    const dateCol = dateIdx ? +dateIdx[0] : 0;

    if (priceCols.length >= 1) {
      // Matrix sheet: each price cell = one trip
      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || !row.length) continue;
        const rawDate = row[dateCol];
        const date = parseExcelDate(rawDate);
        if (!date) continue;
        priceCols.forEach(pc => {
          const val = row[pc.idx];
          const price = parseFloat(String(val).replace(/[^\d.]/g, ''));
          if (!price || isNaN(price)) return;
          _importPending.push(makePending({
            date, price,
            route: `${sheet.name} · ${pc.name}`,
            line: sheet.name,
            columnKey: pc.name,
            origin: sheet.name,
            destination: pc.name,
            notes: '',
            driver: '',
            customerId,
            sheet: sheet.name
          }));
        });
      }
    } else {
      // Flat list sheet
      const fieldOf = (name) => {
        const e = Object.entries(_excelMapping).find(([i,f]) => f === name);
        return e ? +e[0] : -1;
      };
      const iDate = fieldOf('date') >= 0 ? fieldOf('date') : 0;
      const iPrice = fieldOf('price');
      const iRoute = fieldOf('route');
      const iOrigin = fieldOf('origin');
      const iDest = fieldOf('destination');
      const iDriver = fieldOf('driver');
      const iNotes = fieldOf('notes');

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || !row.length) continue;
        const date = parseExcelDate(row[iDate]);
        const price = iPrice >= 0 ? parseFloat(String(row[iPrice]||'').replace(/[^\d.]/g,'')) : 0;
        const route = iRoute >= 0 ? String(row[iRoute]||'').trim() : '';
        if (!date && !price && !route) continue;
        _importPending.push(makePending({
          date: date || state.workingMonth + '-01',
          price: price || 0,
          route,
          origin: iOrigin >= 0 ? String(row[iOrigin]||'') : '',
          destination: iDest >= 0 ? String(row[iDest]||'') : '',
          driver: iDriver >= 0 ? String(row[iDriver]||'') : '',
          notes: iNotes >= 0 ? String(row[iNotes]||'') : '',
          line: sheet.name,
          columnKey: '',
          customerId,
          sheet: sheet.name
        }));
      }
    }
  });

  // status classification
  _importPending.forEach(p => {
    if (!p.date || !p.price) p.status = 'error';
    else if (!p.customerId) p.status = 'warn';
    else p.status = 'ok';
    // dup check
    if (p.status !== 'error') {
      const dups = state.trips.filter(t =>
        t.date === p.date && Math.abs((t.price||0)-(p.price||0))<0.01 &&
        (t.route||'') === (p.route||'') &&
        (!p.customerId || t.customerId === p.customerId)
      );
      if (dups.length) { p.status = 'warn'; p.dup = true; }
    }
  });

  renderPendingTable();
  document.getElementById('excelPendingBox').classList.remove('hidden');
  toast(`${_importPending.length} רשומות מוכנות לבדיקה`);
}

function makePending(fields) {
  return {
    id: 'pend_' + uid(),
    importBatchId: _importBatchId,
    source: 'excel',
    reviewStatus: 'pending',
    status: 'ok',
    dup: false,
    ...fields
  };
}

function parseExcelDate(v) {
  if (!v) return null;
  if (v instanceof Date) {
    return v.toISOString().slice(0,10);
  }
  const s = String(v).trim();
  // ISO
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  // DD/MM/YYYY
  m = s.match(/(\d{1,2})[\/\.](\d{1,2})[\/\.](\d{2,4})/);
  if (m) {
    const y = m[3].length === 2 ? '20'+m[3] : m[3];
    return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  }
  // Hebrew: יום ראשון, 2 באוגוסט 2026
  const monthsHe = {
    'ינואר':1,'פברואר':2,'מרץ':3,'מרס':3,'אפריל':4,'מאי':5,'יוני':6,
    'יולי':7,'אוגוסט':8,'ספטמבר':9,'אוקטובר':10,'נובמבר':11,'דצמבר':12
  };
  m = s.match(/(\d{1,2})\s+ב?([א-ת]+)\s+(\d{4})/);
  if (m && monthsHe[m[2]]) {
    return `${m[3]}-${String(monthsHe[m[2]]).padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  }
  // Excel serial as number string
  const n = parseFloat(s);
  if (n > 30000 && n < 60000) {
    const d = new Date(Date.UTC(1899, 11, 30) + n * 86400000);
    return d.toISOString().slice(0,10);
  }
  return null;
}

function renderPendingTable() {
  const box = document.getElementById('excelPendingTable');
  if (!box) return;
  const ok = _importPending.filter(p => p.status === 'ok').length;
  const warn = _importPending.filter(p => p.status === 'warn').length;
  const err = _importPending.filter(p => p.status === 'error').length;
  document.getElementById('excelPendingCount').textContent = `(${_importPending.length})`;
  document.getElementById('statOk').textContent = `🟢 ${ok}`;
  document.getElementById('statWarn').textContent = `🟡 ${warn}`;
  document.getElementById('statErr').textContent = `🔴 ${err}`;

  let html = `<table class="min-w-full border-collapse">
    <thead class="sticky top-0 bg-slate-100"><tr>
      <th class="border px-2 py-1">סטטוס</th>
      <th class="border px-2 py-1">תאריך</th>
      <th class="border px-2 py-1">קו</th>
      <th class="border px-2 py-1">מסלול</th>
      <th class="border px-2 py-1">מחיר</th>
      <th class="border px-2 py-1">מזמין</th>
      <th class="border px-2 py-1">פעולות</th>
    </tr></thead><tbody>`;

  _importPending.forEach((p, i) => {
    const st = p.status === 'ok' ? '🟢' : p.status === 'warn' ? '🟡' : '🔴';
    const bg = p.status === 'error' ? 'bg-red-50' : p.dup ? 'bg-amber-50' : '';
    html += `<tr class="${bg}">
      <td class="border px-2 py-1 text-center">${st}${p.dup?' כפיל':''}</td>
      <td class="border px-1 py-0.5"><input type="date" value="${p.date||''}" onchange="_importPending[${i}].date=this.value" class="border-0 text-xs w-28"/></td>
      <td class="border px-2 py-1">${escAttr(p.line||'')}</td>
      <td class="border px-1 py-0.5"><input value="${escAttr(p.route||'')}" onchange="_importPending[${i}].route=this.value" class="border-0 text-xs w-36"/></td>
      <td class="border px-1 py-0.5"><input type="number" value="${p.price||''}" onchange="_importPending[${i}].price=+this.value" class="border-0 text-xs w-16 text-center"/></td>
      <td class="border px-1 py-0.5"><input value="${escAttr(p.driver||'')}" onchange="_importPending[${i}].driver=this.value" class="border-0 text-xs w-20"/></td>
      <td class="border px-1 py-0.5 whitespace-nowrap">
        <button onclick="approvePending(${i})" class="text-emerald-600 hover:underline px-1">✓</button>
        <button onclick="rejectPending(${i})" class="text-red-500 hover:underline px-1">✕</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  box.innerHTML = html;
}

function approvePending(i) {
  const p = _importPending[i];
  if (!p) return;
  commitPending(p);
  _importPending.splice(i, 1);
  renderPendingTable();
  toast('אושר');
}

function rejectPending(i) {
  _importPending.splice(i, 1);
  renderPendingTable();
}

function commitPending(p) {
  let cid = p.customerId || document.getElementById('excelCustomer')?.value;
  if (!cid) {
    // try match customer by name in route – skip, require selection
    cid = document.getElementById('excelCustomer')?.value;
  }
  if (!cid) {
    toast('בחר לקוח לפני אישור');
    return false;
  }
  const _trip = {
    id: uid(),
    customerId: cid,
    line: p.line || '',
    columnKey: p.columnKey || '',
    date: p.date,
    price: p.price || 0,
    route: p.route || '',
    origin: p.origin || '',
    destination: p.destination || '',
    notes: p.notes || '',
    driver: p.driver || '',
    source: 'excel',
    importBatchId: p.importBatchId,
    reviewStatus: 'approved',
    reviewedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  state.trips.unshift(_trip);
  toastLearned(learnFromTrip(_trip));
  saveState();
  return true;
}

function approveAllPending() {
  const cid = document.getElementById('excelCustomer')?.value;
  if (!cid) { toast('בחר לקוח לפני אישור'); return; }
  let n = 0;
  const remain = [];
  _importPending.forEach(p => {
    if (p.status === 'error') { remain.push(p); return; }
    p.customerId = cid;
    if (commitPending(p)) n++;
    else remain.push(p);
  });
  _importPending = remain;
  renderPendingTable();
  toast(`אושרו ${n} רשומות`);
  renderTrips();
  renderCustomers();
}

function rejectAllPending() {
  if (!confirm('לדחות את כל הרשומות הממתינות?')) return;
  _importPending = [];
  renderPendingTable();
  toast('נדחו');
}


// ============================================================
// Multi-day calendar picker (Sun–Sat)
// ============================================================
// _calSelectedDays declared at top

function renderDayCalendar() {
  const box = document.getElementById('dayCalendar');
  if (!box) return;
  const month = state.workingMonth || currentMonthStr();
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  // First day of month – JS: 0=Sun ... 6=Sat (Israel week starts Sunday)
  const firstDow = new Date(y, mo - 1, 1).getDay();

  let html = `<div class="grid grid-cols-7 gap-1 text-center text-xs mb-1">
    <div class="text-slate-400 font-medium py-1">א׳</div>
    <div class="text-slate-400 font-medium py-1">ב׳</div>
    <div class="text-slate-400 font-medium py-1">ג׳</div>
    <div class="text-slate-400 font-medium py-1">ד׳</div>
    <div class="text-slate-400 font-medium py-1">ה׳</div>
    <div class="text-slate-400 font-medium py-1 text-orange-500">ו׳</div>
    <div class="text-slate-400 font-medium py-1 text-orange-600">ש׳</div>`;

  for (let i = 0; i < firstDow; i++) {
    html += `<div></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${month}-${String(d).padStart(2, '0')}`;
    const dt = new Date(y, mo - 1, d);
    const dow = dt.getDay();
    const selected = _calSelectedDays.has(ds);
    const we = dow === 5 || dow === 6;
    html += `<button type="button" data-day="${ds}" onclick="calToggleDay('${ds}')"
      class="cal-day aspect-square rounded-lg text-sm font-medium transition
        ${selected ? 'bg-indigo-600 text-white shadow' : we ? 'bg-orange-50 text-orange-800 hover:bg-orange-100' : 'bg-slate-50 hover:bg-indigo-50 text-slate-700'}">
      ${d}</button>`;
  }
  html += `</div>
    <div class="text-xs text-slate-400 text-center">${month} · לחץ לבחירת ימים (ניתן כמה)</div>`;
  box.innerHTML = html;
  updateCalLabel();
}

function calToggleDay(ds) {
  if (_calSelectedDays.has(ds)) _calSelectedDays.delete(ds);
  else _calSelectedDays.add(ds);
  // sync single date to first selected
  if (_calSelectedDays.size === 1) {
    document.getElementById('formDate').value = Array.from(_calSelectedDays)[0];
  }
  renderDayCalendar();
}

function calSelectWeekdays() {
  const month = state.workingMonth || currentMonthStr();
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  _calSelectedDays = new Set();
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(y, mo - 1, d).getDay();
    if (dow >= 0 && dow <= 4) { // Sun-Thu
      _calSelectedDays.add(`${month}-${String(d).padStart(2, '0')}`);
    }
  }
  renderDayCalendar();
}

function calClearDays() {
  _calSelectedDays = new Set();
  renderDayCalendar();
}

function updateCalLabel() {
  const n = _calSelectedDays.size;
  const text = !n ? 'יום בודד מהתאריך למעלה' : `נבחרו ${n} ימים`;
  const el = document.getElementById('calSelectedLabel');
  if (el) el.textContent = text;
  const hint = document.getElementById('calModalHint');
  if (hint) hint.textContent = !n ? 'בחר ימים בלוח או א׳–ה׳' : `נבחרו ${n} ימים – יישמרו כנסיעות נפרדות`;
}

function openDayCalendarModal() {
  renderDayCalendar();
  const m = document.getElementById('dayCalModal');
  if (!m) return;
  m.classList.remove('hidden');
  m.classList.add('flex');
}

function closeDayCalendarModal() {
  const m = document.getElementById('dayCalModal');
  if (!m) return;
  m.classList.add('hidden');
  m.classList.remove('flex');
  updateCalLabel();
}

function calSelectAll() {
  const month = state.workingMonth || currentMonthStr();
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  _calSelectedDays = new Set();
  for (let d = 1; d <= daysInMonth; d++) {
    _calSelectedDays.add(`${month}-${String(d).padStart(2,'0')}`);
  }
  renderDayCalendar();
}

function onFormDateChange() {
  const d = document.getElementById('formDate').value;
  if (d) {
    _calSelectedDays = new Set([d]);
    renderDayCalendar();
  }
}

// Seed default price lists for customers missing them (from typical routes + known rates)

function seedAllExcelPrices(force) {
  let n = 0;
  Object.entries(EXCEL_PRICE_SEEDS).forEach(([cid, items]) => {
    const c = getCustomer(cid);
    if (!c) return;
    if (!c.priceList) c.priceList = [];
    items.forEach(item => {
      if (!item.price || item.price <= 0) return;
      const exists = c.priceList.find(p =>
        placesMatch(p.origin || '', item.origin || '') &&
        placesMatch(p.destination || '', item.destination || '')
      );
      // also match by destination only for free-form
      const exists2 = !exists && !item.origin && c.priceList.find(p =>
        placesMatch(p.destination || '', item.destination || '') ||
        placesMatch(p.origin || '', item.destination || '')
      );
      if (exists) {
        if (force || !exists.price || exists.price === 0) {
          exists.price = item.price;
          exists.active = true;
          n++;
        }
      } else if (!exists2) {
        c.priceList.push({
          id: 'pl_xl_' + uid(),
          origin: item.origin || '',
          destination: item.destination,
          price: item.price,
          tripType: 'רגיל',
          active: true,
          notes: 'מהאקסל'
        });
        n++;
      }
    });
    // typical routes from destinations
    if (!c.typicalRoutes) c.typicalRoutes = [];
    items.forEach(item => {
      const r = item.destination;
      if (r && !c.typicalRoutes.includes(r) && !/^\d{2}:\d{2}$/.test(r) && !/^קו |פתיחה|הלוך|חזור/.test(r)) {
        c.typicalRoutes.push(r);
      }
    });
  });
  if (n) saveState();
  return n;
}

function seedMissingPriceLists() {
  const defaults = {
    perach: null, // already has
  };
  // Common route prices
  const common = [
    { origin: 'בני ברק', destination: 'ירושלים', price: 200 },
    { origin: 'ירושלים', destination: 'בני ברק', price: 200 },
    { origin: 'בני ברק', destination: 'נתניה', price: 180 },
    { origin: 'נתניה', destination: 'בני ברק', price: 180 },
    { origin: 'בני ברק', destination: 'מודיעין עילית', price: 150 },
    { origin: 'מודיעין עילית', destination: 'בני ברק', price: 150 },
    { origin: 'בני ברק', destination: 'בית שמש', price: 160 },
    { origin: 'בית שמש', destination: 'בני ברק', price: 160 },
    { origin: 'בני ברק', destination: 'אשדוד', price: 220 },
    { origin: 'אשדוד', destination: 'בני ברק', price: 220 },
    { origin: 'בני ברק', destination: 'חולון', price: 140 },
    { origin: 'חולון', destination: 'בני ברק', price: 140 },
  ];
  let changed = false;
  state.customers.forEach(c => {
    if (!c.priceList) c.priceList = [];
    if (c.priceList.length > 0) return;
    // Build from typicalRoutes
    const routes = c.typicalRoutes || [];
    const list = [];
    routes.forEach((r, i) => {
      if (/קו\s|^\d{1,2}:|פתיחה|הלוך/.test(r)) {
        // time column – use as destination label under line
        list.push({
          id: 'pl_auto_' + c.id + '_' + i,
          origin: (c.lines && c.lines[0]) || c.name,
          destination: r,
          price: 0, // unknown – user fills
          tripType: 'רגיל',
          active: false,
          notes: 'טיוטה – עדכן מחיר'
        });
      } else {
        const parts = r.split(/\s+/);
        if (parts.length >= 2) {
          const hit = common.find(x =>
            (normalizePlace(parts[0]).includes(normalizePlace(x.origin).slice(0, 3)) ||
             normalizePlace(x.origin).includes(normalizePlace(parts[0]))) &&
            (normalizePlace(parts[1]).includes(normalizePlace(x.destination).slice(0, 3)) ||
             normalizePlace(x.destination).includes(normalizePlace(parts[1])))
          );
          list.push({
            id: 'pl_auto_' + c.id + '_' + i,
            origin: parts[0],
            destination: parts.slice(1).join(' '),
            price: hit ? hit.price : 0,
            tripType: 'רגיל',
            active: !!hit,
            notes: hit ? 'מחירון בסיס' : 'טיוטה – עדכן מחיר'
          });
        }
      }
    });
    // Always add a few common baselines
    if (!list.length) {
      common.slice(0, 4).forEach((x, i) => {
        list.push({
          id: 'pl_base_' + c.id + '_' + i,
          origin: x.origin,
          destination: x.destination,
          price: x.price,
          tripType: 'רגיל',
          active: true,
          notes: 'מחירון בסיס'
        });
      });
    }
    c.priceList = list;
    changed = true;
  });
  // Ensure perach has full list from schema if empty prices
  const perach = state.customers.find(c => c.id === 'perach');
  if (perach) {
    const schemas = DEFAULT_LINE_SCHEMAS.perach || {};
    const known = {
      'בני ברק|קו גדול 08:00': 320, 'בני ברק|קו 14:00': 320, 'בני ברק|קו 15:30': 170,
      'אשדוד בי|פתיחה': 300, 'אשדוד בי|קו 08:00': 420, 'אשדוד בי|קו 14:00': 300,
      'אשדוד בי|קו 15:30': 340, 'אשדוד בי|קו 16:45': 350,
      'מודיעין עילית|פתיחה': 320, 'מודיעין עילית|קו 08:00': 500, 'מודיעין עילית|קו 14:00': 500,
      'מודיעין עילית|קו 16:45': 300,
      'אלעד רעננה|הלוך': 190, 'אלעד רעננה|חזור': 180,
      'נתניה רעננה|07:00': 390, 'נתניה רעננה|13:00': 240, 'נתניה רעננה|14:00': 240, 'נתניה רעננה|16:45': 240,
      'בני ברק|ירושלים': 200, 'ירושלים|בני ברק': 200
    };
    if (!perach.priceList) perach.priceList = [];
    Object.entries(schemas).forEach(([line, cols]) => {
      cols.forEach(col => {
        const key = line + '|' + col;
        const exists = perach.priceList.some(p => p.origin === line && p.destination === col);
        if (!exists) {
          perach.priceList.push({
            id: 'pl_p_' + line + '_' + col,
            origin: line,
            destination: col,
            price: known[key] || 0,
            tripType: 'רגיל',
            active: !!(known[key]),
            notes: known[key] ? 'מאקסל פרח' : 'עדכן מחיר'
          });
          changed = true;
        }
      });
    });
  }
  if (changed) saveState();
  return changed;
}


// ============================================================
// Upgrade pack: dashboard, reports, export sheets, backup,
// batch cancel, column suggestions, WhatsApp price check
// ============================================================

function quickEditPrice(id, val) {
  const t = state.trips.find(x => x.id === id);
  if (!t) return;
  t.price = parseFloat(val) || 0;
  t.updatedAt = new Date().toISOString();
  saveState();
  toast('מחיר עודכן');
  renderTrips();
}

function onFormLineChange() {
  const cid = document.getElementById('formCustomer')?.value;
  const line = document.getElementById('formLine')?.value;
  const columnRow = document.getElementById('columnRow');
  const formColumn = document.getElementById('formColumn');
  const chips = document.getElementById('columnChips');
  if (!formColumn) return;

  const cols = (cid && line) ? (getLineSchema(cid, line) || []) : [];
  formColumn.innerHTML = '<option value="">— בחר שעה / עמודה —</option>';
  if (chips) chips.innerHTML = '';

  if (cols.length && columnRow) {
    columnRow.classList.remove('hidden');
    const hasHaloch = cols.some(c => /הלוך/.test(c));
    const hasHazor = cols.some(c => /חזור/.test(c));
    cols.forEach(col => {
      const opt = document.createElement('option');
      opt.value = col;
      opt.textContent = col;
      formColumn.appendChild(opt);
    });
    // Combo: הלוך+חזור in one action
    if (hasHaloch && hasHazor) {
      const optBoth = document.createElement('option');
      optBoth.value = '__BOTH_HALOCH_HAZOR__';
      optBoth.textContent = 'הלוך + חזור (שתי נסיעות)';
      formColumn.appendChild(optBoth);
    }
    if (chips) {
      cols.forEach(col => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-100';
        btn.textContent = col;
        btn.onclick = () => {
          formColumn.value = col;
          onFormColumnChange();
        };
        chips.appendChild(btn);
      });
      if (hasHaloch && hasHazor) {
        const btnBoth = document.createElement('button');
        btnBoth.type = 'button';
        btnBoth.className = 'text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium';
        btnBoth.textContent = 'הלוך + חזור';
        btnBoth.onclick = () => {
          formColumn.value = '__BOTH_HALOCH_HAZOR__';
          onFormColumnChange();
        };
        chips.appendChild(btnBoth);
      }
    }
  } else if (columnRow) {
    columnRow.classList.add('hidden');
  }
  refreshPriceSuggestion();
  renderColumnSuggestions();
}

function onFormColumnChange() {
  const cid = document.getElementById('formCustomer')?.value;
  const line = document.getElementById('formLine')?.value || '';
  const col = document.getElementById('formColumn')?.value || '';
  if (!col) return;
  const routeEl = document.getElementById('formRoute');
  const fo = document.getElementById('formOrigin');
  const fd = document.getElementById('formDestination');
  const date = document.getElementById('formDate')?.value;

  if (col === '__BOTH_HALOCH_HAZOR__') {
    if (routeEl) routeEl.value = line ? `${line} · הלוך+חזור` : 'הלוך+חזור';
    if (fo) fo.value = line || '';
    if (fd) fd.value = 'הלוך+חזור';
    // price: try הלוך first, else sum if both priced
    const s1 = suggestPrice(cid, line, 'הלוך', 'הלוך', date, line, 'הלוך');
    const s2 = suggestPrice(cid, line, 'חזור', 'חזור', date, line, 'חזור');
    let p = 0;
    if (s1 && s1.price) p += s1.price;
    if (s2 && s2.price) p += s2.price;
    if (p) {
      document.getElementById('formPrice').value = p;
      _lastSuggestion = s1.price ? s1 : s2;
    }
    refreshPriceSuggestion();
    applyOrdererSuggestion();
    return;
  }

  if (routeEl) routeEl.value = line ? `${line} · ${col}` : col;
  if (fo) fo.value = line || '';
  if (fd) fd.value = col;
  const s = suggestPrice(cid, line, col, col, date, line, col);
  if (s && s.price) {
    document.getElementById('formPrice').value = s.price;
    _lastSuggestion = s;
  }
  refreshPriceSuggestion();
  applyOrdererSuggestion();
}

function renderColumnSuggestions() {
  // chips are rendered in onFormLineChange; keep route suggestions separate
  const box = document.getElementById('routeSuggestions');
  if (!box) return;
  const cid = document.getElementById('formCustomer')?.value;
  const line = document.getElementById('formLine')?.value;
  if (!cid || !line) return;
  const cols = getLineSchema(cid, line) || [];
  if (!cols.length) return;
  // also show under route suggestions for discoverability
  const existing = box.querySelector('[data-col-label]');
  if (existing) return;
}

function renderDashboard() {
  const month = state.workingMonth;
  const trips = state.trips.filter(t => t.date && t.date.startsWith(month));
  const revenue = trips.reduce((s, t) => s + (t.price || 0), 0);
  const custIds = new Set(trips.map(t => t.customerId));
  const avg = trips.length ? Math.round(revenue / trips.length) : 0;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('dashRevenue', formatMoney(revenue));
  set('dashTrips', String(trips.length));
  set('dashCustomers', String(custIds.size));
  set('dashAvg', formatMoney(avg));

  // by customer
  const byC = {};
  trips.forEach(t => {
    if (!byC[t.customerId]) byC[t.customerId] = { n: 0, sum: 0 };
    byC[t.customerId].n++;
    byC[t.customerId].sum += t.price || 0;
  });
  const boxC = document.getElementById('dashByCustomer');
  if (boxC) {
    boxC.innerHTML = Object.entries(byC)
      .sort((a, b) => b[1].sum - a[1].sum)
      .map(([id, v]) => {
        const name = getCustomer(id).name;
        return `<div class="flex justify-between border-b border-slate-100 py-1.5"><span>${name} <span class="text-slate-400">(${v.n})</span></span><span class="font-semibold">${formatMoney(v.sum)}</span></div>`;
      }).join('') || '<p class="text-slate-400">אין נתונים</p>';
  }

  const byR = {};
  trips.forEach(t => {
    const key = t.route || t.columnKey || t.line || '—';
    if (!byR[key]) byR[key] = { n: 0, sum: 0 };
    byR[key].n++;
    byR[key].sum += t.price || 0;
  });
  const boxR = document.getElementById('dashRoutes');
  if (boxR) {
    boxR.innerHTML = Object.entries(byR)
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 20)
      .map(([r, v]) => `<div class="flex justify-between border-b border-slate-100 py-1.5"><span class="truncate max-w-[70%]">${r}</span><span class="text-slate-600">${v.n} · ${formatMoney(v.sum / v.n)}</span></div>`)
      .join('') || '<p class="text-slate-400">אין נתונים</p>';
  }
}

function populateAnalysisCustomer() {
  const el = document.getElementById('analysisCustomer');
  if (!el) return;
  const cur = el.value;
  el.innerHTML = '<option value="">— בחר לקוח —</option>';
  state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    el.appendChild(o);
  });
  if (cur) el.value = cur;
}

function renderDeviations() {
  const box = document.getElementById('deviationsTable');
  if (!box) return;
  const month = state.workingMonth;
  const rows = state.trips.filter(t =>
    t.date && t.date.startsWith(month) &&
    t.listPrice != null && Math.abs((t.price || 0) - t.listPrice) > 0.5
  );
  if (!rows.length) {
    box.innerHTML = '<p class="text-slate-400">אין חריגות החודש (או שאין מחירון משויך לנסיעות)</p>';
    return;
  }
  box.innerHTML = `<table class="min-w-full border-collapse text-xs">
    <thead><tr class="bg-slate-50">
      <th class="border px-2 py-1 text-right">תאריך</th>
      <th class="border px-2 py-1 text-right">לקוח</th>
      <th class="border px-2 py-1 text-right">מסלול</th>
      <th class="border px-2 py-1 text-right">מחירון</th>
      <th class="border px-2 py-1 text-right">בפועל</th>
      <th class="border px-2 py-1 text-right">חריגה</th>
    </tr></thead><tbody>` +
    rows.map(t => {
      const diff = (t.price || 0) - t.listPrice;
      return `<tr>
        <td class="border px-2 py-1">${formatDate(t.date)}</td>
        <td class="border px-2 py-1">${getCustomer(t.customerId).name}</td>
        <td class="border px-2 py-1">${t.route || t.columnKey || ''}</td>
        <td class="border px-2 py-1">${formatMoney(t.listPrice)}</td>
        <td class="border px-2 py-1">${formatMoney(t.price)}</td>
        <td class="border px-2 py-1 font-semibold ${diff>0?'text-amber-700':'text-blue-700'}">${diff>0?'+':''}${formatMoney(diff)}</td>
      </tr>`;
    }).join('') + '</tbody></table>';
}

function renderCustomerAnalysis() {
  const box = document.getElementById('customerAnalysis');
  const cid = document.getElementById('analysisCustomer')?.value;
  if (!box) return;
  if (!cid) { box.innerHTML = '<p class="text-slate-400">בחר לקוח</p>'; return; }
  const c = getCustomer(cid);
  const month = state.workingMonth;
  const trips = state.trips.filter(t => t.customerId === cid && t.date && t.date.startsWith(month));
  const all = state.trips.filter(t => t.customerId === cid);
  const sum = trips.reduce((s,t)=>s+(t.price||0),0);
  const avg = trips.length ? Math.round(sum/trips.length) : 0;
  const last = all.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0];
  const routes = {};
  trips.forEach(t => { const k=t.route||t.columnKey||'—'; routes[k]=(routes[k]||0)+1; });
  const top = Object.entries(routes).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const pl = (c.priceList||[]).filter(p=>p.active!==false && p.price>0);
  const devs = trips.filter(t => t.listPrice!=null && Math.abs(t.price-t.listPrice)>0.5).length;
  box.innerHTML = `
    <div class="grid sm:grid-cols-2 gap-2">
      <div class="bg-slate-50 rounded-xl p-3">נסיעות החודש: <b>${trips.length}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">הכנסות: <b>${formatMoney(sum)}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">ממוצע: <b>${formatMoney(avg)}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">נסיעה אחרונה: <b>${last ? formatDate(last.date) : '—'}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">מחירון פעיל: <b>${pl.length}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">חריגות החודש: <b>${devs}</b></div>
    </div>
    <div class="mt-3"><div class="font-medium mb-1">מסלולים נפוצים</div>
      ${top.map(([r,n])=>`<div class="flex justify-between py-1 border-b border-slate-100"><span>${r}</span><span>${n}</span></div>`).join('')||'—'}
    </div>`;
}

function renderRouteAnalysis() {
  const box = document.getElementById('routeAnalysis');
  const q = (document.getElementById('analysisRoute')?.value || '').trim().toLowerCase();
  if (!box) return;
  if (!q) { box.innerHTML = '<p class="text-slate-400">הקלד מסלול או שעת קו</p>'; return; }
  const trips = state.trips.filter(t => {
    const hay = `${t.route||''} ${t.columnKey||''} ${t.line||''} ${t.origin||''} ${t.destination||''}`.toLowerCase();
    return hay.includes(q);
  });
  if (!trips.length) { box.innerHTML = '<p class="text-slate-400">לא נמצאו נסיעות</p>'; return; }
  const prices = trips.map(t=>t.price||0).filter(p=>p>0).sort((a,b)=>a-b);
  const sum = prices.reduce((a,b)=>a+b,0);
  const custs = new Set(trips.map(t=>t.customerId));
  box.innerHTML = `
    <div class="grid sm:grid-cols-2 gap-2">
      <div class="bg-slate-50 rounded-xl p-3">נסיעות: <b>${trips.length}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">לקוחות: <b>${custs.size}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">ממוצע: <b>${formatMoney(prices.length?Math.round(sum/prices.length):0)}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">אחרון: <b>${formatMoney(prices[prices.length-1]||0)}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">מינ׳: <b>${formatMoney(prices[0]||0)}</b></div>
      <div class="bg-slate-50 rounded-xl p-3">מקס׳: <b>${formatMoney(prices[prices.length-1]||0)}</b></div>
    </div>`;
}

// --- Export multi-sheet like original Excel for multi-line customers ---
function exportCustomerExcelLike(customerId, month) {
  const c = getCustomer(customerId);
  const trips = state.trips.filter(t => t.customerId === customerId && t.date && t.date.startsWith(month));
  const wb = XLSX.utils.book_new();
  const lines = (c.lines && c.lines.length) ? c.lines : ['כללי'];

  lines.forEach(line => {
    const cols = getLineSchema(customerId, line);
    const lineTrips = trips.filter(t => t.line === line || (!t.line && line === 'כללי') || (t.route||'').includes(line));
    if (cols && cols.length) {
      const [y, mo] = month.split('-').map(Number);
      const daysInMonth = new Date(y, mo, 0).getDate();
      const dayNames = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];
      const header = ['תאריך', ...cols, 'סה״כ'];
      const rows = [header];
      for (let day = 1; day <= daysInMonth; day++) {
        const ds = `${month}-${String(day).padStart(2,'0')}`;
        const dt = new Date(y, mo-1, day);
        const label = `יום ${dayNames[dt.getDay()]}, ${day}/${mo}/${y}`;
        const row = [label];
        let daySum = 0;
        cols.forEach(col => {
          const sum = lineTrips.filter(t => t.date === ds && (
            t.columnKey === col || (t.route||'').includes(col) || (t.destination||'') === col
          )).reduce((s,t)=>s+(t.price||0),0);
          row.push(sum || '');
          daySum += sum;
        });
        row.push(daySum || '');
        rows.push(row);
      }
      // totals + VAT like Excel
      const colTotals = cols.map((_, ci) => {
        let s = 0;
        for (let r = 1; r < rows.length; r++) {
          const v = parseFloat(rows[r][ci + 1]) || 0;
          s += v;
        }
        return s;
      });
      const g = colTotals.reduce((a,b)=>a+b,0);
      const vatR = state.defaultVat || 18;
      const useVat = c.vat !== false;
      rows.push(['סה״כ לפני מע״מ', ...colTotals.map(x=>x||''), g||'']);
      if (useVat) {
        const vatCols = colTotals.map(x => x ? Math.round(x*(vatR/100)*100)/100 : '');
        const vatG = Math.round(g*(vatR/100)*100)/100;
        rows.push(['מע״מ '+vatR+'%', ...vatCols, vatG||'']);
        rows.push(['סה״כ כולל מע״מ', ...colTotals.map(x => x ? Math.round(x*(1+vatR/100)*100)/100 : ''), g ? Math.round(g*(1+vatR/100)*100)/100 : '']);
      }
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, line.slice(0, 31));
    } else {
      const rows = [['תאריך','מסלול','מחיר','מזמין','הערות']];
      lineTrips.forEach(t => rows.push([t.date, t.route||'', t.price||0, t.driver||'', t.notes||'']));
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, (line || 'כללי').slice(0, 31));
    }
  });

  // summary sheet
  const sumRows = [['קו','נסיעות','סה״כ']];
  lines.forEach(line => {
    const lt = trips.filter(t => t.line === line || (t.route||'').includes(line));
    sumRows.push([line, lt.length, lt.reduce((s,t)=>s+(t.price||0),0)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sumRows), 'סהכ');
  XLSX.writeFile(wb, `${c.name}_${month}.xlsx`);
}

// Hook into existing export if present
function exportSelectedCustomers() {
  const month = document.getElementById('exportMonth')?.value || state.workingMonth;
  const checks = document.querySelectorAll('#exportCustomerList input[type=checkbox]:checked');
  if (!checks.length) {
    // fallback: export all with trips
    const ids = new Set(state.trips.filter(t=>t.date&&t.date.startsWith(month)).map(t=>t.customerId));
    if (!ids.size) { toast('אין נסיעות לייצוא'); return; }
    ids.forEach(id => exportCustomerExcelLike(id, month));
    toast('יוצאו ' + ids.size + ' קבצים');
    return;
  }
  checks.forEach(ch => exportCustomerExcelLike(ch.value, month));
  toast('יוצאו ' + checks.length + ' קבצים');
}

// --- Import batch history & cancel ---
function getImportBatches() {
  const map = {};
  state.trips.forEach(t => {
    if (!t.importBatchId) return;
    if (!map[t.importBatchId]) map[t.importBatchId] = { id: t.importBatchId, n: 0, source: t.source || 'excel' };
    map[t.importBatchId].n++;
  });
  return Object.values(map);
}

function renderImportBatches() {
  const box = document.getElementById('importBatchesBox');
  if (!box) return;
  box.classList.remove('hidden');
  const batches = getImportBatches();
  if (!batches.length) {
    box.innerHTML = '<p class="text-slate-400">אין ייבואים עם מזהה batch</p>';
    return;
  }
  box.innerHTML = batches.map(b =>
    `<div class="flex justify-between items-center py-1.5 border-b border-slate-100">
      <span class="text-xs">${b.id} · ${b.n} רשומות · ${b.source}</span>
      <button onclick="cancelImportBatch('${b.id}')" class="text-xs text-red-600 hover:underline">בטל ייבוא</button>
    </div>`
  ).join('');
}

function cancelImportBatch(batchId) {
  if (!confirm('לבטל את כל הרשומות מייבוא ' + batchId + '?')) return;
  const before = state.trips.length;
  state.trips = state.trips.filter(t => t.importBatchId !== batchId);
  saveState();
  toast('בוטלו ' + (before - state.trips.length) + ' רשומות');
  renderImportBatches();
  renderTrips();
  renderCustomers();
}

function scheduleAutoBackupHint() {
  state.lastBackupAt = Date.now();
  saveState();
  exportBackup();
  toast('גיבוי הורד. מומלץ לחזור על כך מדי שבוע.');
}

// Auto-backup reminder on load if > 7 days
(function checkBackupAge() {
  try {
    const last = Number(state.lastBackupAt || 0);
    if (last && Date.now() - last > 7 * 86400000) {
      setTimeout(() => toast('⏰ עבר יותר משבוע מהגיבוי האחרון – מומלץ להוריד גיבוי בהגדרות', 5000), 2000);
    }
  } catch (_) {}
})();

// --- WhatsApp: after parse, check price vs list ---
function checkWhatsAppPriceAgainstList() {
  const cid = document.getElementById('formCustomer')?.value;
  const price = parseFloat(document.getElementById('formPrice')?.value) || 0;
  const route = document.getElementById('formRoute')?.value || '';
  const origin = document.getElementById('formOrigin')?.value || '';
  const dest = document.getElementById('formDestination')?.value || '';
  if (!cid || !price) return;
  const s = suggestPrice(cid, origin, dest, route, document.getElementById('formDate')?.value);
  if (s.sourceTier <= 2 && s.price != null && Math.abs(s.price - price) > 0.5) {
    _lastSuggestion = s;
    onPriceInput();
    toast('⚠️ מחיר מהודעה שונה ממחירון: ' + formatMoney(s.price) + ' מול ' + formatMoney(price));
  }
}

// Patch parsePaste end - find toast after parse and add check
const _origParsePaste = typeof parsePaste === 'function' ? parsePaste : null;

// AI: copy previous week pattern
function aiCopyPreviousWeek(customerId, line) {
  const month = state.workingMonth;
  const [y, mo] = month.split('-').map(Number);
  // find trips in previous month same line - simplified: last 7 days of data
  const trips = state.trips.filter(t => t.customerId === customerId && t.line === line && t.price > 0);
  if (!trips.length) return 0;
  // group by columnKey and use modal price
  const byCol = {};
  trips.forEach(t => {
    const k = t.columnKey || t.route || '';
    if (!byCol[k]) byCol[k] = t.price;
  });
  return Object.keys(byCol).length;
}

// Preserve filters on month change – already partially there; store filter customer
const _filterState = { customer: '', line: '', route: '' };
function rememberFilters() {
  _filterState.customer = document.getElementById('filterCustomer')?.value || '';
  _filterState.line = document.getElementById('filterLine')?.value || '';
  _filterState.route = document.getElementById('filterRoute')?.value || '';
}
function restoreFilters() {
  const fc = document.getElementById('filterCustomer');
  if (fc && _filterState.customer) {
    fc.value = _filterState.customer;
    onFilterCustomerChange();
    const fl = document.getElementById('filterLine');
    if (fl && _filterState.line) {
      fl.value = _filterState.line;
      onFilterLineChange();
      const fr = document.getElementById('filterRoute');
      if (fr && _filterState.route) fr.value = _filterState.route;
    }
  }
}

// enhance changeWorkingMonth via wrapping - call remember before
const _origChangeMonth = typeof changeWorkingMonth === 'function' ? changeWorkingMonth : null;
if (_origChangeMonth) {
  changeWorkingMonth = function(val) {
    rememberFilters();
    _origChangeMonth(val);
    restoreFilters();
  };
}

// Bulk file import helper note in toast when multiple files - browser needs user pick
function importMultipleExcelHint() {
  toast('בחר כמה קבצי Excel בבת אחת בשדה הקובץ (Ctrl+לחיצה)');
  const inp = document.getElementById('excelFile');
  if (inp) inp.setAttribute('multiple', 'multiple');
}

// Enable multiple on excel file input at runtime
setTimeout(() => {
  try {
    const inp = document.getElementById('excelFile');
    if (inp && typeof inp.setAttribute === 'function') {
      inp.setAttribute('multiple', 'multiple');
      inp.addEventListener('change', () => {
        if (inp.files && inp.files.length > 1) {
          toast('נטענו ' + inp.files.length + ' קבצים – עבור כל קובץ: נתח → מיפוי → אישור');
        }
      });
    }
  } catch (_e) {}
}, 500);

// Price list validity: filter active by date in suggestPrice is already active flag;
// add helper when saving price list rows with validFrom/To
function isPriceListEntryValid(p, dateStr) {
  if (p.active === false) return false;
  if (!dateStr) return true;
  if (p.validFrom && dateStr < p.validFrom) return false;
  if (p.validTo && dateStr > p.validTo) return false;
  return true;
}


// ============================================================
// Google Gemini API integration
// ============================================================
const GEMINI_LS_KEY = 'tripManager_geminiKey';
const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-3.6-flash'
];
const GEMINI_MODEL = GEMINI_MODELS[0];

function getGeminiKey() {
  return String(state.geminiApiKey || '').trim();
}

function saveGeminiKey() {
  const el = document.getElementById('geminiApiKey');
  const key = (el?.value || '').trim();
  if (!key) { toast('הדבק מפתח'); return; }
  state.geminiApiKey = key;
  saveState();
  toast('מפתח Gemini נשמר בענן הפרטי שלך');
  updateGeminiStatus();
  const hint = document.getElementById('geminiKeyHint');
  if (hint) hint.textContent = 'מפתח שמור · ' + key.slice(0, 6) + '…' + key.slice(-4);
}

function clearGeminiKey() {
  state.geminiApiKey = ''; saveState();
  const el = document.getElementById('geminiApiKey');
  if (el) el.value = '';
  toast('מפתח נמחק');
  updateGeminiStatus();
  const hint = document.getElementById('geminiKeyHint');
  if (hint) hint.textContent = '';
}

function updateGeminiStatus() {
  const el = document.getElementById('geminiStatus');
  if (!el) return;
  const key = getGeminiKey();
  if (!key) {
    el.textContent = 'ללא מפתח · מקומי';
    el.className = 'text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600';
  } else {
    el.textContent = 'Gemini מחובר';
    el.className = 'text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800';
  }
  const keyInput = document.getElementById('geminiApiKey');
  const hint = document.getElementById('geminiKeyHint');
  if (keyInput && key && !keyInput.value) keyInput.placeholder = key.slice(0, 6) + '…' + key.slice(-4);
  if (hint && key) hint.textContent = 'מפתח שמור · ' + key.slice(0, 6) + '…' + key.slice(-4);
}

async function testGeminiConnection() {
  const key = getGeminiKey() || document.getElementById('geminiApiKey')?.value?.trim();
  if (!key) { toast('אין מפתח'); return; }
  toast('בודק חיבור…');
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Reply with exactly: OK' }] }],
          generationConfig: { maxOutputTokens: 16, temperature: 0 }
        })
      }
    );
    const data = await r.json();
    if (!r.ok) {
      const msg = data?.error?.message || r.statusText || ('HTTP ' + r.status);
      toast('שגיאה: ' + msg);
      const el = document.getElementById('geminiStatus');
      if (el) { el.textContent = 'שגיאה'; el.className = 'text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700'; }
      return;
    }
    state.geminiApiKey = key; saveState();
    toast('✓ Gemini מחובר');
    updateGeminiStatus();
  } catch (e) {
    toast('כשל רשת: ' + e.message);
  }
}

function buildGeminiContext() {
  const month = state.workingMonth;
  const customers = state.customers.map(c => ({
    id: c.id,
    name: c.name,
    lines: c.lines || [],
    priceListSample: (c.priceList || []).filter(p => p.price > 0).slice(0, 12).map(p => ({
      origin: p.origin, destination: p.destination, price: p.price
    }))
  }));
  const monthTrips = state.trips.filter(t => t.date && t.date.startsWith(month));
  const sample = monthTrips.slice(0, 40).map(t => ({
    date: t.date,
    customer: getCustomer(t.customerId).name,
    line: t.line,
    route: t.route || t.columnKey,
    price: t.price
  }));
  return {
    workingMonth: month,
    customers,
    tripCountThisMonth: monthTrips.length,
    sampleTrips: sample,
    conversationContext: {
      customerId: aiCtx.customerId,
      line: aiCtx.line,
      columnKey: aiCtx.columnKey,
      time: aiCtx.time,
      price: aiCtx.price,
      dayFrom: aiCtx.dayFrom,
      dayTo: aiCtx.dayTo,
      excludeFri: aiCtx.excludeFri,
      excludeSat: aiCtx.excludeSat,
      lastIntent: aiCtx.lastIntent
    }
  };
}

function geminiSystemPrompt() {
  return `אתה סוכן AI במערכת ניהול נסיעות (עברית ישראל).
המשתמש כותב פקודות חופשיות. עליך להחזיר JSON בלבד (בלי markdown) בפורמט:

{
  "reply": "תשובה קצרה בעברית למשתמש",
  "actions": [
    {
      "type": "add_trips" | "change_price" | "delete_trips" | "count" | "show_lines" | "none",
      "customerName": "שם לקוח או null",
      "customerId": "id או null",
      "line": "שם קו או null",
      "columnKey": "שעת קו כמו קו גדול 08:00 או null",
      "price": מספר או null,
      "dayFrom": 1-31 או null,
      "dayTo": 1-31 או null,
      "excludeFriday": true/false,
      "excludeSaturday": true/false,
      "month": "YYYY-MM או null"
    }
  ]
}

כללים:
- לקוח "פרח" = perach. קיצור "בב" = בני ברק (לא בב רעננה אלא אם כתוב רעננה).
- שעה 8 / 8:00 = קו גדול 08:00 אם קיים אצל הלקוח.
- "אחרי 14" במחיקה = dayFrom=15. "עד 14" בשינוי = dayTo=14.
- "בלי שישי שבת" = excludeFriday/Saturday true.
- אם חסר מידע – type none והסבר ב-reply.
- אפשר כמה actions.
- השתמש בנתוני ההקשר (conversationContext) להמשך שיחה קצרה כמו "שנה ל־200".`;
}

async function runGeminiAI(userText) {
  const key = getGeminiKey();
  if (!key) throw new Error('no key');

  const ctx = buildGeminiContext();
  const history = (aiCtx.history || []).slice(-8).map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));

  const contents = [
    ...history,
    {
      role: 'user',
      parts: [{
        text: geminiSystemPrompt() + '\n\n--- הקשר מערכת ---\n' +
          JSON.stringify(ctx, null, 0) +
          '\n\n--- הודעת משתמש ---\n' + userText
      }]
    }
  ];

  const body = {
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
      responseMimeType: 'application/json'
    }
  };

  let data = null;
  let lastErr = null;
  for (const model of GEMINI_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        data = await resp.json();
        if (resp.ok) {
          lastErr = null;
          break;
        }
        const msg = data?.error?.message || ('HTTP ' + resp.status);
        lastErr = msg;
        // high demand / rate limit → try next model or retry
        if (/high demand|rate|quota|unavailable|overload|503|429/i.test(msg)) {
          await new Promise(r => setTimeout(r, 600 * attempt));
          continue;
        }
        // hard error on this model – try next model
        break;
      } catch (e) {
        lastErr = e.message || String(e);
        await new Promise(r => setTimeout(r, 400 * attempt));
      }
    }
    if (data && !lastErr) break;
    data = null;
  }
  if (!data || lastErr) {
    throw new Error(lastErr || 'Gemini unavailable');
  }

  let raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (_) {
    // try extract object
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) parsed = JSON.parse(m[0]);
    else {
      // plain text reply – also run local
      const local = parseAndExecuteAI(userText);
      return (raw || 'תשובת Gemini לא בפורמט JSON') + '\n\n' + local;
    }
  }

  const results = [];
  if (parsed.reply) results.push(parsed.reply);

  const actions = Array.isArray(parsed.actions) ? parsed.actions : (parsed.type ? [parsed] : []);
  for (const a of actions) {
    if (!a || a.type === 'none') continue;
    results.push(executeGeminiAction(a));
  }

  if (actions.length === 0 && !parsed.reply) {
    return parseAndExecuteAI(userText);
  }

  return results.filter(Boolean).join('\n\n');
}

function executeGeminiAction(a) {
  // resolve customer
  let c = null;
  if (a.customerId) c = getCustomer(a.customerId);
  if (!c && a.customerName) {
    const n = String(a.customerName).toLowerCase();
    c = state.customers.find(x => x.name.toLowerCase().includes(n) || n.includes(x.name.toLowerCase()));
    if (!c && /פרח/.test(n)) c = state.customers.find(x => x.id === 'perach');
  }
  if (c) aiCtx.customerId = c.id;
  if (a.line) aiCtx.line = a.line;
  if (a.columnKey) { aiCtx.columnKey = a.columnKey; aiCtx.time = a.columnKey; }
  if (a.price != null) aiCtx.price = Number(a.price);
  if (a.dayFrom != null) aiCtx.dayFrom = Number(a.dayFrom);
  if (a.dayTo != null) aiCtx.dayTo = Number(a.dayTo);
  if (a.excludeFriday) aiCtx.excludeFri = true;
  if (a.excludeSaturday) aiCtx.excludeSat = true;

  const month = a.month || state.workingMonth;
  const type = a.type;

  if (type === 'count') {
    const trips = state.trips.filter(t => {
      if (c && t.customerId !== c.id) return false;
      if (!t.date || !t.date.startsWith(month)) return false;
      if (a.line && t.line !== a.line && !(t.route || '').includes(a.line)) return false;
      if (a.columnKey && t.columnKey !== a.columnKey && !(t.route || '').includes(a.columnKey)) return false;
      return true;
    });
    const sum = trips.reduce((s, t) => s + (t.price || 0), 0);
    return `✓ ${trips.length} נסיעות · ${formatMoney(sum)}`;
  }

  if (type === 'show_lines') {
    if (!c) return 'לא צוין לקוח';
    return `קווים של ${c.name}:\n` + (c.lines || []).map((l, i) => `${i + 1}. ${l}`).join('\n');
  }

  if (type === 'change_price') {
    if (!c) return 'חסר לקוח לשינוי מחיר';
    const newPrice = Number(a.price);
    if (!newPrice) return 'חסר מחיר';
    let n = 0;
    state.trips.forEach(t => {
      if (t.customerId !== c.id) return;
      if (!t.date || !t.date.startsWith(month)) return;
      const day = parseInt(t.date.slice(8, 10), 10);
      if (a.dayFrom != null && day < a.dayFrom) return;
      if (a.dayTo != null && day > a.dayTo) return;
      if (a.excludeFriday || a.excludeSaturday) {
        const [y, mo] = month.split('-').map(Number);
        const dow = new Date(y, mo - 1, day).getDay();
        if (a.excludeFriday && dow === 5) return;
        if (a.excludeSaturday && dow === 6) return;
      }
      if (a.line && t.line !== a.line && !(t.route || '').includes(a.line) && t.line !== LINE_ALIASES[a.line]) {
        const exp = LINE_ALIASES[a.line] || a.line;
        if (t.line !== exp && !(t.route || '').includes(exp)) return;
      }
      if (a.columnKey) {
        const hay = `${t.columnKey || ''} ${t.route || ''} ${t.destination || ''}`;
        if (!hay.includes(a.columnKey) && !hay.includes(String(a.columnKey).replace(/^0/, ''))) {
          const tm = String(a.columnKey).match(/\d{1,2}:\d{2}/);
          if (!tm || !hay.includes(tm[0])) return;
        }
      }
      t.price = newPrice;
      n++;
    });
    aiCtx.lastIntent = 'change';
    return n ? `✓ עודכן מחיר ל־${formatMoney(newPrice)} ב־${n} נסיעות` : 'לא נמצאו נסיעות לעדכון';
  }

  if (type === 'delete_trips') {
    if (!c && a.dayFrom == null && a.dayTo == null) return 'חסר לקוח או טווח למחיקה';
    const before = state.trips.length;
    state.trips = state.trips.filter(t => {
      if (c && t.customerId !== c.id) return true;
      if (!t.date || !t.date.startsWith(month)) return true;
      const day = parseInt(t.date.slice(8, 10), 10);
      if (a.dayFrom != null && day < a.dayFrom) return true;
      if (a.dayTo != null && day > a.dayTo) return true;
      // if only date range without line – delete matching range
      if (a.line) {
        const exp = LINE_ALIASES[a.line] || a.line;
        if (t.line !== a.line && t.line !== exp && !(t.route || '').includes(a.line)) return true;
      }
      if (a.columnKey) {
        const hay = `${t.columnKey || ''} ${t.route || ''}`;
        if (!hay.includes(a.columnKey)) return true;
      }
      return false; // delete
    });
    const deleted = before - state.trips.length;
    aiCtx.lastIntent = 'delete';
    return deleted ? `✓ נמחקו ${deleted} נסיעות` : 'לא נמצאו נסיעות למחיקה';
  }

  if (type === 'add_trips') {
    if (!c) return 'חסר לקוח להוספה';
    const price = Number(a.price) || aiCtx.price;
    if (!price) return 'חסר מחיר';
    let colKey = a.columnKey || aiCtx.columnKey || 'מחיר';
    const lineName = a.line || aiCtx.line || '';
    if (lineName) {
      const cols = getLineSchema(c.id, lineName) || [];
      const match = cols.find(x => x === colKey || x.includes(colKey) || colKey.includes(x));
      if (match) colKey = match;
    }
    const [y, mo] = month.split('-').map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    let dFrom = a.dayFrom != null ? a.dayFrom : 1;
    let dTo = a.dayTo != null ? a.dayTo : daysInMonth;
    let added = 0;
    for (let day = dFrom; day <= dTo; day++) {
      const dt = new Date(y, mo - 1, day);
      const dow = dt.getDay();
      if (a.excludeFriday && dow === 5) continue;
      if (a.excludeSaturday && dow === 6) continue;
      if ((a.excludeFriday || a.excludeSaturday) === false && (dow === 5 || dow === 6) && a.excludeFriday !== false) {
        // if user said every day except fri/sat defaults
      }
      // default skip weekend if exclude flags set OR if not specified but common pattern - only skip if flags true
      const ds = `${month}-${String(day).padStart(2, '0')}`;
      const exists = state.trips.some(t =>
        t.customerId === c.id && t.date === ds && t.line === lineName &&
        (t.columnKey === colKey || (t.route || '').includes(colKey))
      );
      if (exists) continue;
      state.trips.push({
        id: uid(),
        customerId: c.id,
        line: lineName,
        columnKey: colKey,
        date: ds,
        price,
        route: `${lineName} · ${colKey}`,
        origin: lineName,
        destination: colKey,
        notes: '',
        driver: '',
        source: 'gemini',
        createdAt: new Date().toISOString()
      });
      learnFromTrip(state.trips[0]);
      added++;
    }
    aiCtx.lastIntent = 'add';
    aiCtx.price = price;
    return added ? `✓ הוספתי ${added} נסיעות · ${formatMoney(price)}` : 'לא נוספו (אולי כבר קיימות)';
  }

  return '';
}

// Seed key once if provided via settings load + status on AI open
function initGeminiOnLoad() {
  updateGeminiStatus();
}

// Hook showTab ai

// No API key is embedded in the source. Users provide their own key in Settings.
function cleanTripNotes(t) {
  let n = (t.notes || '').trim();
  if (!n) return '';
  // Strip system auto-notes entirely (AI / Gemini / import markers)
  if (/נוסף ע[״"׳']?י|סוכן\s*AI|Gemini|יובא מ|ממתינה לבדיקה/i.test(n)) return '';
  return n;
}

function toggleSelectAllTrips(on) {
  document.querySelectorAll('.trip-check').forEach(cb => { cb.checked = !!on; });
}

function bulkDeleteSelected() {
  const ids = [...document.querySelectorAll('.trip-check:checked')].map(cb => cb.value);
  if (!ids.length) {
    toast('סמן נסיעות למחיקה');
    return;
  }
  const set = new Set(ids);
  state.trips = state.trips.filter(t => !set.has(t.id));
  saveState();
  renderTrips();
  renderRecent();
  toast('נמחקו ' + ids.length + ' נסיעות');
}

let _tripsExcelMode = false;
function toggleTripsExcelView() {
  const box = document.getElementById('tripsExcelView');
  const list = document.getElementById('tripsListView');
  if (!box) return;
  _tripsExcelMode = !_tripsExcelMode;
  if (_tripsExcelMode) {
    box.classList.remove('hidden');
    renderTripsExcelView();
    const btn = document.getElementById('btnExcelView');
    if (btn) btn.classList.add('ring-2', 'ring-indigo-400');
  } else {
    box.classList.add('hidden');
    box.innerHTML = '';
    const btn = document.getElementById('btnExcelView');
    if (btn) btn.classList.remove('ring-2', 'ring-indigo-400');
  }
}

function renderTripsExcelView() {
  const box = document.getElementById('tripsExcelView');
  if (!box) return;
  const cid = document.getElementById('filterCustomer')?.value || '';
  const lineFilter = document.getElementById('filterLine')?.value || '';
  const month = document.getElementById('filterMonth')?.value || state.workingMonth;

  if (!cid) {
    box.innerHTML = '<p class="text-sm text-slate-500 p-2">בחר לקוח כדי לראות תצוגת אקסל (ימים × שעות לפי קו)</p>';
    return;
  }
  const c = getCustomer(cid);
  if (!c) return;
  const lines = lineFilter ? [lineFilter] : (c.lines && c.lines.length ? c.lines : ['כללי']);
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const dayNames = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

  let html = '';
  lines.forEach(line => {
    let cols = getLineSchema(c.id, line);
    if (!cols || !cols.length) {
      // derive columns from trips
      const trips = state.trips.filter(t => t.customerId === cid && t.date && t.date.startsWith(month) &&
        (line === 'כללי' || t.line === line || (t.route||'').includes(line)));
      const set = new Set();
      trips.forEach(t => {
        if (t.columnKey) set.add(t.columnKey);
        else if (t.route) set.add(t.route);
      });
      cols = [...set];
      if (!cols.length) cols = ['מחיר'];
    }

    // lookup
    const cell = {};
    state.trips.forEach(t => {
      if (t.customerId !== cid || !t.date || !t.date.startsWith(month)) return;
      if (line !== 'כללי' && t.line !== line && !(t.route||'').includes(line)) return;
      const day = t.date.slice(8, 10);
      const col = t.columnKey || t.route || cols[0];
      // fuzzy match to schema col
      let colKey = cols.find(c0 => c0 === col || col.includes(c0) || c0.includes(col));
      if (!colKey) {
        const tm = String(col).match(/\d{1,2}:\d{2}/);
        if (tm) colKey = cols.find(c0 => c0.includes(tm[0]));
      }
      if (!colKey) colKey = col;
      if (!cols.includes(colKey) && cols[0] === 'מחיר') { /* ok */ }
      else if (!cols.includes(colKey)) {
        // try hour only
        const tm = String(col).match(/\d{1,2}:\d{2}/);
        if (tm) colKey = cols.find(c0 => c0.includes(tm[0])) || colKey;
      }
      if (!cell[day]) cell[day] = {};
      if (!cell[day][colKey]) cell[day][colKey] = { sum: 0, ids: [] };
      cell[day][colKey].sum += t.price || 0;
      cell[day][colKey].ids.push(t.id);
    });

    html += `<div class="mb-5">
      <div class="flex items-center justify-between mb-1">
        <h3 class="font-semibold text-sm text-indigo-900">קו: ${line}</h3>
        <span class="text-xs text-slate-400">${cols.length} עמודות</span>
      </div>
      <div class="overflow-x-auto">
      <table class="min-w-full border-collapse text-xs bg-white">
        <thead><tr class="bg-indigo-50">
          <th class="border border-slate-200 px-2 py-1.5 sticky right-0 bg-indigo-50 z-10">תאריך</th>
          ${cols.map(c0 => `<th class="border border-slate-200 px-2 py-1.5 whitespace-nowrap">${c0}</th>`).join('')}
          <th class="border border-slate-200 px-2 py-1.5 bg-slate-50">סה״כ</th>
        </tr></thead><tbody>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = String(d).padStart(2, '0');
      const dateFull = `${month}-${ds}`;
      const dow = new Date(y, mo - 1, d).getDay();
      const we = dow === 5 || dow === 6;
      let daySum = 0;
      html += `<tr class="${we ? 'bg-orange-50/50' : ''}">
        <td class="border border-slate-200 px-2 py-1 sticky right-0 bg-white ${we?'bg-orange-50':''} font-medium whitespace-nowrap">${dayNames[dow]} ${d}/${mo}</td>`;
      cols.forEach(col => {
        const entry = cell[ds] && cell[ds][col];
        const val = entry ? entry.sum : '';
        if (val) daySum += val;
        const ids = entry ? entry.ids.join(',') : '';
        html += `<td class="border border-slate-200 px-1 py-0.5 text-center ${val ? 'bg-emerald-50 font-semibold' : ''}"
          ${ids ? `title="לחיצה כפולה למחיקה" ondblclick="deleteTripIds('${ids}')"` : ''}>${val || ''}</td>`;
      });
      html += `<td class="border border-slate-200 px-2 py-1 text-center bg-slate-50">${daySum || ''}</td></tr>`;
    }
    // column totals + VAT
    const colTotals = cols.map(col => {
      let s = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const ds = String(d).padStart(2,'0');
        const e = cell[ds] && cell[ds][col];
        if (e) s += e.sum;
      }
      return s;
    });
    const lineGrand = colTotals.reduce((a,b)=>a+b,0);
    const vatR = state.defaultVat || 18;
    const useVat = c.vat !== false;
    const vatL = useVat ? Math.round(lineGrand * (vatR/100)*100)/100 : 0;

    html += `<tr class="bg-slate-100 font-semibold"><td class="border border-slate-200 px-2 py-1 sticky right-0 bg-slate-100">סה״כ לפני מע״מ</td>`;
    colTotals.forEach(s => { html += `<td class="border border-slate-200 px-2 py-1 text-center">${s||''}</td>`; });
    html += `<td class="border border-slate-200 px-2 py-1 text-center">${lineGrand||''}</td></tr>`;
    if (useVat) {
      html += `<tr class="bg-amber-50"><td class="border border-slate-200 px-2 py-1 sticky right-0 bg-amber-50">מע״מ ${vatR}%</td>`;
      colTotals.forEach(s => {
        const v = s ? Math.round(s*(vatR/100)*100)/100 : 0;
        html += `<td class="border border-slate-200 px-2 py-1 text-center text-amber-800">${v||''}</td>`;
      });
      html += `<td class="border border-slate-200 px-2 py-1 text-center font-semibold text-amber-900">${vatL||''}</td></tr>`;
      html += `<tr class="bg-indigo-50 font-bold"><td class="border border-slate-200 px-2 py-1 sticky right-0 bg-indigo-50">סה״כ כולל מע״מ</td>`;
      colTotals.forEach(s => {
        const v = s ? Math.round(s*(1+vatR/100)*100)/100 : 0;
        html += `<td class="border border-slate-200 px-2 py-1 text-center">${v||''}</td>`;
      });
      html += `<td class="border border-slate-200 px-2 py-1 text-center text-indigo-900">${lineGrand+vatL||''}</td></tr>`;
    }
    html += `</tbody></table></div></div>`;
  });

  if (!html) html = '<p class="text-slate-400 text-sm">אין נתונים</p>';
  box.innerHTML = html;
}

function deleteTripIds(csv) {
  const ids = String(csv).split(',').filter(Boolean);
  if (!ids.length) return;
  const set = new Set(ids);
  state.trips = state.trips.filter(t => !set.has(t.id));
  saveState();
  renderTrips();
  renderRecent();
  toast('נמחק');
}

// One-time cleanup of AI auto-notes on existing trips (optional mild)
function scrubAiAutoNotes() {
  let n = 0;
  state.trips.forEach(t => {
    if (!t.notes) return;
    const cleaned = cleanTripNotes(t);
    if (cleaned !== t.notes) {
      t.notes = cleaned;
      n++;
    }
  });
  if (n) saveState();
  return n;
}


// ============================================================
// Secretary Desk – Excel-like daily entry
// ============================================================
const DESK_PREF_KEY = 'tripManager_deskPrefs';

function loadDeskPrefs() {
  return state.deskPrefs || {};
}
function saveDeskPrefs(p) {
  state.deskPrefs = p || {};
  saveState();
}

function initSecretaryDesk() {
  const prefs = loadDeskPrefs();
  const monthEl = document.getElementById('deskMonth');
  if (monthEl) monthEl.value = prefs.month || state.workingMonth || currentMonthStr();

  const custSel = document.getElementById('deskCustomer');
  if (!custSel) return;
  const cur = prefs.customerId || 'perach';
  custSel.innerHTML = '';
  state.customers.slice().sort((a,b)=>a.name.localeCompare(b.name,'he')).forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    if (c.id === cur) o.selected = true;
    custSel.appendChild(o);
  });
  onDeskCustomerChange(prefs.line || 'בני ברק');
  // paste handler on matrix
  const box = document.getElementById('deskMatrix');
  if (box && !box.dataset.pasteBound) {
    box.dataset.pasteBound = '1';
    box.addEventListener('paste', onDeskPaste);
    box.addEventListener('keydown', onDeskKeydown);
  }
}

function onDeskCustomerChange(preferLine) {
  const cid = document.getElementById('deskCustomer')?.value;
  const c = getCustomer(cid);
  const lineSel = document.getElementById('deskLine');
  if (!lineSel) return;
  lineSel.innerHTML = '';
  const lines = (c && c.lines && c.lines.length) ? c.lines : ['כללי'];
  const prefs = loadDeskPrefs();
  const want = preferLine || prefs.line || lines[0];
  lines.forEach(l => {
    const o = document.createElement('option');
    o.value = l; o.textContent = l;
    if (l === want) o.selected = true;
    lineSel.appendChild(o);
  });
  // if prefer not in list, select first
  if (![...lineSel.options].some(o => o.selected)) lineSel.selectedIndex = 0;
  saveDeskPrefs({ customerId: cid, line: lineSel.value, month: document.getElementById('deskMonth')?.value });
  renderDeskMatrix();
  // refresh route suggestions for quick form too if same customer
  try {
    if (c && c.typicalRoutes) {
      // ensure customer has orderers for autocomplete
    }
  } catch(_){}
}

function onDeskLineChange() {
  const prefs = loadDeskPrefs();
  prefs.line = document.getElementById('deskLine')?.value;
  prefs.customerId = document.getElementById('deskCustomer')?.value;
  prefs.month = document.getElementById('deskMonth')?.value;
  saveDeskPrefs(prefs);
  renderDeskMatrix();
}

function deskGetContext() {
  return {
    cid: document.getElementById('deskCustomer')?.value,
    line: document.getElementById('deskLine')?.value || '',
    month: document.getElementById('deskMonth')?.value || state.workingMonth
  };
}

function deskIsFreeForm(c, line) {
  if (!c) return true;
  const schema = getLineSchema(c.id, line);
  if (schema && schema.length) return false;
  // single "שוטף" / no fixed times → free form list
  if (!c.lines || !c.lines.length) return true;
  if (c.lines.length === 1 && /שוטף|כללי|רשימה/i.test(c.lines[0])) return true;
  if (c.id === 'keter') return true;
  return false;
}

function deskCustomerTrips(cid, line, month) {
  return state.trips.filter(t => {
    if (t.customerId !== cid || !t.date || !t.date.startsWith(month)) return false;
    // free-form / single-line: show all trips for customer in month
    const c = getCustomer(cid);
    if (deskIsFreeForm(c, line)) return true;
    if (!line || line === 'כללי') return true;
    if (t.line === line) return true;
    if ((t.route || '').includes(line)) return true;
    // trips without line still show when filtering a line of multi-line customer? no
    if (!t.line && !t.columnKey) return false;
    return false;
  });
}

function deskResolveColumns(c, line) {
  let cols = getLineSchema(c.id, line);
  if (cols && cols.length) return cols;
  const month = document.getElementById('deskMonth')?.value || state.workingMonth;
  const set = new Set();
  deskCustomerTrips(c.id, line, month).forEach(t => {
    if (t.columnKey) set.add(t.columnKey);
    else if (t.route) set.add(t.route);
  });
  if (set.size) return [...set];
  if (c.typicalRoutes && c.typicalRoutes.length) return c.typicalRoutes.slice(0, 12);
  return ['מחיר'];
}

function renderDeskMatrix() {
  const box = document.getElementById('deskMatrix');
  if (!box) return;
  const { cid, line, month } = deskGetContext();
  const c = getCustomer(cid);
  if (!c) { box.innerHTML = '<p class="text-slate-400 p-4">בחר לקוח</p>'; return; }

  // Free-form customers (כתר תורה etc.): list every trip like Excel "שוטף"
  if (deskIsFreeForm(c, line)) {
    renderDeskFreeForm(box, c, month);
    return;
  }

  const cols = deskResolveColumns(c, line);
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const dayNames = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];

  const map = {};
  deskCustomerTrips(cid, line, month).forEach(t => {
    let colKey = t.columnKey || t.route || cols[0];
    const match = cols.find(x => x === colKey || x.includes(colKey) || colKey.includes(x));
    if (match) colKey = match;
    else {
      const tm = String(colKey).match(/\d{1,2}:\d{2}/);
      if (tm) {
        const byT = cols.find(x => x.includes(tm[0]));
        if (byT) colKey = byT;
      }
    }
    const k = t.date + '|' + colKey;
    if (!map[k]) map[k] = { price: 0, id: t.id };
    map[k].price += t.price || 0;
    map[k].id = t.id;
  });

  let html = `<table class="min-w-full border-collapse text-xs select-none" id="deskTable">
    <thead><tr class="bg-indigo-50">
      <th class="border border-slate-200 px-2 py-1.5 sticky right-0 bg-indigo-50 z-10 min-w-[72px]">תאריך</th>
      ${cols.map((col,ci) => `<th class="border border-slate-200 px-2 py-1.5 whitespace-nowrap min-w-[88px]">${col}</th>`).join('')}
      <th class="border border-slate-200 px-2 py-1.5 bg-slate-50">סה״כ</th>
    </tr></thead><tbody>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = String(d).padStart(2,'0');
    const dateFull = `${month}-${ds}`;
    const dow = new Date(y, mo-1, d).getDay();
    const we = dow === 5 || dow === 6;
    let daySum = 0;
    html += `<tr class="${we?'bg-orange-50/40':''}" data-day="${d}">
      <td class="border border-slate-200 px-2 py-0.5 sticky right-0 ${we?'bg-orange-50':'bg-white'} font-medium whitespace-nowrap">${dayNames[dow]} ${d}/${mo}</td>`;
    cols.forEach((col, ci) => {
      const entry = map[dateFull + '|' + col];
      const val = entry ? entry.price : '';
      if (val) daySum += val;
      const tripId = entry ? entry.id : '';
      html += `<td class="border border-slate-200 p-0">
        <input type="number" inputmode="numeric"
          class="desk-cell w-full text-center py-1.5 px-1 border-0 bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${val?'font-semibold text-emerald-800':''}"
          data-date="${dateFull}" data-col="${escAttr(col)}" data-trip="${tripId}" data-row="${d}" data-colidx="${ci}"
          value="${val===''?'':val}"
          onfocus="this.select()"
          onkeydown="deskCellKey(event, this)"
          onchange="deskCellSave(this)" />
      </td>`;
    });
    html += `<td class="border border-slate-200 px-2 py-1 text-center bg-slate-50 font-medium" data-day-sum="${d}">${daySum||''}</td></tr>`;
  }

  const colSums = cols.map(col => {
    let s = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = String(d).padStart(2,'0');
      const e = map[`${month}-${ds}|${col}`];
      if (e) s += e.price;
    }
    return s;
  });
  const grand = colSums.reduce((a, b) => a + b, 0);
  const vatRate = state.defaultVat || 18;
  const appliesVat = !c || c.vat !== false;
  const vatAmt = appliesVat ? Math.round(grand * (vatRate / 100) * 100) / 100 : 0;

  html += `<tr class="bg-slate-100 font-semibold"><td class="border px-2 py-1 sticky right-0 bg-slate-100">סה״כ לפני מע״מ</td>`;
  colSums.forEach(s => { html += `<td class="border px-2 py-1 text-center">${s || ''}</td>`; });
  html += `<td class="border px-2 py-1 text-center">${grand || ''}</td></tr>`;

  if (appliesVat) {
    html += `<tr class="bg-amber-50 font-medium"><td class="border px-2 py-1 sticky right-0 bg-amber-50">מע״מ ${vatRate}%</td>`;
    colSums.forEach(s => {
      const v = s ? Math.round(s * (vatRate / 100) * 100) / 100 : 0;
      html += `<td class="border px-2 py-1 text-center text-amber-800">${v || ''}</td>`;
    });
    html += `<td class="border px-2 py-1 text-center text-amber-900 font-semibold">${vatAmt || ''}</td></tr>`;
    html += `<tr class="bg-indigo-50 font-bold"><td class="border px-2 py-1 sticky right-0 bg-indigo-50">סה״כ כולל מע״מ</td>`;
    colSums.forEach(s => {
      const v = s ? Math.round(s * (1 + vatRate / 100) * 100) / 100 : 0;
      html += `<td class="border px-2 py-1 text-center">${v || ''}</td>`;
    });
    html += `<td class="border px-2 py-1 text-center text-indigo-900">${Math.round((grand + vatAmt) * 100) / 100}</td></tr>`;
  } else {
    html += `<tr class="bg-slate-50 text-slate-500"><td class="border px-2 py-1 sticky right-0 bg-slate-50" colspan="${cols.length + 2}">פטור ממע״מ</td></tr>`;
  }

  html += `</tbody></table>`;
  box.innerHTML = html;
  deskUpdateMissing();
}

function renderDeskFreeForm(box, c, month) {
  const trips = deskCustomerTrips(c.id, '', month)
    .slice()
    .sort((a, b) => (a.date || '').localeCompare(b.date || '') || (a.route || '').localeCompare(b.route || '', 'he'));

  const vatRate = state.defaultVat || 18;
  const appliesVat = c.vat !== false;
  const total = trips.reduce((s, t) => s + (t.price || 0), 0);
  const vatAmt = appliesVat ? Math.round(total * (vatRate / 100) * 100) / 100 : 0;

  // group by date for visual clarity
  const byDate = {};
  trips.forEach(t => {
    if (!byDate[t.date]) byDate[t.date] = [];
    byDate[t.date].push(t);
  });

  let html = `<div class="mb-2 flex flex-wrap items-center gap-2">
    <span class="text-sm font-medium text-indigo-900">${c.name} – רשימת נסיעות (כמו אקסל שוטף)</span>
    <span class="text-xs text-slate-500">${trips.length} נסיעות</span>
    <button type="button" onclick="deskAddFreeRow()" class="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">+ הוסף נסיעה</button>
  </div>
  <table class="min-w-full border-collapse text-xs" id="deskFreeTable">
    <thead><tr class="bg-indigo-50">
      <th class="border border-slate-200 px-2 py-1.5">תאריך</th>
      <th class="border border-slate-200 px-2 py-1.5">תיאור / מסלול</th>
      <th class="border border-slate-200 px-2 py-1.5">מחיר</th>
      <th class="border border-slate-200 px-2 py-1.5">מזמין</th>
      <th class="border border-slate-200 px-2 py-1.5">הערות</th>
      <th class="border border-slate-200 px-2 py-1.5 w-10"></th>
    </tr></thead><tbody>`;

  if (!trips.length) {
    html += `<tr><td colspan="6" class="border px-3 py-6 text-center text-slate-400">אין נסיעות בחודש זה ללקוח זה – הוסף או בדוק שהחודש נכון</td></tr>`;
  }

  trips.forEach(t => {
    const orderers = (c.orderers || []).map(o => `<option value="${escAttr(o)}">`).join('');
    html += `<tr class="hover:bg-slate-50" data-tid="${t.id}">
      <td class="border border-slate-200 p-0.5">
        <input type="date" value="${t.date || ''}" onchange="deskFreeUpdate('${t.id}','date',this.value)"
          class="w-full border-0 text-xs px-1 py-1.5 bg-transparent" />
      </td>
      <td class="border border-slate-200 p-0.5">
        <input type="text" value="${escAttr(t.route || t.columnKey || '')}" list="deskRouteList"
          onchange="deskFreeUpdate('${t.id}','route',this.value)"
          class="w-full border-0 text-xs px-1 py-1.5 bg-transparent min-w-[140px]" />
      </td>
      <td class="border border-slate-200 p-0.5">
        <input type="number" value="${t.price || ''}" onchange="deskFreeUpdate('${t.id}','price',this.value)"
          class="w-20 border-0 text-xs text-center px-1 py-1.5 font-semibold text-emerald-800 bg-transparent" />
      </td>
      <td class="border border-slate-200 p-0.5">
        <input type="text" value="${escAttr(t.driver || '')}" list="ordererList"
          onchange="deskFreeUpdate('${t.id}','driver',this.value)"
          class="w-full border-0 text-xs px-1 py-1.5 bg-transparent min-w-[100px]" />
      </td>
      <td class="border border-slate-200 p-0.5">
        <input type="text" value="${escAttr(t.notes || '')}" onchange="deskFreeUpdate('${t.id}','notes',this.value)"
          class="w-full border-0 text-xs px-1 py-1.5 bg-transparent" />
      </td>
      <td class="border border-slate-200 text-center">
        <button type="button" onclick="deskFreeDelete('${t.id}')" class="text-red-500 hover:text-red-700 px-2">✕</button>
      </td>
    </tr>`;
  });

  html += `</tbody>
    <tfoot>
      <tr class="bg-slate-100 font-semibold"><td class="border px-2 py-1.5" colspan="2">סה״כ לפני מע״מ</td>
        <td class="border px-2 py-1.5 text-center">${total || ''}</td><td colspan="3" class="border"></td></tr>`;
  if (appliesVat) {
    html += `<tr class="bg-amber-50"><td class="border px-2 py-1.5" colspan="2">מע״מ ${vatRate}%</td>
      <td class="border px-2 py-1.5 text-center text-amber-900 font-semibold">${vatAmt || ''}</td><td colspan="3" class="border"></td></tr>
      <tr class="bg-indigo-50 font-bold"><td class="border px-2 py-1.5" colspan="2">סה״כ כולל מע״מ</td>
      <td class="border px-2 py-1.5 text-center text-indigo-900">${Math.round((total + vatAmt) * 100) / 100}</td><td colspan="3" class="border"></td></tr>`;
  }
  html += `</tfoot></table>`;

  // datalist for routes
  const routes = [...new Set([...(c.typicalRoutes || []), ...trips.map(t => t.route).filter(Boolean)])];
  html += `<datalist id="deskRouteList">${routes.map(r => `<option value="${escAttr(r)}">`).join('')}</datalist>`;

  box.innerHTML = html;
  const miss = document.getElementById('deskMissing');
  if (miss) {
    if (!trips.length) {
      miss.classList.remove('hidden');
      miss.textContent = 'אין נסיעות בחודש זה. אם יש נתונים ב«כל הנסיעות» – בדוק שהחודש תואם.';
    } else {
      miss.classList.add('hidden');
    }
  }
}

function deskFreeUpdate(id, field, value) {
  const t = state.trips.find(x => x.id === id);
  if (!t) return;
  if (field === 'price') {
    t.price = parseFloat(value) || 0;
  } else if (field === 'route') {
    t.route = value;
    t.columnKey = value;
  } else {
    t[field] = value;
  }
  t.updatedAt = new Date().toISOString();
  learnFromTrip(t);
  saveState();
  renderDeskMatrix();
}

function deskFreeDelete(id) {
  state.trips = state.trips.filter(t => t.id !== id);
  saveState();
  renderDeskMatrix();
  toast('נמחק');
}

function deskAddFreeRow() {
  const { cid, month } = deskGetContext();
  const c = getCustomer(cid);
  if (!c) return;
  const today = new Date();
  const [y, mo] = month.split('-').map(Number);
  let day = 1;
  if (today.getFullYear() === y && today.getMonth() + 1 === mo) day = today.getDate();
  const date = `${month}-${String(day).padStart(2, '0')}`;
  const trip = {
    id: uid(),
    customerId: cid,
    line: (c.lines && c.lines[0]) || '',
    columnKey: '',
    date,
    price: 0,
    route: '',
    origin: '',
    destination: '',
    notes: '',
    driver: '',
    source: 'desk',
    createdAt: new Date().toISOString()
  };
  state.trips.unshift(trip);
  saveState();
  renderDeskMatrix();
  toast('נוספה שורה');
}

function deskCellKey(ev, input) {
  const row = parseInt(input.dataset.row, 10);
  const colidx = parseInt(input.dataset.colidx, 10);
  if (ev.key === 'Enter') {
    ev.preventDefault();
    deskCellSave(input);
    // move down
    const next = document.querySelector(`.desk-cell[data-row="${row+1}"][data-colidx="${colidx}"]`);
    if (next) { next.focus(); next.select(); }
    return;
  }
  if (ev.key === 'Tab') {
    // default tab is fine; after save
    deskCellSave(input);
    return;
  }
  if (ev.key === 'ArrowDown') {
    ev.preventDefault();
    const next = document.querySelector(`.desk-cell[data-row="${row+1}"][data-colidx="${colidx}"]`);
    if (next) { next.focus(); next.select(); }
  }
  if (ev.key === 'ArrowUp') {
    ev.preventDefault();
    const next = document.querySelector(`.desk-cell[data-row="${row-1}"][data-colidx="${colidx}"]`);
    if (next) { next.focus(); next.select(); }
  }
  if (ev.key === 'ArrowLeft') {
    // RTL: left goes to higher colidx
    const next = document.querySelector(`.desk-cell[data-row="${row}"][data-colidx="${colidx+1}"]`);
    if (next) { ev.preventDefault(); next.focus(); next.select(); }
  }
  if (ev.key === 'ArrowRight') {
    const next = document.querySelector(`.desk-cell[data-row="${row}"][data-colidx="${colidx-1}"]`);
    if (next) { ev.preventDefault(); next.focus(); next.select(); }
  }
}

function deskCellSave(input) {
  const date = input.dataset.date;
  const col = input.dataset.col;
  let tripId = input.dataset.trip;
  const raw = input.value.trim();
  const price = raw === '' ? null : parseFloat(raw);
  const { cid, line } = deskGetContext();
  const c = getCustomer(cid);
  if (!c) return;

  if (price == null || isNaN(price)) {
    // delete
    if (tripId) {
      state.trips = state.trips.filter(t => t.id !== tripId);
      input.dataset.trip = '';
      saveState();
    } else {
      state.trips = state.trips.filter(t => !(
        t.customerId === cid && t.date === date &&
        (t.columnKey === col || (t.route||'').includes(col)) &&
        (!line || line === 'כללי' || t.line === line)
      ));
      saveState();
    }
    input.classList.remove('font-semibold', 'text-emerald-800');
    deskRecalcRow(input.dataset.row);
    deskUpdateMissing();
    return;
  }

  if (tripId) {
    const t = state.trips.find(x => x.id === tripId);
    if (t) {
      t.price = price;
      t.columnKey = col;
      t.line = line === 'כללי' ? (t.line || '') : line;
      t.route = (line && line !== 'כללי') ? `${line} · ${col}` : col;
      saveState();
      input.classList.add('font-semibold', 'text-emerald-800');
      deskRecalcRow(input.dataset.row);
      return;
    }
  }

  // create
  const trip = {
    id: uid(),
    customerId: cid,
    line: line === 'כללי' ? '' : line,
    columnKey: col,
    date,
    price,
    route: (line && line !== 'כללי') ? `${line} · ${col}` : col,
    origin: line || '',
    destination: col,
    notes: '',
    driver: '',
    source: 'desk',
    createdAt: new Date().toISOString()
  };
  state.trips.unshift(trip);
  input.dataset.trip = trip.id;
  const _learned = learnFromTrip(trip);
  saveState();
  toastLearned(_learned);
  input.classList.add('font-semibold', 'text-emerald-800');
  deskRecalcRow(input.dataset.row);
  deskUpdateMissing();
}

function deskRecalcRow(row) {
  const cells = document.querySelectorAll(`.desk-cell[data-row="${row}"]`);
  let sum = 0;
  cells.forEach(c => { const v = parseFloat(c.value); if (v) sum += v; });
  const sumCell = document.querySelector(`[data-day-sum="${row}"]`);
  if (sumCell) sumCell.textContent = sum || '';
}

function deskUpdateMissing() {
  const el = document.getElementById('deskMissing');
  if (!el) return;
  const { cid, line, month } = deskGetContext();
  const c = getCustomer(cid);
  if (!c) { el.classList.add('hidden'); return; }
  const cols = deskResolveColumns(c, line);
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  const today = new Date();
  const isThisMonth = today.getFullYear() === y && (today.getMonth()+1) === mo;
  const upTo = isThisMonth ? today.getDate() : daysInMonth;
  let missing = 0;
  for (let d = 1; d <= upTo; d++) {
    const dow = new Date(y, mo-1, d).getDay();
    if (dow === 5 || dow === 6) continue; // skip fri/sat
    const ds = `${month}-${String(d).padStart(2,'0')}`;
    const hasAny = cols.some(col => {
      return state.trips.some(t =>
        t.customerId === cid && t.date === ds &&
        (t.columnKey === col || (t.route||'').includes(col)) &&
        (!line || line === 'כללי' || t.line === line)
      );
    });
    if (!hasAny) missing++;
  }
  if (missing > 0) {
    el.classList.remove('hidden');
    el.textContent = `⚠️ ${missing} ימי חול עד היום בלי נסיעה בקו זה`;
  } else {
    el.classList.add('hidden');
  }
}

function deskCopyDay(fromDate, toDate) {
  const { cid, line } = deskGetContext();
  const src = state.trips.filter(t =>
    t.customerId === cid && t.date === fromDate &&
    (!line || line === 'כללי' || t.line === line)
  );
  if (!src.length) return 0;
  let n = 0;
  src.forEach(t => {
    const exists = state.trips.some(x =>
      x.customerId === cid && x.date === toDate &&
      x.columnKey === t.columnKey && x.line === t.line
    );
    if (exists) return;
    state.trips.unshift({
      ...t,
      id: uid(),
      date: toDate,
      source: 'desk-copy',
      createdAt: new Date().toISOString()
    });
    n++;
  });
  return n;
}

function deskCopyYesterday() {
  const { month } = deskGetContext();
  const today = new Date();
  // use "today" in working month if current, else last day with data
  const [y, mo] = month.split('-').map(Number);
  let targetDay = today.getDate();
  if (!(today.getFullYear() === y && today.getMonth()+1 === mo)) {
    targetDay = new Date(y, mo, 0).getDate();
  }
  // find previous weekday
  let d = targetDay - 1;
  while (d >= 1) {
    const dow = new Date(y, mo-1, d).getDay();
    if (dow !== 5 && dow !== 6) break;
    d--;
  }
  if (d < 1) { toast('אין יום קודם'); return; }
  const from = `${month}-${String(d).padStart(2,'0')}`;
  const to = `${month}-${String(targetDay).padStart(2,'0')}`;
  const n = deskCopyDay(from, to);
  saveState();
  renderDeskMatrix();
  toast(n ? `הועתקו ${n} נסיעות מ-${d}/${mo}` : 'אין מה להעתיק');
}

function deskCopyLastWeek() {
  const { cid, line, month } = deskGetContext();
  const [y, mo] = month.split('-').map(Number);
  const daysInMonth = new Date(y, mo, 0).getDate();
  let n = 0;
  for (let d = 8; d <= daysInMonth; d++) {
    const from = `${month}-${String(d-7).padStart(2,'0')}`;
    const to = `${month}-${String(d).padStart(2,'0')}`;
    // only copy if target empty for this line
    const has = state.trips.some(t => t.customerId === cid && t.date === to && (!line || line==='כללי' || t.line===line));
    if (has) continue;
    n += deskCopyDay(from, to);
  }
  saveState();
  renderDeskMatrix();
  toast(n ? `הועתקו ${n} נסיעות משבוע קודם` : 'אין יעדים ריקים להעתקה');
}

function deskOpenDay() {
  const { cid, line, month } = deskGetContext();
  const c = getCustomer(cid);
  if (!c) return;
  const cols = deskResolveColumns(c, line);
  const today = new Date();
  const [y, mo] = month.split('-').map(Number);
  let day = today.getDate();
  if (!(today.getFullYear() === y && today.getMonth()+1 === mo)) day = 1;
  const date = `${month}-${String(day).padStart(2,'0')}`;
  let n = 0;
  cols.forEach(col => {
    const exists = state.trips.some(t =>
      t.customerId === cid && t.date === date &&
      (t.columnKey === col || (t.route||'').includes(col))
    );
    if (exists) return;
    // price from list
    const s = suggestPrice(cid, line, col, col, date, line, col);
    const price = s.price || 0;
    if (!price) return; // only fill when we know price
    state.trips.unshift({
      id: uid(),
      customerId: cid,
      line: line === 'כללי' ? '' : line,
      columnKey: col,
      date,
      price,
      route: (line && line !== 'כללי') ? `${line} · ${col}` : col,
      origin: line || '',
      destination: col,
      notes: '',
      driver: '',
      listPrice: s.sourceTier <= 2 ? s.price : null,
      priceSource: s.source,
      source: 'desk-template',
      createdAt: new Date().toISOString()
    });
    n++;
  });
  saveState();
  renderDeskMatrix();
  toast(n ? `פתיחת יום: ${n} נסיעות במחירון` : 'אין מחירים במחירון לעמודות – מלא ידנית');
}

function deskFocusPaste() {
  toast('סמן תא בטבלה והדבק (Ctrl+V) טווח מאקסל');
  const first = document.querySelector('.desk-cell');
  if (first) first.focus();
}

function onDeskPaste(ev) {
  const text = (ev.clipboardData || window.clipboardData)?.getData('text');
  if (!text || !text.includes('\t') && !text.includes('\n')) return;
  const active = document.activeElement;
  if (!active || !active.classList.contains('desk-cell')) return;
  ev.preventDefault();
  const startRow = parseInt(active.dataset.row, 10);
  const startCol = parseInt(active.dataset.colidx, 10);
  const rows = text.replace(/\r/g, '').split('\n').filter(r => r.length);
  let n = 0;
  rows.forEach((row, ri) => {
    const cells = row.split('\t');
    cells.forEach((val, ci) => {
      const v = String(val).replace(/[^\d.]/g, '');
      if (!v) return;
      const el = document.querySelector(`.desk-cell[data-row="${startRow+ri}"][data-colidx="${startCol+ci}"]`);
      if (!el) return;
      el.value = v;
      deskCellSave(el);
      n++;
    });
  });
  toast(n ? `הודבקו ${n} תאים` : 'לא זוהו מספרים');
}

function onDeskKeydown(ev) {
  // allow Ctrl+V default - paste event handles
}

// Stronger autocomplete: orderers + routes for keter etc on quick form
function refreshOrdererSuggestions() {
  const cid = document.getElementById('formCustomer')?.value;
  const c = getCustomer(cid);
  let dl = document.getElementById('ordererList');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'ordererList';
    document.body.appendChild(dl);
  }
  if (!c) { dl.innerHTML = ''; return; }
  const list = getCustomerOrderers(cid);
  dl.innerHTML = list.map(o => `<option value="${escAttr(o)}">`).join('');
  const drv = document.getElementById('formDriver');
  if (drv) drv.setAttribute('list', 'ordererList');
  renderOrdererChips(cid);
  applyOrdererSuggestion();
}

// Hook customer change for orderers
const _origOnCustomerChange = typeof onCustomerChange === 'function' ? onCustomerChange : null;
if (_origOnCustomerChange) {
  // wrap after definition - patch at end
}

// Patch onCustomerChange by reassignment after load - done in init
function enhanceCustomerChangeForOrderers() {
  const prev = window.onCustomerChange;
  // already global function
}


// ============================================================
// Self-learning from entered trips → customer settings
// ============================================================
function learnFromTrip(trip, opts) {
  if (!trip || !trip.customerId) return null;
  const c = getCustomer(trip.customerId);
  if (!c) return null;
  opts = opts || {};
  const learned = [];

  if (!c.typicalRoutes) c.typicalRoutes = [];
  if (!c.orderers) c.orderers = [];
  if (!c.priceList) c.priceList = [];
  if (!c.ordererByRoute) c.ordererByRoute = {};
  if (!c.preferredRoutes) c.preferredRoutes = []; // {route, count, lastPrice, lastDate}

  // --- 1. Orderer ---
  const orderer = (trip.driver || '').trim();
  if (orderer) {
    if (!c.orderers.includes(orderer)) {
      c.orderers.push(orderer);
      learned.push('מזמין חדש: ' + orderer);
    }
  }

  // --- 2. Route / preferred ---
  const route = (trip.route || trip.columnKey || [trip.origin, trip.destination].filter(Boolean).join(' ')).trim();
  if (route) {
    if (!c.typicalRoutes.includes(route)) {
      c.typicalRoutes.unshift(route);
      // keep list reasonable
      if (c.typicalRoutes.length > 40) c.typicalRoutes = c.typicalRoutes.slice(0, 40);
      learned.push('מסלול חדש: ' + route);
    } else {
      // boost to front
      c.typicalRoutes = [route, ...c.typicalRoutes.filter(r => r !== route)];
    }

    // preferred stats
    let pref = c.preferredRoutes.find(p => p.route === route);
    if (!pref) {
      pref = { route, count: 0, lastPrice: 0, lastDate: '' };
      c.preferredRoutes.push(pref);
    }
    pref.count = (pref.count || 0) + 1;
    if (trip.price) pref.lastPrice = trip.price;
    if (trip.date) pref.lastDate = trip.date;
    // sort by count
    c.preferredRoutes.sort((a, b) => (b.count || 0) - (a.count || 0));
    if (c.preferredRoutes.length > 30) c.preferredRoutes = c.preferredRoutes.slice(0, 30);
  }

  // --- 3. ordererByRoute ---
  if (orderer && route) {
    const prev = c.ordererByRoute[route];
    if (prev !== orderer) {
      c.ordererByRoute[route] = orderer;
      if (!prev) learned.push('שיוך מסלול→מזמין: ' + route + ' → ' + orderer);
      else learned.push('עדכון מזמין למסלול: ' + route + ' → ' + orderer);
    }
  }

  // --- 4. Price list ---
  const price = parseFloat(trip.price);
  if (price > 0) {
    const origin = (trip.origin || trip.line || '').trim();
    const destination = (trip.destination || trip.columnKey || route || '').trim();
    // Also try split route into two parts
    let o = origin, d = destination;
    if ((!o || !d) && route) {
      const parts = route.split(/\s+/).filter(Boolean);
      if (parts.length >= 2 && !o) { o = parts[0]; d = parts.slice(1).join(' '); }
    }
    if (trip.line && trip.columnKey) {
      o = trip.line;
      d = trip.columnKey;
    }

    if (o || d) {
      const match = c.priceList.find(p =>
        placesMatch(p.origin || '', o) && placesMatch(p.destination || '', d)
      );
      if (match) {
        // update price only if different and user entered explicitly (not zero-learn spam)
        if (match.price !== price && !opts.skipPriceUpdate) {
          // require consistency: if same price appears 2+ times, or always update on manual entry
          match.price = price;
          match.active = true;
          match.updatedAt = new Date().toISOString();
          match.notes = (match.notes || '') + '';
          learned.push('מחירון עודכן: ' + (o || '') + ' → ' + (d || '') + ' = ₪' + price);
        }
      } else if (!opts.skipNewPrice) {
        c.priceList.push({
          id: 'pl_learn_' + uid(),
          origin: o || route || 'כללי',
          destination: d || route || '',
          price,
          tripType: 'רגיל',
          active: true,
          notes: 'נלמד מהזנה',
          learnedAt: new Date().toISOString()
        });
        learned.push('מחירון חדש: ' + (o || '') + ' → ' + (d || '') + ' = ₪' + price);
      }
    }
  }

  // --- 5. Line if new ---
  if (trip.line && c.lines && Array.isArray(c.lines) && !c.lines.includes(trip.line)) {
    // only auto-add line for multi-line customers that already have lines
    if (c.lines.length > 0) {
      c.lines.push(trip.line);
      learned.push('קו חדש: ' + trip.line);
    }
  }

  if (learned.length) {
    c.updatedAt = new Date().toISOString();
  }
  return learned.length ? learned : null;
}

function learnFromTrips(trips, opts) {
  const all = [];
  (trips || []).forEach(t => {
    const L = learnFromTrip(t, opts);
    if (L) all.push(...L);
  });
  // unique messages
  return [...new Set(all)];
}

function toastLearned(learned) {
  if (!learned || !learned.length) return;
  const msg = learned.length <= 2
    ? '🧠 נלמד: ' + learned.join(' · ')
    : '🧠 נלמדו ' + learned.length + ' עדכונים להגדרות הלקוח';
  toast(msg, 3500);
}

