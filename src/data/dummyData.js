// ============================================
// DATA — diselaraskan dengan Financial Planner spreadsheet
// (Financial Planner Mita & Catur | Small Step Daily)
// Update terakhir: 11 Mei 2026
// Railway: 46 expense (4-11 Mei, hanya Catur via bot)
// Manual top-up: 14 transaksi Mei 1-3 yang tidak masuk Railway
// Total Mei: Rp11.145.414 (Railway + manual)
// ============================================

export const couple = {
  partner1: { name: 'Catur', emoji: '👨🏻', color: '#10b981' },
  partner2: { name: 'Vermita', emoji: '👩🏻', color: '#f97316' },
  startedTracking: '2025-08-15',
}

// Summary bulan Mei 2026 — income diupdate manual saat gaji berubah
// Expense & transactionCount dihitung otomatis dari Railway (useFinanceData.js)
export const summary = {
  totalBalance: 8_000_000,
  monthlyIncome: 14_500_000,    // Gaji Catur 8jt + Vermita 6.5jt
  monthlyExpense: 11_145_414,   // Railway (2.1jt) + manual top-up (9jt) Mei
  transactionCount: 60,
  savingProgress: 0.00,
  monthlySavingTarget: 2_000_000,
  monthlySavingActual: 0,
  activeMonth: 'Mei',
  activeYear: 2026,
}

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

// Chart data — Railway + manual top-up Mei 2026
export const expenseByCategory = [
  { name: 'Cicilan',           value: 4_044_000, color: '#f97316', icon: '💳' },
  { name: 'Kontrakan',         value: 2_200_000, color: '#6366f1', icon: '🏠' },
  { name: 'Lainnya',           value: 2_031_000, color: '#f08672', icon: '📦' },
  { name: 'Makanan & Minuman', value: 2_013_631, color: '#10b981', icon: '🍜' },
  { name: 'Entertaint',        value: 446_505,   color: '#fbbf24', icon: '🎭' },
  { name: 'Listrik/Air',       value: 345_278,   color: '#60a5fa', icon: '💡' },
  { name: 'Transportasi',      value: 35_000,    color: '#34d399', icon: '🚗' },
  { name: 'Laundry',           value: 30_000,    color: '#93c5fd', icon: '👕' },
]
// Total = 11,145,414

// Cashflow bulanan 2026 — data nyata dari spreadsheet + Railway
export const monthlyCashflow = [
  { month: 'Jan', income: 0,           expense: 0          },
  { month: 'Feb', income: 8_000_000,   expense: 8_068_689  },
  { month: 'Mar', income: 18_805_050,  expense: 28_284_066 },
  { month: 'Apr', income: 14_093_000,  expense: 17_812_343 },
  { month: 'May', income: 14_500_000,  expense: 11_145_414 },
  { month: 'Jun', income: 0,           expense: 0          },
  { month: 'Jul', income: 0,           expense: 0          },
  { month: 'Aug', income: 0,           expense: 0          },
  { month: 'Sep', income: 0,           expense: 0          },
  { month: 'Oct', income: 0,           expense: 0          },
  { month: 'Nov', income: 0,           expense: 0          },
  { month: 'Dec', income: 0,           expense: 0          },
]

// Transaksi yang TIDAK masuk Railway (Mei 1-3, input langsung ke spreadsheet).
// Di-merge dengan data Railway live di buildDashboard (useFinanceData.js).
// ID prefix 'manual_' agar tidak bentrok dengan sheet_exp_* dari Railway.
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

// Semua transaksi Mei 2026 — Railway (sheet_exp_*) + manual top-up
// Dipakai sebagai fallback saat Railway down (Demo Mode)
export const recentTransactions = [
  // === MEI 11 (Railway) ===
  { id: 'sheet_exp_464', date: '2026-05-11', person: 'Catur',    category: 'Makanan & Minuman', description: 'KSK Less Sugar',               amount: 11_500,    type: 'expense' },
  // === MEI 10 (Railway) ===
  { id: 'sheet_exp_454', date: '2026-05-10', person: 'Catur',    category: 'Entertaint',        description: 'Crocs Hadiah Ayah Ulang Tahun', amount: 399_000,   type: 'expense' },
  { id: 'sheet_exp_455', date: '2026-05-10', person: 'Catur',    category: 'Entertaint',        description: 'Ongkos Kirim AIS',              amount: 20_000,    type: 'expense' },
  { id: 'sheet_exp_456', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'Soto Ceker Pasar Slipi',        amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_457', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'Galon Batre Spons',             amount: 32_000,    type: 'expense' },
  { id: 'sheet_exp_458', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'Warteg Ortega',                 amount: 37_000,    type: 'expense' },
  { id: 'sheet_exp_459', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'Mie Goreng Jawa',               amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_460', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'IKEA',                          amount: 34_800,    type: 'expense' },
  { id: 'sheet_exp_461', date: '2026-05-10', person: 'Catur',    category: 'Entertaint',        description: 'Kantong',                       amount: 5_000,     type: 'expense' },
  { id: 'sheet_exp_462', date: '2026-05-10', person: 'Catur',    category: 'Entertaint',        description: 'Gantungan',                     amount: 22_505,    type: 'expense' },
  { id: 'sheet_exp_463', date: '2026-05-10', person: 'Catur',    category: 'Makanan & Minuman', description: 'Kopi Indomaret',                amount: 25_000,    type: 'expense' },
  // === MEI 9 (Railway) ===
  { id: 'sheet_exp_450', date: '2026-05-09', person: 'Catur',    category: 'Makanan & Minuman', description: 'Kentang',                       amount: 12_000,    type: 'expense' },
  { id: 'sheet_exp_451', date: '2026-05-09', person: 'Catur',    category: 'Makanan & Minuman', description: 'Palm Sugar Indomaret',          amount: 25_000,    type: 'expense' },
  { id: 'sheet_exp_452', date: '2026-05-09', person: 'Catur',    category: 'Makanan & Minuman', description: 'Soto',                          amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_453', date: '2026-05-09', person: 'Catur',    category: 'Makanan & Minuman', description: 'Motokopi',                      amount: 2_500,     type: 'expense' },
  // === MEI 8 (Railway) ===
  { id: 'sheet_exp_441', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Kopi Dibawah Tangga',           amount: 31_450,    type: 'expense' },
  { id: 'sheet_exp_442', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Bubur Ayam Cirebon SD',         amount: 12_000,    type: 'expense' },
  { id: 'sheet_exp_443', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Bubur Ayam Istimewa',           amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_444', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Dimsum Enak',                   amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_445', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Cireng AA',                     amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_446', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Pastel',                   amount: 10_000,    type: 'expense' },
  { id: 'sheet_exp_447', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Belanja Dapur Masakan',         amount: 112_000,   type: 'expense' },
  { id: 'sheet_exp_448', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Ayam Potong',              amount: 30_000,    type: 'expense' },
  { id: 'sheet_exp_449', date: '2026-05-08', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Bebek Ricky',              amount: 32_000,    type: 'expense' },
  // === MEI 7 (Railway) ===
  { id: 'sheet_exp_433', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Dubai Chewy',                   amount: 71_000,    type: 'expense' },
  { id: 'sheet_exp_434', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Risol Mayo',                    amount: 8_000,     type: 'expense' },
  { id: 'sheet_exp_435', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Bayar Parkir Motor',            amount: 30_000,    type: 'expense' },
  { id: 'sheet_exp_436', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Kopi KSK Less Sugar FM',        amount: 15_500,    type: 'expense' },
  { id: 'sheet_exp_437', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Topup Lalamove',                amount: 50_000,    type: 'expense' },
  { id: 'sheet_exp_438', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Gorengan',                 amount: 10_000,    type: 'expense' },
  { id: 'sheet_exp_439', date: '2026-05-07', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Pecel Ayam',               amount: 28_000,    type: 'expense' },
  { id: 'sheet_exp_440', date: '2026-05-07', person: 'Catur',    category: 'Lainnya',           description: 'Transfer Shiva',                amount: 25_000,    type: 'expense' },
  // === MEI 5 (Railway) ===
  { id: 'sheet_exp_428', date: '2026-05-05', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Double Tape',              amount: 20_200,    type: 'expense' },
  { id: 'sheet_exp_429', date: '2026-05-05', person: 'Catur',    category: 'Makanan & Minuman', description: 'Beli Obeng, Palu, Paku',        amount: 57_981,    type: 'expense' },
  { id: 'sheet_exp_430', date: '2026-05-05', person: 'Catur',    category: 'Makanan & Minuman', description: 'Tahu Gejrot',                   amount: 10_000,    type: 'expense' },
  { id: 'sheet_exp_431', date: '2026-05-05', person: 'Catur',    category: 'Transportasi',      description: 'Isi Bensin',                    amount: 35_000,    type: 'expense' },
  { id: 'sheet_exp_432', date: '2026-05-05', person: 'Catur',    category: 'Makanan & Minuman', description: 'Ayam Taliwang',                 amount: 47_000,    type: 'expense' },
  // === MEI 4 (Railway) ===
  { id: 'sheet_exp_419', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'KSK FM',                        amount: 23_000,    type: 'expense' },
  { id: 'sheet_exp_420', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'Mie Ayam',                      amount: 47_000,    type: 'expense' },
  { id: 'sheet_exp_421', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'Jagung',                        amount: 12_000,    type: 'expense' },
  { id: 'sheet_exp_422', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'Bebek',                         amount: 15_000,    type: 'expense' },
  { id: 'sheet_exp_423', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'O Save',                        amount: 158_900,   type: 'expense' },
  { id: 'sheet_exp_424', date: '2026-05-04', person: 'Catur',    category: 'Makanan & Minuman', description: 'Dada Ayam',                     amount: 24_000,    type: 'expense' },
  { id: 'sheet_exp_425', date: '2026-05-04', person: 'Catur',    category: 'Laundry',           description: 'Topup Opera Sabun',             amount: 30_000,    type: 'expense' },
  { id: 'sheet_exp_426', date: '2026-05-04', person: 'Catur',    category: 'Lainnya',           description: 'Transfer Shiva',                amount: 100_000,   type: 'expense' },
  { id: 'sheet_exp_427', date: '2026-05-04', person: 'Catur',    category: 'Listrik/Air',       description: 'Bayar Listrik Kontrakan Lama',  amount: 345_278,   type: 'expense' },
  // === MEI 3 (manual top-up — tidak masuk Railway) ===
  { id: 'manual_m15',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Podjok Coffee',       amount: 126_500,   type: 'expense' },
  { id: 'manual_m14',         date: '2026-05-03', person: 'Keduanya', category: 'Makanan & Minuman', description: 'Nasi Box Selametan Kontrakan', amount: 528_000, type: 'expense' },
  { id: 'manual_m13',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Podjok Kopi',         amount: 36_300,    type: 'expense' },
  { id: 'manual_m12',         date: '2026-05-03', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Jakarta Cheese Factory', amount: 143_000, type: 'expense' },
  // === MEI 2 (manual top-up) ===
  { id: 'manual_m18',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Pecel Lele Restu',    amount: 20_000,    type: 'expense' },
  { id: 'manual_m17',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Telur Gulung',        amount: 10_000,    type: 'expense' },
  { id: 'manual_m16',         date: '2026-05-02', person: 'Vermita',  category: 'Makanan & Minuman', description: 'Takoyaki Neysa',      amount: 25_000,    type: 'expense' },
  // === MEI 1 (manual top-up — pindahan kontrakan & cicilan) ===
  { id: 'manual_cicilan_1',   date: '2026-05-01', person: 'Vermita',  category: 'Cicilan',   description: 'Bayar Tokped Card',           amount: 3_004_000, type: 'expense' },
  { id: 'manual_cicilan_2',   date: '2026-05-01', person: 'Vermita',  category: 'Cicilan',   description: 'Bayar SPayLater',             amount: 1_040_000, type: 'expense' },
  { id: 'manual_kontrakan_1', date: '2026-05-01', person: 'Catur',    category: 'Kontrakan', description: 'Pelunasan Kontrakan Baru',   amount: 1_700_000, type: 'expense' },
  { id: 'manual_kontrakan_2', date: '2026-05-01', person: 'Vermita',  category: 'Kontrakan', description: 'DP Kontrakan Baru',           amount: 500_000,   type: 'expense' },
  { id: 'manual_pindahan_2',  date: '2026-05-01', person: 'Catur',    category: 'Lainnya',   description: 'Jasa Bongkar Pasang AC',      amount: 950_000,   type: 'expense' },
  { id: 'manual_pindahan_3',  date: '2026-05-01', person: 'Catur',    category: 'Lainnya',   description: 'Spare Part AC',               amount: 656_000,   type: 'expense' },
  { id: 'manual_pindahan_1',  date: '2026-05-01', person: 'Vermita',  category: 'Lainnya',   description: 'Jasa Angkut Barang',          amount: 300_000,   type: 'expense' },
]

// Budget bulanan per kategori
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

// Fallback kategori (Demo Mode) — Railway + manual top-up Mei 2026
export const expenseCategories = [
  { name: 'Cicilan',           icon: '💳', color: 'from-finance-200 to-finance-400', count: 2,  total: 4_044_000 },
  { name: 'Kontrakan',         icon: '🏠', color: 'from-finance-400 to-finance-600', count: 2,  total: 2_200_000 },
  { name: 'Lainnya',           icon: '📦', color: 'from-blush-200 to-peach-300',     count: 5,  total: 2_031_000 },
  { name: 'Makanan & Minuman', icon: '🍜', color: 'from-finance-300 to-finance-500', count: 44, total: 2_013_631 },
  { name: 'Entertaint',        icon: '🎭', color: 'from-peach-400 to-blush-500',     count: 4,  total: 446_505   },
  { name: 'Listrik/Air',       icon: '💡', color: 'from-peach-300 to-peach-500',     count: 1,  total: 345_278   },
  { name: 'Transportasi',      icon: '🚗', color: 'from-blush-300 to-blush-500',     count: 1,  total: 35_000    },
  { name: 'Laundry',           icon: '👕', color: 'from-blush-300 to-finance-300',   count: 1,  total: 30_000    },
]

export const notes = [
  {
    id: 1,
    title: 'Budget Bulanan Mei',
    body: 'Mei keluar Rp11,1jt termasuk biaya pindah kontrakan + cicilan. Sisa income Rp3,3jt — alokasikan ke Dana Persalinan!',
    color: 'bg-peach-100',
    darkColor: 'dark:bg-peach-200/20',
    accent: 'bg-peach-300',
    author: 'Catur',
  },
  {
    id: 2,
    title: 'Reminder Tagihan',
    body: 'Kontrakan baru sudah DP & lunas 🏠 Listrik lama sudah dibayar. Cicilan Tokped & SPayLater sudah settle. WiFi menyusul.',
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
  { id: 2, from: 'bot',   text: '✅ Expense Rp3.004.000 kategori Cicilan berhasil dicatat 💳\n\nTotal pengeluaran bulan ini: Rp11.145.414', time: '10:30' },
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
      expense: 11_145_414,
      balance: 3_354_586,
      topCategory: 'Cicilan (Rp4.044.000)',
    },
  },
]

export const accountBreakdown = [
  { name: 'BCA',        label: 'Catur – Rekening Utama',  balance: 2_500_000, emoji: '🏦', color: 'from-finance-400 to-finance-600' },
  { name: 'BLU by BCA', label: 'Vermita – Digital Bank',  balance: 2_750_000, emoji: '💙', color: 'from-peach-300 to-peach-500'    },
  { name: 'Mandiri',    label: 'Catur – Rekening Kerja',  balance: 1_800_000, emoji: '🔵', color: 'from-blush-300 to-blush-500'    },
  { name: 'PNVRS',      label: 'Panvers – Vermita',       balance: 1_700_000, emoji: '🛍️', color: 'from-finance-300 to-finance-500' },
]
