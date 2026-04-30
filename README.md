# Our Finance Space 💚

> **Managing money, building our future.**

Personal Couple Finance Dashboard — premium, aesthetic, mobile-first dashboard
yang terhubung langsung dengan WhatsApp Finance Bot yang ter-deploy di Railway.

Dibangun untuk **Catur ❤️ Vermita** — bukan SaaS, bukan publik, hanya untuk
penggunaan pribadi keluarga kami.

---

## ✨ Fitur

- **Hero Section** — full-screen dengan gradient, blob animation, dan greeting dinamis
- **Summary Cards** — 5 glass cards dengan count-up animation (Balance, Income, Expense, Transactions, Saving)
- **Saving Goals** — progress bar animated untuk Dana Persalinan, Dana Rumah, Dana Liburan
- **Charts** — Pie Chart kategori + Area Chart cashflow tahunan (Recharts)
- **WhatsApp Bot Mockup** — phone frame realistis dengan chat preview
- **Recent Transactions** — tabel dengan filter & search, mobile-card di layar kecil
- **Category Grid** — kategori yang sinkron dari bot
- **Sticky Notes** — finance reminders dengan tampilan kertas catatan
- **Dark Mode** — toggle persistent (localStorage)
- **Glassmorphism** — di seluruh card
- **Smooth Animations** — Framer Motion di setiap section
- **Mobile-first** — responsive hingga viewport 360px

---

## 🛠 Tech Stack

| Layer | Tool |
|---|---|
| Framework | **React 18** + **Vite 5** |
| Styling | **Tailwind CSS 3** (custom theme) |
| Animation | **Framer Motion 11** |
| Charts | **Recharts 2** |
| Count-up | **react-countup** |
| Icons | **lucide-react** |
| HTTP | **axios** |
| Fonts | Fraunces (display) + Plus Jakarta Sans (body) + JetBrains Mono (numbers) |

---

## 📁 Struktur Folder

```
our-finance-space/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Background.jsx          # Floating blob & grid background
│   │   ├── Navbar.jsx               # Top nav + dark toggle + live indicator
│   │   ├── Hero.jsx                 # Full-screen hero
│   │   ├── SectionHeader.jsx        # Reusable section heading
│   │   ├── SummaryCards.jsx         # 5 glass summary cards
│   │   ├── SavingGoals.jsx          # Couple goals progress
│   │   ├── Charts.jsx               # Pie + Area charts
│   │   ├── WhatsAppMockup.jsx       # Phone frame + chat preview
│   │   ├── RecentTransactions.jsx   # Table + filter + search
│   │   ├── CategoryGrid.jsx         # Category icons grid
│   │   ├── FinanceNotes.jsx         # Sticky-note style reminders
│   │   └── Footer.jsx
│   ├── data/
│   │   └── dummyData.js             # All fallback / demo data
│   ├── hooks/
│   │   ├── useDarkMode.js           # Theme persistence
│   │   └── useFinanceData.js        # Fetch all data + fallback
│   ├── services/
│   │   └── financeApi.js            # Axios client → Railway bot
│   ├── utils/
│   │   └── format.js                # Rupiah / date formatters
│   ├── App.jsx                      # Section orchestrator
│   ├── main.jsx                     # React entry
│   └── index.css                    # Tailwind + global styles
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
```

Lalu edit `.env`:
```env
VITE_API_BASE_URL=https://your-bot.up.railway.app/api
VITE_API_TOKEN=your_optional_bearer_token
```

> **Tanpa env file, dashboard tetap jalan** dengan dummy data realistis. Sangat berguna untuk preview UI / development.

### 3. Run dev server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 4. Build untuk production
```bash
npm run build
npm run preview
```

Output ada di folder `dist/`.

---

## 🔌 Integrasi dengan Railway WhatsApp Bot

Dashboard ini akan otomatis fetch data dari Railway backend kalian via endpoint berikut.
Pastikan bot kalian expose endpoint-endpoint ini (kalian bisa adjust path-nya di `src/services/financeApi.js`):

| Endpoint | Method | Returns |
|---|---|---|
| `/summary` | GET | `{ totalBalance, monthlyIncome, monthlyExpense, transactionCount, savingProgress, monthlySavingTarget, monthlySavingActual }` |
| `/goals` | GET | `Goal[]` — array of saving goals |
| `/expense-categories` | GET | `Category[]` — kategori grid |
| `/expense-by-category` | GET | `{ name, value, color, icon }[]` — untuk pie chart |
| `/monthly-cashflow` | GET | `{ month, income, expense }[]` — 12 bulan |
| `/transactions` | GET | `Transaction[]` — recent transactions |
| `/notes` | GET | `Note[]` — sticky notes |
| `/couple` | GET | `{ partner1, partner2, startedTracking }` |

Lihat `src/data/dummyData.js` untuk shape lengkap setiap object.

### Auto-fallback
Setiap endpoint yang gagal di-fetch (network error, 404, 401, dll.) akan otomatis fallback ke dummy data tanpa breaking UI. Indikator **Live · Railway** vs **Demo Mode** muncul di navbar.

---

## 🚢 Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

Set environment variables (`VITE_API_BASE_URL`, `VITE_API_TOKEN`) di Vercel dashboard.

### Netlify
```bash
npm run build
# Drag folder dist/ ke Netlify Drop
```

### Railway (sekalian dengan bot)
1. Push project ke GitHub
2. Railway → New Project → Deploy from GitHub
3. Build command: `npm run build`
4. Start command: `npx serve -s dist`
5. Set env variables

### Cloudflare Pages
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 🎨 Customization

### Ganti nama pasangan
Edit `src/data/dummyData.js`:
```js
export const couple = {
  partner1: { name: 'YourName', emoji: '👨🏻', color: '#10b981' },
  partner2: { name: 'PartnerName', emoji: '👩🏻', color: '#f37432' },
}
```

### Ganti palet warna
Edit `tailwind.config.js` di section `colors.finance`, `colors.peach`, `colors.blush`.

### Ganti font
Edit `index.html` (Google Fonts links) dan `tailwind.config.js` (`fontFamily`).

---

## 💚 Notes

- Glassmorphism cards menggunakan `backdrop-filter: blur` — pastikan browser kalian support (semua browser modern OK)
- Dark mode toggle saved di `localStorage` dengan key `ofs-theme`
- Semua angka diformat ke Rupiah dengan `Intl.NumberFormat('id-ID')`
- Numbers menggunakan tabular figures (JetBrains Mono) supaya nggak jumping

---

**Built with ❤️ for our family financial journey.**

— Catur & Vermita
