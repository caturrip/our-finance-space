// ============================================
// DATA — diselaraskan dengan Financial Planner spreadsheet
// (Financial Planner Mita & Catur | Small Step Daily)
// Update terakhir: Mei 2026 (data Railway 1-5 Mei)
// ============================================

export const couple = {
  partner1: { name: 'Catur', emoji: '👨🏻', color: '#10b981' },
  partner2: { name: 'Vermita', emoji: '👩🏻', color: '#f97316' },
  startedTracking: '2025-08-15',
}

// Summary bulan Mei 2026 — income diupdate manual saat gaji berubah
// Expense & transactionCount dihitung otomatis dari Railway (useFinanceData.js)
export const summary = {
  totalBalance: 8_000_000,          // Estimasi saldo gabungan
  monthlyIncome: 14_500_000,         // Gaji Catur 8jt + Gaji Vermita 6.5jt (update Mei 2026)
  monthlyExpense: 9_917_159,         // Placeholder — diganti live dari Railway
  transactionCount: 25,              // Placeholder — diganti live dari Railway
  savingProgress: 0.00,
  monthlySavingTarget: 2_000_000,
  monthlySavingActual: 0,
  activeMonth: 'Mei',
  activeYear: 2026,
}

// Goals — diselaraskan dengan kategori spreadsheet: Anak, Rumah, Darurat
// Dana Liburan tidak ada di spreadsheet → diganti Dana Darurat
export const goals = [
  {
    id: 1,
    name: 'Dana Persalinan',
    icon: '🍼',
    target: 25_000_000,
    current: 0,
    deadline: 'Sep 2026',
    color: 'from-blush-300 to-peach-400',
    emoji: '💕',
  },
  {
    id: 2,
    name: 'Dana Rumah',
    icon: '🏡',
    target: 200_000_000,
    current: 0,
    deadline: 'Dec 2028',
    color: 'from-finance-400 to-finance-600',
    emoji: '🌿',
  },
  {
    id: 3,
    name: 'Dana Darurat',
    icon: '🛡️',
    target: 52_000_000,
    current: 0,
    deadline: 'Dec 2026',
    color: 'from-peach-300 to-blush-400',
    emoji: '💪',
  },
]

// Pengeluaran per kategori — data Railway Mei 2026 (1-4 Mei, bulan berjalan)
export const expenseByCategory = [
  { name: 'Makanan & Minuman', value: 7_226_881, color: '#10b981', icon: '🍜' },
  { name: 'Kontrakan',         value: 2_200_000, color: '#f97316', icon: '🏠' },
  { name: 'Listrik/Air',       value: 345_278,   color: '#60a5fa', icon: '💡' },
  { name: 'Lainnya',           value: 100_000,   color: '#f08672', icon: '📦' },
]
// Total = 9,917,159 (data Railway 1-5 Mei, bulan masih berjalan)

// Cashflow bulanan 2026 — data nyata dari spreadsheet + Railway
export const monthlyCashflow = [
  { month: 'Jan', income: 0,           expense: 0          },
  { month: 'Feb', income: 8_000_000,   expense: 8_068_689  },
  { month: 'Mar', income: 18_805_050,  expense: 28_284_066 },
  { month: 'Apr', income: 14_093_000,  expense: 17_812_343 },
  { month: 'May', income: 14_500_000,  expense: 9_917_159  },  // Gaji baru Mei 2026
  { month: 'Jun', income: 0,          expense: 0 },
  { month: 'Jul', income: 0,          expense: 0 },
  { month: 'Aug', income: 0,          expense: 0 },
  { month: 'Sep', income: 0,          expense: 0 },
  { month: 'Oct', income: 0,          expense: 0 },
  { month: 'Nov', income: 0,          expense: 0 },
  { month: 'Dec', income: 0,          expense: 0 },
]

// Transaksi Mei 2026 — data aktual Railway (urut terbaru)
export const recentTransactions = [
  // === MEI 5 ===
  { id: 'm0a', date: '2026-05-05', person: 'Vermita', category: 'Makanan & Minuman', description: 'Tahu Gejrot',    amount: 10_000, type: 'expense' },
  { id: 'm0b', date: '2026-05-05', person: 'Catur',   category: 'Transportasi',      description: 'Isi Bensin',     amount: 35_000, type: 'expense' },
  // === MEI 4 ===
  { id: 'm1',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Beli Obeng, Palu, Paku',    amount: 57_981,    type: 'expense' },
  { id: 'm2',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Double Tape',               amount: 20_200,    type: 'expense' },
  { id: 'm3',  date: '2026-05-04', person: 'Catur',   category: 'Listrik/Air',       description: 'Listrik Kontrakan Lama',    amount: 345_278,   type: 'expense' },
  { id: 'm4',  date: '2026-05-04', person: 'Vermita', category: 'Lainnya',           description: 'Transfer Shiva',            amount: 100_000,   type: 'expense' },
  { id: 'm5',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Topup Opera Sabun',         amount: 30_000,    type: 'expense' },
  { id: 'm6',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Dada Ayam',                 amount: 24_000,    type: 'expense' },
  { id: 'm7',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'O Save',                    amount: 158_900,   type: 'expense' },
  { id: 'm8',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Bebek',                     amount: 15_000,    type: 'expense' },
  { id: 'm9',  date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Jagung',                    amount: 12_000,    type: 'expense' },
  { id: 'm10', date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Mie Ayam',                  amount: 47_000,    type: 'expense' },
  { id: 'm11', date: '2026-05-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'KSK FM',                    amount: 23_000,    type: 'expense' },
  // === MEI 3 ===
  { id: 'm12', date: '2026-05-03', person: 'Vermita', category: 'Makanan & Minuman', description: 'Jakarta Cheese Factory',    amount: 143_000,   type: 'expense' },
  { id: 'm13', date: '2026-05-03', person: 'Vermita', category: 'Makanan & Minuman', description: 'Podjok Kopi',               amount: 36_300,    type: 'expense' },
  { id: 'm14', date: '2026-05-03', person: 'Keduanya', category: 'Makanan & Minuman', description: 'Nasi Box Selametan Kontrakan', amount: 528_000, type: 'expense' },
  { id: 'm15', date: '2026-05-03', person: 'Vermita', category: 'Makanan & Minuman', description: 'Podjok Coffee',             amount: 126_500,   type: 'expense' },
  // === MEI 2 ===
  { id: 'm16', date: '2026-05-02', person: 'Vermita', category: 'Makanan & Minuman', description: 'Takoyaki Neysa',            amount: 25_000,    type: 'expense' },
  { id: 'm17', date: '2026-05-02', person: 'Vermita', category: 'Makanan & Minuman', description: 'Telur Gulung',              amount: 10_000,    type: 'expense' },
  { id: 'm18', date: '2026-05-02', person: 'Vermita', category: 'Makanan & Minuman', description: 'Pecel Lele Restu',          amount: 20_000,    type: 'expense' },
  // === MEI 1 ===
  { id: 'm19', date: '2026-05-01', person: 'Vermita', category: 'Makanan & Minuman', description: 'Jasa Angkut Barang',        amount: 300_000,   type: 'expense' },
  { id: 'm20', date: '2026-05-01', person: 'Catur',   category: 'Makanan & Minuman', description: 'Jasa Bongkar Pasang AC',   amount: 950_000,   type: 'expense' },
  { id: 'm21', date: '2026-05-01', person: 'Catur',   category: 'Kontrakan',         description: 'Pelunasan Kontrakan Baru',  amount: 1_700_000, type: 'expense' },
  { id: 'm22', date: '2026-05-01', person: 'Vermita', category: 'Kontrakan',         description: 'DP Kontrakan Baru',         amount: 500_000,   type: 'expense' },
  { id: 'm23', date: '2026-05-01', person: 'Vermita', category: 'Makanan & Minuman', description: 'Bayar Tokped Card',         amount: 3_004_000, type: 'expense' },
  { id: 'm24', date: '2026-05-01', person: 'Vermita', category: 'Makanan & Minuman', description: 'Bayar SPayLater',           amount: 1_040_000, type: 'expense' },
  { id: 'm25', date: '2026-05-01', person: 'Catur',   category: 'Makanan & Minuman', description: 'Spare Part AC',             amount: 656_000,   type: 'expense' },
]

// Budget bulanan per kategori — bisa disesuaikan setiap bulan
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

// Kategori pengeluaran — data Railway Mei 2026 (1-4 Mei, bulan berjalan)
export const expenseCategories = [
  { name: 'Makanan & Minuman', icon: '🍜', color: 'from-finance-300 to-finance-500', count: 21, total: 7_226_881 },
  { name: 'Kontrakan',         icon: '🏠', color: 'from-finance-200 to-finance-400', count: 2,  total: 2_200_000 },
  { name: 'Listrik/Air',       icon: '💡', color: 'from-peach-300 to-peach-500',     count: 1,  total: 345_278   },
  { name: 'Lainnya',           icon: '📦', color: 'from-blush-200 to-peach-300',     count: 1,  total: 100_000   },
]

export const notes = [
  {
    id: 1,
    title: 'Budget Bulanan Mei',
    body: 'Awal Mei sudah keluar Rp9,8jt (4 hari!) termasuk biaya pindah kontrakan. Monitor sisa bulan ketat — jangan sampai over budget lagi!',
    color: 'bg-peach-100',
    darkColor: 'dark:bg-peach-200/20',
    accent: 'bg-peach-300',
    author: 'Catur',
  },
  {
    id: 2,
    title: 'Reminder Tagihan',
    body: 'Kontrakan baru sudah DP & lunas 🏠 Listrik lama sudah dibayar. WiFi tgl 3, cicilan Mei perlu dicatat ulang.',
    color: 'bg-finance-100',
    darkColor: 'dark:bg-finance-300/15',
    accent: 'bg-finance-300',
    author: 'Vermita',
  },
  {
    id: 3,
    title: 'Dana Persalinan',
    body: 'Target Rp25jt untuk biaya persalinan. Sisihkan min Rp2jt/bulan dari Mei. Jangan tunda lagi! 🍼',
    color: 'bg-blush-100',
    darkColor: 'dark:bg-blush-200/15',
    accent: 'bg-blush-300',
    author: 'Catur & Vermita',
  },
  {
    id: 4,
    title: 'Dana Rumah',
    body: 'Target DP Rp200jt. Sisihkan penghasilan side job Panvers Store tiap bulan — konsisten itu kuncinya 🏡',
    color: 'bg-peach-100',
    darkColor: 'dark:bg-peach-200/20',
    accent: 'bg-peach-300',
    author: 'Catur',
  },
  {
    id: 5,
    title: 'Side Job Goals',
    body: 'Panvers Store: target Rp4jt/bulan. Setelah dana darurat aman, alokasikan 50% side income ke tabungan.',
    color: 'bg-finance-100',
    darkColor: 'dark:bg-finance-300/15',
    accent: 'bg-finance-300',
    author: 'Vermita',
  },
  {
    id: 6,
    title: 'Dana Darurat',
    body: 'Target 6x pengeluaran = Rp52jt. Prioritas utama! Mulai Rp1jt/bulan ke rekening terpisah. Jangan ganggu 🛡️',
    color: 'bg-blush-100',
    darkColor: 'dark:bg-blush-200/15',
    accent: 'bg-blush-300',
    author: 'Catur & Vermita',
  },
]

export const chatMessages = [
  { id: 1, from: 'user',  author: 'Vermita', text: 'bayar tokped card 3jt', time: '10:30' },
  { id: 2, from: 'bot',   text: '✅ Expense Rp3.004.000 kategori Makanan & Minuman berhasil dicatat 🍜\n\nTotal pengeluaran bulan ini: Rp9.917.159', time: '10:30' },
  { id: 3, from: 'user',  author: 'Catur',   text: 'bayar pelunasan kontrakan baru 1.7jt BCA', time: '09:00' },
  { id: 4, from: 'bot',   text: '✅ Expense Rp1.700.000 kategori Kontrakan berhasil dicatat 🏠\n\nSelamat kontrakan baru! 🎉', time: '09:00' },
  { id: 5, from: 'user',  author: 'Catur',   text: 'Laporan bulan ini', time: '20:00' },
  {
    id: 6,
    from: 'bot',
    isReport: true,
    text: '',
    time: '20:00',
    report: {
      income: 14_500_000,
      expense: 9_917_159,
      balance: 4_582_841,
      topCategory: 'Makanan & Minuman (Rp7.226.881)',
    },
  },
]

// Breakdown rekening — sesuai metode bayar di spreadsheet:
// BCA (24x), LIVIN/Mandiri (64x), BLU (23x), PNVRS/Panvers (105x paling sering!)
// Saldo adalah estimasi — spreadsheet tidak menyimpan saldo per rekening
export const accountBreakdown = [
  { name: 'BCA',        label: 'Catur – Rekening Utama',  balance: 2_500_000, emoji: '🏦', color: 'from-finance-400 to-finance-600' },
  { name: 'BLU by BCA', label: 'Vermita – Digital Bank',  balance: 2_750_000, emoji: '💙', color: 'from-peach-300 to-peach-500'    },
  { name: 'Mandiri',    label: 'Catur – Rekening Kerja',  balance: 1_800_000, emoji: '🔵', color: 'from-blush-300 to-blush-500'    },
  { name: 'PNVRS',      label: 'Panvers – Vermita',       balance: 1_700_000, emoji: '🛍️', color: 'from-finance-300 to-finance-500' },
]
// Total = 8,750,000 (estimasi)
