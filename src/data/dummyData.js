// ============================================
// CONFIG — data konfigurasi yang diupdate manual
// Bukan dummy/fallback — ini adalah data nyata yang di-set secara manual
// ============================================

// Identitas pasangan — config tetap
export const couple = {
  partner1: { name: 'Catur', emoji: '👨🏻', color: '#10b981' },
  partner2: { name: 'Vermita', emoji: '👩🏻', color: '#f97316' },
  startedTracking: '2025-08-15',
}

// Budget bulanan per kategori — update sesuai keputusan bersama
export const categoryBudgets = {
  'Makanan & Minuman': 4_500_000,
  'Kontrakan':         2_200_000,
  'Cicilan':           2_000_000,
  'Transportasi':      600_000,
  'Listrik/Air':       450_000,
  'Sedekah':           500_000,
  'Orang Tua':         500_000,
  'Uang Harian':       500_000,
  'Skin Care':         400_000,
  'Entertaint':        300_000,
  'Laundry':           200_000,
  'Lainnya':           300_000,
}

// Saldo rekening — update manual setiap kali saldo berubah
// (data ini tidak bisa otomatis karena tidak terhubung ke rekening bank)
export const accountBreakdown = [
  { name: 'BCA',        label: 'Catur – Rekening Utama',  balance: 2_500_000, emoji: '🏦', color: 'from-finance-400 to-finance-600' },
  { name: 'BLU by BCA', label: 'Vermita – Digital Bank',  balance: 2_750_000, emoji: '💙', color: 'from-peach-300 to-peach-500'    },
  { name: 'Mandiri',    label: 'Catur – Rekening Kerja',  balance: 1_800_000, emoji: '🔵', color: 'from-blush-300 to-blush-500'    },
  { name: 'PNVRS',      label: 'Panvers – Vermita',       balance: 1_700_000, emoji: '🛍️', color: 'from-finance-300 to-finance-500' },
]

// ============================================
// CASHFLOW HISTORIS — data nyata dari spreadsheet
// Update bulan ini otomatis dari Railway, bulan lalu di-update manual di sini
// ============================================
export const monthlyCashflow = [
  { month: 'Jan', income: 0,           expense: 0          },
  { month: 'Feb', income: 8_000_000,   expense: 8_068_689  },
  { month: 'Mar', income: 18_805_050,  expense: 28_284_066 },
  { month: 'Apr', income: 14_093_000,  expense: 17_812_343 },
  { month: 'Mei', income: 14_500_000,  expense: 11_145_414 }, // ← override oleh Railway
  { month: 'Jun', income: 0,           expense: 0          },
  { month: 'Jul', income: 0,           expense: 0          },
  { month: 'Agu', income: 0,           expense: 0          },
  { month: 'Sep', income: 0,           expense: 0          },
  { month: 'Okt', income: 0,           expense: 0          },
  { month: 'Nov', income: 0,           expense: 0          },
  { month: 'Des', income: 0,           expense: 0          },
]

// ============================================
// TRANSAKSI MANUAL — transaksi nyata dari spreadsheet yang BELUM masuk Railway
// Karena diinput langsung di spreadsheet (bukan lewat WA Bot)
// Update setiap kali ada transaksi besar yang tidak lewat bot
// ============================================
export const manualTransactions = [
  // === MEI 1 — pindahan kontrakan & bayar cicilan ===
  { id: 'manual_kontrakan_1', date: '2026-05-01', person: 'Catur',    category: 'Kontrakan', description: 'Pelunasan Kontrakan Baru',   amount: 1_700_000, type: 'expense' },
  { id: 'manual_kontrakan_2', date: '2026-05-01', person: 'Vermita',  category: 'Kontrakan', description: 'DP Kontrakan Baru',           amount: 500_000,   type: 'expense' },
  { id: 'manual_cicilan_1',   date: '2026-05-01', person: 'Vermita',  category: 'Cicilan',   description: 'Bayar Tokped Card',           amount: 3_004_000, type: 'expense' },
  { id: 'manual_cicilan_2',   date: '2026-05-01', person: 'Vermita',  category: 'Cicilan',   description: 'Bayar SPayLater',             amount: 1_040_000, type: 'expense' },
  { id: 'manual_pindahan_1',  date: '2026-05-01', person: 'Vermita',  category: 'Lainnya',   description: 'Jasa Angkut Barang',          amount: 300_000,   type: 'expense' },
  { id: 'manual_pindahan_2',  date: '2026-05-01', person: 'Catur',    category: 'Lainnya',   description: 'Jasa Bongkar Pasang AC',      amount: 950_000,   type: 'expense' },
  { id: 'manual_pindahan_3',  date: '2026-05-01', person: 'Catur',    category: 'Lainnya',   description: 'Spare Part AC',               amount: 656_000,   type: 'expense' },
  // === MEI 2 ===
  { id: 'manual_m16',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Takoyaki Neysa',      amount: 25_000,    type: 'expense' },
  { id: 'manual_m17',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Telur Gulung',        amount: 10_000,    type: 'expense' },
  { id: 'manual_m18',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Pecel Lele Restu',    amount: 20_000,    type: 'expense' },
  // === MEI 3 ===
  { id: 'manual_m12',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Jakarta Cheese Factory', amount: 143_000, type: 'expense' },
  { id: 'manual_m13',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Podjok Kopi',         amount: 36_300,    type: 'expense' },
  { id: 'manual_m14',         date: '2026-05-03', person: 'Keduanya', category: 'Makanan & Minuman', description: 'Nasi Box Selametan Kontrakan', amount: 528_000, type: 'expense' },
  { id: 'manual_m15',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Podjok Coffee',       amount: 126_500,   type: 'expense' },
]

// Contoh percakapan untuk demo UI WhatsApp Bot — bukan data nyata
export const chatMessages = [
  { id: 1, from: 'user', author: 'Catur',   text: 'catat makan siang 35rb',             time: '12:05' },
  { id: 2, from: 'bot',  text: '✅ Expense Rp35.000 kategori Makanan & Minuman berhasil dicatat 🍜\n\nTotal pengeluaran hari ini diperbarui.', time: '12:05' },
  { id: 3, from: 'user', author: 'Vermita', text: 'bayar cicilan kartu kredit 2.5jt',   time: '14:30' },
  { id: 4, from: 'bot',  text: '✅ Expense Rp2.500.000 kategori Cicilan berhasil dicatat 💳\n\nSisa budget Cicilan diperbarui.', time: '14:30' },
  { id: 5, from: 'user', author: 'Catur',   text: 'laporan bulan ini',                  time: '20:00' },
  {
    id: 6,
    from: 'bot',
    isReport: true,
    text: '',
    time: '20:00',
    report: {
      income: 14_500_000,
      expense: 11_145_414,
      balance: 3_354_586,
      topCategory: 'Cicilan (Rp4.044.000)',
    },
  },
]
