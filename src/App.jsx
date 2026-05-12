import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDarkMode } from './hooks/useDarkMode'
import { useFinanceData } from './hooks/useFinanceData'

import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SectionHeader from './components/SectionHeader'
import SummaryCards from './components/SummaryCards'
import BalanceDetail from './components/BalanceDetail'
import Charts from './components/Charts'
import WhatsAppMockup from './components/WhatsAppMockup'
import RecentTransactions from './components/RecentTransactions'
import CategoryGrid from './components/CategoryGrid'
import FinanceNotes from './components/FinanceNotes'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'
import SmartInsights from './components/SmartInsights'
import SpendingHeatmap from './components/SpendingHeatmap'
import PersonBreakdown from './components/PersonBreakdown'
import DailyBudget from './components/DailyBudget'
import FinancialHealthScore from './components/FinancialHealthScore'
import QuickKPIs from './components/QuickKPIs'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  const {
    summary, categories, categoryChart, cashflow,
    transactions, notes, couple, source, loading, lastSync, refresh,
  } = useFinanceData()

  const [showBalance, setShowBalance] = useState(false)

  const handleBalanceClick = () => setShowBalance(prev => !prev)

  return (
    <div className="relative min-h-screen text-finance-950 dark:text-finance-50 noise">
      <Background />
      <Navbar isDark={isDark} toggleDark={toggle} source={source} lastSync={lastSync} onRefresh={refresh} burnRate={summary?.burnRate} />

      {/* HERO */}
      <Hero couple={couple} summary={summary} />

      {/* MAIN DASHBOARD */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SUMMARY CARDS */}
        <section className="py-8 sm:py-12">
          <SectionHeader
            eyebrow="Snapshot"
            title="At a"
            italic="glance"
            subtitle="Real-time financial overview powered by your WhatsApp bot."
          />
          <SummaryCards summary={summary} onBalanceClick={handleBalanceClick} />

          {/* BALANCE DETAIL — muncul saat Total Balance diklik */}
          <AnimatePresence>
            {showBalance && (
              <BalanceDetail summary={summary} onClose={() => setShowBalance(false)} cashflow={cashflow} />
            )}
          </AnimatePresence>
        </section>

        {/* QUICK KPIS */}
        <section className="pb-8 sm:pb-10">
          <SectionHeader
            eyebrow="Quick View"
            title="Stats"
            italic="Kilat"
            subtitle="Ringkasan cepat — semua yang penting dalam satu scrollan."
          />
          <QuickKPIs transactions={transactions} summary={summary} />
        </section>

        {/* FINANCIAL HEALTH SCORE */}
        <section className="pb-10 sm:pb-12">
          <SectionHeader
            eyebrow="Score"
            title="Financial"
            italic="Health"
            subtitle="Skor kesehatan keuangan kalian — dihitung dari burn rate, budget, dan net savings."
          />
          <FinancialHealthScore summary={summary} categories={categories} />
        </section>

        {/* SMART INSIGHTS */}
        <section className="pb-10 sm:pb-12">
          <SectionHeader
            eyebrow="Analysis"
            title="Smart"
            italic="Insights"
            subtitle="Ringkasan otomatis dari data keuangan kalian — diperbarui setiap sinkronisasi."
          />
          <SmartInsights summary={summary} categories={categories} />
        </section>

        {/* DAILY BUDGET */}
        <section className="pb-10 sm:pb-12">
          <SectionHeader
            eyebrow="Today"
            title="Jatah"
            italic="Harian"
            subtitle="Sisa budget dibagi hari yang tersisa — biar nggak boncos sebelum akhir bulan."
          />
          <DailyBudget summary={summary} />
        </section>

        {/* CHARTS */}
        <section id="charts" className="py-12 sm:py-16 scroll-mt-20">
          <SectionHeader
            eyebrow="Insights"
            title="Money in"
            italic="motion"
            subtitle="Visualisasi alur kas dan kategori pengeluaran kalian."
          />
          <Charts categoryData={categoryChart} cashflowData={cashflow} isDark={isDark} summary={summary} />
          <div className="mt-5 sm:mt-6">
            <SpendingHeatmap transactions={transactions} />
          </div>
        </section>

        {/* WA BOT */}
        <section className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="The Magic"
            title="How We Track"
            italic="Our Money"
            subtitle="Bot WhatsApp dengan AI categorization, terhubung langsung ke dashboard via Railway."
          />
          <WhatsAppMockup />
        </section>

        {/* TRANSACTIONS */}
        <section id="transactions" className="py-12 sm:py-16 scroll-mt-20">
          <SectionHeader
            eyebrow="Activity"
            title="Recent"
            italic="Transactions"
            subtitle="Setiap transaksi yang dicatat melalui WhatsApp Bot, hadir di sini."
          />
          <RecentTransactions transactions={transactions} />
        </section>

        {/* CATEGORY GRID */}
        <section id="categories" className="py-12 sm:py-16 scroll-mt-20">
          <SectionHeader
            eyebrow="Categories"
            title="Where it"
            italic="goes"
            subtitle="Kategori yang disinkronkan langsung dari bot — tap untuk lihat detail."
          />
          <CategoryGrid categories={categories} />
        </section>

        {/* PERSON BREAKDOWN */}
        <section className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="Couple"
            title="Catur"
            italic="& Vermita"
            subtitle="Siapa yang paling banyak keluar bulan ini? Breakdown pengeluaran per orang."
          />
          <PersonBreakdown transactions={transactions} />
        </section>

        {/* NOTES */}
        <section className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="Reminders"
            title="Notes for Our"
            italic="Future"
            subtitle="Catatan, target, dan reminder yang kami tulis bersama."
          />
          <FinanceNotes notes={notes} />
        </section>
      </main>

      {/* extra space on mobile for bottom nav */}
      <div className="h-24 lg:hidden" />
      <Footer />
      <FloatingActions />
    </div>
  )
}
