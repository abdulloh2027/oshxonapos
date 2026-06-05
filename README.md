# 🍽️ Oshxona POS

React + TypeScript + Firebase asosidagi oshxona POS tizimi.

## Texnologiyalar

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Firebase (Firestore + Authentication)
- React Router v6 (routing)
- Lucide React (ikonalar)
- Recharts (grafiklar)
- Vercel (deploy)

## O'rnatish

```bash
npm install
npm run dev
```

## Firebase sozlash

1. Firebase Console → Authentication → Users → "Add user" bosing
2. Email va parol kiriting (kassir uchun)

## Foydalanish

1. `npm run dev` — local server
2. Browser: `http://localhost:5173`
3. Login qiling (Firebase'da yaratgan email/parol)
4. Menyu sahifasida "Namuna menyu" tugmasini bosing — 12 ta standart taom qo'shiladi
5. Kassir sahifasida buyurtma qabul qilishni boshlang

## Modullar

- **Kassir** — buyurtma qabul qilish, to'lov
- **Buyurtmalar** — real-time buyurtmalar boshqaruvi
- **Menyu** — taomlar qo'shish/tahrirlash/o'chirish
- **Hisobot** — kunlik va haftalik statistika

## Deploy (Vercel)

```bash
npm run build
```

Vercel.com → New Project → GitHub repo import → Deploy

### Vercel Environment Variables:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
