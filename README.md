# מערכת ניהול נסיעות — GitHub + Cloud Sync

גרסה משודרגת של המערכת המקורית. כל הפונקציות הקיימות נשמרו, והאחסון עבר מ-localStorage לשמירה בענן באמצעות Supabase.

## מה כלול
- הזנה מהירה והדבקת WhatsApp
- סיווג, מחירון והצעות מחיר
- בחירת ימים מרובים
- עמדת מזכירה ותצוגת קווים בסגנון Excel
- נסיעות החודש, עריכה ומחיקה מרובות
- דשבורד ודוחות
- ניהול לקוחות ומזמינים
- ייבוא Excel/CSV עם בדיקה ואישור מרוכז
- ייבוא WhatsApp TXT/ZIP
- סוכן Gemini
- גיבוי/שחזור JSON
- למידה אוטומטית ממסלולים ומחירים
- שמירה בענן
- התחברות עם משתמש/סיסמה
- סנכרון בזמן אמת בין כמה מכשירים
- RTL עברית ועיצוב UI חדש

## הקמה חד-פעמית

### 1. Supabase
1. צור פרויקט חדש ב-Supabase.
2. פתח SQL Editor והרץ את `supabase-setup.sql`.
3. ודא ש-Realtime פעיל עבור `public.app_state`.
4. קח מ-Project Settings → API את:
   - Project URL
   - anon public key

### 2. הגדרת האתר
פתח:
`trip_manager/supabase-config.js`

והכנס:
```js
window.SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

אין לשים כאן service_role key. רק anon/public key.

### 3. GitHub Pages
העלה את תוכן תיקיית `trip_manager` ל-repository.
ב-GitHub:
Settings → Pages → Deploy from branch → main → /(root)

או העלה את הקבצים לשורש הריפו.

### 4. משתמשים
בכניסה הראשונה לחץ "יצירת חשבון", הזן אימייל וסיסמה.
אם בפרויקט Supabase מופעל אימות אימייל, יש לאשר את כתובת האימייל לפני הכניסה.

## סנכרון
לאחר כניסה, הנתונים נשמרים בשורת הענן של המשתמש. פתיחת אותו חשבון במחשב/טלפון אחר תטען את אותם נתונים.
שינויים ממכשיר אחר מגיעים בזמן אמת דרך Supabase Realtime.

## אבטחה
- אין localStorage לנתוני העסק.
- כל משתמש רואה רק את הרשומה שלו באמצעות RLS.
- אין service_role key בקוד.
- מפתח Gemini אינו מוטמע בקוד המקור. הוא נשמר כחלק מ-state הפרטי של המשתמש בענן.
- מומלץ לא לשתף את קובץ ה-SQL או פרטי הפרויקט מעבר לנדרש.

## הערה על Gemini
מפתח Gemini עדיין מאפשר למערכת הקיימת לעבוד עם סוכן ה-AI, אבל לא קיים יותר מפתח סודי קשיח בתוך JavaScript.
