# دعوة زفاف عمر و زينب — Wedding e-invitation (Next.js + MongoDB)

## التشغيل محلياً / Run locally
```bash
npm install
cp .env.example .env.local   # ثم ضع رابط MongoDB وكلمة سر الأدمن
npm run dev                  # http://localhost:3000
```

## المتغيرات / Environment variables
| Name | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (e.g. free MongoDB Atlas cluster) |
| `MONGODB_DB` | Database name (default `eventcard`) |
| `ADMIN_USERNAME` | Dashboard username (default `admin`) |
| `ADMIN_PASSWORD` | Dashboard password |
| `ADMIN_SECRET` | Long random string used to sign the login cookie |

## الصفحات / Pages
- `/` — الدعوة. أرسل لكل ضيف رابط بأسمائهم: `/?g=أحمد,سارة`
- `/admin` — لوحة التحكم: عدد الردود، من سيحضر، الرسائل، حذف، تصدير CSV
- `/admin/login` — تسجيل دخول الأدمن

## تعديل المعلومات / Editing content
كل النصوص والمعلومات (الأسماء، التاريخ، المكان، الهدايا، الصور، الموسيقى) في **`lib/config.ts`**.
- الصور في `public/images/`
- الموسيقى `public/music.mp3` (مقطوعة أصلية مولّدة — استبدلها بأي ملف mp3 بنفس الاسم)

## النشر / Deploy
أسهل طريقة: Vercel + MongoDB Atlas (مجاني). اربط المستودع على Vercel وأضف المتغيرات أعلاه.
In MongoDB Atlas, allow network access from `0.0.0.0/0` (Vercel has no fixed IPs).
