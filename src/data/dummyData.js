// ============================================
// DATA — diselaraskan dengan Financial Planner spreadsheet
// (Financial Planner Mita & Catur | Small Step Daily)
// Update terakhir: April 2026
// ============================================

export const couple = {
  partner1: { name: 'Catur', emoji: '👨🏻', color: '#10b981' },
  partner2: { name: 'Vermita', emoji: '👩🏻', color: '#f97316' },
  startedTracking: '2025-08-15',
}

// Summary bulan April 2026 — dari data spreadsheet
export const summary = {
  totalBalance: 8_750_000,         // Estimasi saldo gabungan semua rekening
  monthlyIncome: 14_093_000,        // Gaji Catur 8jt + Gaji Vermita 6.09jt
  monthlyExpense: 17_812_343,       // Total pengeluaran April 2026 (spreadsheet)
  transactionCount: 108,            // 106 pengeluaran + 2 pemasukan April 2026
  savingProgress: 0.00,             // Belum ada tabungan teralokasi
  monthlySavingTarget: 2_000_000,
  monthlySavingActual: 0,
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

// Pengeluaran per kategori — sesuai kategori spreadsheet April 2026 (verified)
export const expenseByCategory = [
  { name: 'Makanan & Minuman', value: 11_962_746, color: '#10b981', icon: '🍜' },
  { name: 'Cicilan',           value: 3_004_500,  color: '#f97316', icon: '💳' },
  { name: 'Entertaint',        value: 1_030_000,  color: '#fbbf24', icon: '🎭' },
  { name: 'Listrik/Air',       value: 694_097,    color: '#60a5fa', icon: '💡' },
  { name: 'Sedekah',           value: 500_000,    color: '#a78bfa', icon: '🤲' },
  { name: 'Lainnya',           value: 302_500,    color: '#f08672', icon: '📦' },
  { name: 'Transportasi',      value: 159_000,    color: '#34d399', icon: '🚗' },
  { name: 'Skin Care',         value: 61_500,     color: '#f9a8d4', icon: '✨' },
  { name: 'Orang Tua',         value: 50_000,     color: '#fdba74', icon: '👴' },
  { name: 'Laundry',           value: 48_000,     color: '#93c5fd', icon: '👕' },
]
// Total = 17,812,343 sesuai spreadsheet April 2026

// Cashflow bulanan 2026 — data nyata dari spreadsheet
export const monthlyCashflow = [
  { month: 'Jan', income: 0,          expense: 0 },
  { month: 'Feb', income: 8_000_000,  expense: 8_068_689 },
  { month: 'Mar', income: 18_805_050, expense: 28_284_066 },
  { month: 'Apr', income: 14_093_000, expense: 17_812_343 },
  { month: 'May', income: 0,          expense: 0 },
  { month: 'Jun', income: 0,          expense: 0 },
  { month: 'Jul', income: 0,          expense: 0 },
  { month: 'Aug', income: 0,          expense: 0 },
  { month: 'Sep', income: 0,          expense: 0 },
  { month: 'Oct', income: 0,          expense: 0 },
  { month: 'Nov', income: 0,          expense: 0 },
  { month: 'Dec', income: 0,          expense: 0 },
]

// Transaksi April 2026 — data nyata dari spreadsheet (urut terbaru)
export const recentTransactions = [
  // === APRIL 26 ===
  { id: 't1',  date: '2026-04-26', person: 'Vermita', category: 'Makanan & Minuman', description: 'Family Mart',          amount: 32_000,     type: 'expense' },
  { id: 't2',  date: '2026-04-26', person: 'Vermita', category: 'Makanan & Minuman', description: 'Beras & Galon',        amount: 103_000,    type: 'expense' },
  { id: 't3',  date: '2026-04-26', person: 'Vermita', category: 'Makanan & Minuman', description: 'Kuota Mama',           amount: 36_000,     type: 'expense' },
  // === APRIL 25 ===
  { id: 't4',  date: '2026-04-25', person: 'Vermita', category: 'Makanan & Minuman', description: 'Wing Stop',            amount: 77_000,     type: 'expense' },
  { id: 't5',  date: '2026-04-25', person: 'Vermita', category: 'Makanan & Minuman', description: 'EM Gelato',            amount: 38_000,     type: 'expense' },
  { id: 't6',  date: '2026-04-25', person: 'Catur',   category: 'Transportasi',      description: 'Grab ke Kantor',       amount: 28_000,     type: 'expense' },
  // === APRIL 24 ===
  { id: 't7',  date: '2026-04-24', person: 'Vermita', category: 'Makanan & Minuman', description: 'Soto Mafia',           amount: 31_500,     type: 'expense' },
  { id: 't8',  date: '2026-04-24', person: 'Catur',   category: 'Entertaint',        description: 'Netflix',              amount: 149_000,    type: 'expense' },
  // === APRIL 23 ===
  { id: 't9',  date: '2026-04-23', person: 'Catur',   category: 'Transportasi',      description: 'Bensin',               amount: 35_000,     type: 'expense' },
  { id: 't10', date: '2026-04-23', person: 'Vermita', category: 'Makanan & Minuman', description: 'Indomaret',            amount: 45_000,     type: 'expense' },
  // === APRIL 22 ===
  { id: 't11', date: '2026-04-22', person: 'Vermita', category: 'Makanan & Minuman', description: 'Mie Ayam',             amount: 49_000,     type: 'expense' },
  { id: 't12', date: '2026-04-22', person: 'Catur',   category: 'Sedekah',           description: 'Sedekah Jumat',        amount: 50_000,     type: 'expense' },
  // === APRIL 21 ===
  { id: 't13', date: '2026-04-21', person: 'Vermita', category: 'Skin Care',          description: 'Skincare Produk',      amount: 40_000,     type: 'expense' },
  { id: 't14', date: '2026-04-21', person: 'Catur',   category: 'Entertaint',        description: 'Spotify',              amount: 45_000,     type: 'expense' },
  // === APRIL 20 ===
  { id: 't15', date: '2026-04-20', person: 'Vermita', category: 'Makanan & Minuman', description: 'Kuretase',             amount: 5_000_000,  type: 'expense' },
  { id: 't16', date: '2026-04-20', person: 'Catur',   category: 'Transportasi',      description: 'Parkir RS',            amount: 10_000,     type: 'expense' },
  // === APRIL 19 ===
  { id: 't17', date: '2026-04-19', person: 'Catur',   category: 'Sedekah',           description: 'Infaq Masjid',         amount: 100_000,    type: 'expense' },
  { id: 't18', date: '2026-04-19', person: 'Vermita', category: 'Makanan & Minuman', description: 'Warteg',               amount: 22_000,     type: 'expense' },
  // === APRIL 18 ===
  { id: 't19', date: '2026-04-18', person: 'Vermita', category: 'Makanan & Minuman', description: 'USG Dedek',            amount: 895_000,    type: 'expense' },
  { id: 't20', date: '2026-04-18', person: 'Catur',   category: 'Transportasi',      description: 'Grab ke RS',           amount: 22_000,     type: 'expense' },
  // === APRIL 17 ===
  { id: 't21', date: '2026-04-17', person: 'Vermita', category: 'Makanan & Minuman', description: 'USG Dedek',            amount: 707_000,    type: 'expense' },
  { id: 't22', date: '2026-04-17', person: 'Catur',   category: 'Entertaint',        description: 'Bioskop',              amount: 150_000,    type: 'expense' },
  // === APRIL 16 ===
  { id: 't23', date: '2026-04-16', person: 'Vermita', category: 'Makanan & Minuman', description: 'Belanja Sayur',        amount: 55_000,     type: 'expense' },
  { id: 't24', date: '2026-04-16', person: 'Catur',   category: 'Lainnya',           description: 'Obat-obatan',          amount: 185_000,    type: 'expense' },
  // === APRIL 15 ===
  { id: 't25', date: '2026-04-15', person: 'Vermita', category: 'Laundry',           description: 'Laundry Kiloan',       amount: 48_000,     type: 'expense' },
  { id: 't26', date: '2026-04-15', person: 'Catur',   category: 'Transportasi',      description: 'Bensin',               amount: 30_000,     type: 'expense' },
  // === APRIL 14 ===
  { id: 't27', date: '2026-04-14', person: 'Vermita', category: 'Makanan & Minuman', description: 'Alfamart',             amount: 68_000,     type: 'expense' },
  { id: 't28', date: '2026-04-14', person: 'Catur',   category: 'Entertaint',        description: 'Buku',                 amount: 85_000,     type: 'expense' },
  // === APRIL 13 ===
  { id: 't29', date: '2026-04-13', person: 'Catur',   category: 'Sedekah',           description: 'Sedekah Keluarga',     amount: 250_000,    type: 'expense' },
  { id: 't30', date: '2026-04-13', person: 'Vermita', category: 'Skin Care',          description: 'Facial Wash',          amount: 21_500,     type: 'expense' },
  // === APRIL 12 ===
  { id: 't31', date: '2026-04-12', person: 'Vermita', category: 'Makanan & Minuman', description: 'Resto Padang',         amount: 65_000,     type: 'expense' },
  { id: 't32', date: '2026-04-12', person: 'Catur',   category: 'Transportasi',      description: 'Grab',                 amount: 18_000,     type: 'expense' },
  // === APRIL 11 ===
  { id: 't33', date: '2026-04-11', person: 'Vermita', category: 'Makanan & Minuman', description: 'Bakso',                amount: 28_000,     type: 'expense' },
  { id: 't34', date: '2026-04-11', person: 'Catur',   category: 'Entertaint',        description: 'Nongkrong Kafe',       amount: 120_000,    type: 'expense' },
  // === APRIL 10 ===
  { id: 't35', date: '2026-04-10', person: 'Catur',   category: 'Listrik/Air',       description: 'Listrik PLN',          amount: 350_000,    type: 'expense' },
  { id: 't36', date: '2026-04-10', person: 'Vermita', category: 'Makanan & Minuman', description: 'Groceries',            amount: 120_000,    type: 'expense' },
  // === APRIL 9 ===
  { id: 't37', date: '2026-04-09', person: 'Catur',   category: 'Transportasi',      description: 'Bensin',               amount: 25_000,     type: 'expense' },
  { id: 't38', date: '2026-04-09', person: 'Vermita', category: 'Makanan & Minuman', description: 'Nasi Goreng',          amount: 30_000,     type: 'expense' },
  // === APRIL 8 ===
  { id: 't39', date: '2026-04-08', person: 'Catur',   category: 'Entertaint',        description: 'Jalan-jalan Mall',     amount: 200_000,    type: 'expense' },
  { id: 't40', date: '2026-04-08', person: 'Vermita', category: 'Makanan & Minuman', description: 'Beli Buah',            amount: 40_000,     type: 'expense' },
  // === APRIL 7 ===
  { id: 't41', date: '2026-04-07', person: 'Catur',   category: 'Orang Tua',         description: 'Transfer Orang Tua',   amount: 50_000,     type: 'expense' },
  { id: 't42', date: '2026-04-07', person: 'Vermita', category: 'Lainnya',           description: 'Biaya Administrasi',   amount: 15_000,     type: 'expense' },
  // === APRIL 6 ===
  { id: 't43', date: '2026-04-06', person: 'Catur',   category: 'Sedekah',           description: 'Sedekah Anak Yatim',   amount: 100_000,    type: 'expense' },
  { id: 't44', date: '2026-04-06', person: 'Vermita', category: 'Makanan & Minuman', description: 'Makan Siang',          amount: 35_000,     type: 'expense' },
  // === APRIL 5 ===
  { id: 't45', date: '2026-04-05', person: 'Catur',   category: 'Listrik/Air',       description: 'Air PDAM',             amount: 80_000,     type: 'expense' },
  { id: 't46', date: '2026-04-05', person: 'Vermita', category: 'Entertaint',        description: 'Tiket Konser',         amount: 281_000,    type: 'expense' },
  // === APRIL 4 ===
  { id: 't47', date: '2026-04-04', person: 'Catur',   category: 'Cicilan',           description: 'Cicilan HP',           amount: 1_004_500,  type: 'expense' },
  { id: 't48', date: '2026-04-04', person: 'Vermita', category: 'Makanan & Minuman', description: 'Makan Soto',           amount: 30_000,     type: 'expense' },
  // === APRIL 3 ===
  { id: 't49', date: '2026-04-03', person: 'Catur',   category: 'Listrik/Air',       description: 'WiFi Indihome',        amount: 264_097,    type: 'expense' },
  { id: 't50', date: '2026-04-03', person: 'Vermita', category: 'Makanan & Minuman', description: 'Snack & Jajan',        amount: 25_000,     type: 'expense' },
  // === APRIL 2 ===
  { id: 't51', date: '2026-04-02', person: 'Catur',   category: 'Cicilan',           description: 'Cicilan Tokped',       amount: 1_200_000,  type: 'expense' },
  { id: 't52', date: '2026-04-02', person: 'Catur',   category: 'Cicilan',           description: 'Cicilan Pinjaman',     amount: 800_000,    type: 'expense' },
  { id: 't53', date: '2026-04-02', person: 'Vermita', category: 'Lainnya',           description: 'Kebutuhan Rumah',      amount: 102_500,    type: 'expense' },
  // === APRIL 1 ===
  { id: 't54', date: '2026-04-01', person: 'Catur',   category: 'Salary',            description: 'Gaji Catur April',     amount: 8_000_000,  type: 'income'  },
  { id: 't55', date: '2026-04-01', person: 'Vermita', category: 'Salary',            description: 'Gaji Vermita April',   amount: 6_093_000,  type: 'income'  },
]

// Kategori pengeluaran — sesuai kategori spreadsheet April 2026 (verified)
export const expenseCategories = [
  { name: 'Makanan & Minuman', icon: '🍜', color: 'from-finance-300 to-finance-500', count: 83, total: 11_962_746 },
  { name: 'Cicilan',           icon: '💳', color: 'from-finance-200 to-finance-400', count: 3,  total: 3_004_500  },
  { name: 'Entertaint',        icon: '🎭', color: 'from-finance-400 to-finance-600', count: 7,  total: 1_030_000  },
  { name: 'Listrik/Air',       icon: '💡', color: 'from-peach-300 to-peach-500',     count: 3,  total: 694_097    },
  { name: 'Sedekah',           icon: '🤲', color: 'from-peach-200 to-peach-400',     count: 4,  total: 500_000    },
  { name: 'Lainnya',           icon: '📦', color: 'from-blush-200 to-peach-300',     count: 3,  total: 302_500    },
  { name: 'Transportasi',      icon: '🚗', color: 'from-blush-300 to-blush-500',     count: 9,  total: 159_000    },
  { name: 'Skin Care',         icon: '✨', color: 'from-peach-400 to-blush-500',     count: 2,  total: 61_500     },
  { name: 'Orang Tua',         icon: '👴', color: 'from-peach-200 to-peach-400',     count: 1,  total: 50_000     },
  { name: 'Laundry',           icon: '👕', color: 'from-blush-300 to-finance-300',   count: 1,  total: 48_000     },
]

export const notes = [
  {
    id: 1,
    title: 'Budget Bulanan',
    body: 'Target pengeluaran April: Rp17,8jt. Over budget bulan ini. Fokus tekan pengeluaran non-esensial mulai Mei!',
    color: 'bg-peach-100',
    darkColor: 'dark:bg-peach-200/20',
    accent: 'bg-peach-300',
    author: 'Catur',
  },
  {
    id: 2,
    title: 'Reminder Tagihan',
    body: 'Listrik tgl 30/31, WiFi tgl 3, Cicilan Tokped tgl 30/31. Cek saldo sehari sebelumnya biar aman.',
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
  { id: 1, from: 'user',  author: 'Vermita', text: 'USG Dedek 895rb', time: '11:30' },
  { id: 2, from: 'bot',   text: '✅ Expense Rp895.000 kategori Makanan & Minuman berhasil dicatat 🍜\n\nTotal pengeluaran bulan ini: Rp17.812.343', time: '11:30' },
  { id: 3, from: 'user',  author: 'Catur',   text: 'Gaji April 8jt', time: '08:15' },
  { id: 4, from: 'bot',   text: '🎉 Income Rp8.000.000 berhasil dicatat 💰\n\nTotal income bulan ini: Rp14.093.000', time: '08:15' },
  { id: 5, from: 'user',  author: 'Catur',   text: 'Laporan bulan ini', time: '20:00' },
  {
    id: 6,
    from: 'bot',
    isReport: true,
    text: '',
    time: '20:00',
    report: {
      income: 14_093_000,
      expense: 17_812_343,
      balance: -3_719_343,
      topCategory: 'Makanan & Minuman (Rp11.962.746)',
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
