// ============================================
// IMPORT GOOGLE SHEETS → PostgreSQL (Railway)
// Standalone script — no dotenv dependency
// ============================================
import { google } from 'googleapis';
import pg from 'pg';
const { Client } = pg;

// === CREDENTIALS (hardcoded to avoid .env escaping issues) ===
const SERVICE_ACCOUNT_EMAIL = 'catur-finance-bot@catur-finance-bot.iam.gserviceaccount.com';
const SPREADSHEET_ID = '13fZhZ1BbRc-G6anQlccFeTaoYMNDgc1B9KIK83171KI';
const DATABASE_URL = 'postgresql://postgres:gxWfuFDSdUNZUfiYqxuXALllmstBjQcn@monorail.proxy.rlwy.net:39002/railway';

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDp2PM8SgYhOufJ
t7o72/Lc9SP/OpkcvczVLXRf7NiNK06htL/q2BCETNifAUB83GpfPGFK3ts4Ehze
HignSlgAkv//oyIqTmY8R/2Oq312uu53TgS+CBTrXkqTThRFqRpKjYVmKlo3ybQ9
PPXRyPDN0kFUjZyNsVAysSjgkM6y4R6Zkf4mtRJd0izz+RfjvCEDaVoXmBMbMB98
DNbGaGPRw4TC0W9jvJdV7/ZgS6V0YCkSKTrNZb5SXVIj2WEkIzRYJK9eus0Hw0Rx
B3phXz+RcL3Xl8ro0VZKp3oN15kqPUp/SRUlTzXY0JOKWg7FlG95ScMajPBqcFl5
wGtKwnAxAgMBAAECgf8ePH4yeO1kWq20BYhBfV4qpF+p3URk9CSbM+WfB7EbmuEM
bAjSZRVMRBvKt0PNr0bkdPEtyIIiptTeXJ5A9rDMpLtNgKYoYeLo28g1dxI6BmL9
smFHx+JG6NN1ji2x2p5Nhubn3cSFXOU0AXJPmuhS6J5j1fqtOkHZ1phPSGyXlXbN
K/9Xl5NX4IcpzjrqSLl/eiwBk4sdNFbrWsQYpkMitFdIBbYlRDEX1r07lu9UNE7J
ejPxxGD+I9sf2VzH4ai5Vqo9c68sw5ZiGJMhNftH1hgZhbOAe4/QRD93ZDdKaVBR
ONMJa7OLZ98uxL+5t5JERHjcAiLZxaGCqP8+EQUCgYEA+BIxtco1qe7rmeKQbUL7
2olZtUFGpzM5mzk4IQTk02npq0A1vKYbhKRNDYP+C9X2+DNdAVp/1ePa94DLUYWZ
8q24Ych8h/1P4JTvWJDCtpVF861qpYjbz2JEDgcAJT0bcsLWt0LU/Y89z0pzZqcN
+gKjh8yTx78+xLPl4deML1MCgYEA8VJfkf+Y1VkiBCDyodD007tmPNT7E/EBbap4
6eRgOKnRrwBppsapA1rXX0Fbv27ATJqgwNdzk0rtRdLjGkFAN+x3BMgtJpVcUHQ7
J4uD5uDEaB0Es3KWZfSD2lG+5EkTMKq0b7rz5bRIxsSUKWawLnmbwXeA4lsH4iAG
sHFUJesCgYEAxoyZaO0NgpON0r755dmlBsbEHETArfZb9xcXC6aFF4k/0yczW2h/
wexXF6g7X3HDl+hUWk763lDe4xYcpYUPMKNGXk0/DwD6O8A4yWQj1Espj92O7Crb
8+KsoaWMwkFkhLfZbxh4rPFHAXCPaOvwTdhq1rgw18EEFh/+sIH6260CgYEApyAA
FfFom+CFwUw8HLrEw1nWPSzW0YGoFpXn9Tt3M+bP0526jYiphixEWbC+5H3D6Ylw
6PyNCyXp2uBo7UbhPZmi94nWUxE/hGxqh0GE0ME65EusdMZXyDYllm3kgN7mzl56
ZaKYxK0tdZKwdVerjhQkPUEQ3jJi7ER3vXxO5Y8CgYEAq0z+NZwImDKGSLTpc2NG
fZ833zMqrcSy6/gvt+0RtlJ8Bkx/6lZT1Dwx7k3TCq5DBH1PwEabNm0I/AbAKw7f
rygtOe49/+K/6Z8SKQgEOfjj42L4lrNigEjesmM/ChDN/83F+OmAWlOnZQGDfcTR
T9tk0KX7fSAqKeAFiC6JRsc=
-----END PRIVATE KEY-----`;

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const defaultUserId = '082246167772@s.whatsapp.net';

function parseDateString(dateStr) {
  if (!dateStr) return null;
  
  // Map Indonesian month abbreviations to English
  const idToEnMonths = {
    'Jan': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Apr',
    'Mei': 'May', 'Jun': 'Jun', 'Jul': 'Jul', 'Agu': 'Aug',
    'Sep': 'Sep', 'Okt': 'Oct', 'Nov': 'Nov', 'Des': 'Dec'
  };

  let cleanedDateStr = dateStr.toString().trim();
  
  // Replace Indonesian months with English ones
  for (const [id, en] of Object.entries(idToEnMonths)) {
    // Case insensitive replacement
    const regex = new RegExp(id, 'i');
    if (regex.test(cleanedDateStr)) {
      cleanedDateStr = cleanedDateStr.replace(regex, en);
      break;
    }
  }

  const d = new Date(cleanedDateStr);
  if (isNaN(d.getTime())) return null;
  
  // Force to UTC midnight to avoid timezone shifts
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

function parseAmount(amountStr) {
  if (!amountStr) return 0;
  const cleaned = amountStr.toString().replace(/[^0-9.-]+/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

async function main() {
  console.log('🚀 Starting Google Sheets → PostgreSQL Import...\n');

  // 1. Auth Google Sheets
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  await auth.authorize();
  console.log('✅ Google Sheets authenticated\n');

  const sheets = google.sheets({ version: 'v4', auth });

  // 2. Connect PostgreSQL
  const db = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await db.connect();
  console.log('✅ PostgreSQL connected\n');

  // 3. Clear existing transactions to avoid duplicates and fix timestamps
  console.log('🧹 Clearing existing transactions...');
  await db.query('DELETE FROM "Transaction"');
  console.log('✅ Transactions cleared\n');

  let totalImported = 0;
  let totalSkipped = 0;

  // Build batch ranges for all months
  const ranges = [];
  for (const month of monthNames) {
    ranges.push(`${month}!H14:L1000`); // Expenses
    ranges.push(`${month}!A2:E50`);    // Income
  }

  let valueRanges;
  try {
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
    });
    valueRanges = response.data.valueRanges || [];
  } catch (err) {
    console.error('❌ Failed to batch-read sheets:', err.message);
    await db.end();
    return;
  }

  for (let i = 0; i < valueRanges.length; i++) {
    const isExpense = i % 2 === 0;
    const monthIndex = Math.floor(i / 2);
    const monthName = monthNames[monthIndex];
    const rows = valueRanges[i].values || [];

    if (rows.length === 0) continue;

    console.log(`--- ${monthName} (${isExpense ? 'Expense' : 'Income'}) — ${rows.length} rows ---`);

    for (const row of rows) {
      let type, amount, timestamp, finalDescription;

      if (isExpense) {
        // H: Tanggal, I: Metode Bayar, J: Kategori, K: Deskripsi, L: Amount
        if (!row[0] || !row[4]) continue;
        const dateStr = row[0].toString().trim();
        const metodeBayar = (row[1] || '').toString().trim();
        const kategori = (row[2] || 'Lainnya').toString().trim();
        const deskripsi = (row[3] || '').toString().trim();
        amount = parseAmount(row[4]);
        if (amount === 0) continue;

        timestamp = parseDateString(dateStr) || new Date();
        finalDescription = metodeBayar && metodeBayar !== '-'
          ? `${kategori} (${metodeBayar})|${deskripsi === '-' ? '' : deskripsi}`
          : `${kategori}|${deskripsi === '-' ? '' : deskripsi}`;
        type = 'expense';
      } else {
        // A: Tanggal, B: Kategori, C: Metode Bayar, D: -, E: Amount
        if (!row[0] || !row[4]) continue;
        const dateStr = row[0].toString().trim();
        const kategori = (row[1] || 'Lainnya').toString().trim();
        const metodeBayar = (row[2] || '').toString().trim();
        amount = parseAmount(row[4]);
        if (amount === 0) continue;

        timestamp = parseDateString(dateStr) || new Date();
        finalDescription = metodeBayar && metodeBayar !== '-'
          ? `${kategori} (${metodeBayar})|`
          : `${kategori}|`;
        type = 'income';
      }

      // Deduplicate: check if already exists
      const dupCheck = await db.query(
        `SELECT id FROM "Transaction" WHERE type = $1 AND amount = $2 AND description = $3 AND timestamp::date = $4::date LIMIT 1`,
        [type, amount, finalDescription, timestamp.toISOString().split('T')[0]]
      );

      if (dupCheck.rows.length === 0) {
        await db.query(
          `INSERT INTO "Transaction" (id, "userId", platform, type, amount, description, timestamp) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)`,
          [defaultUserId, 'whatsapp', type, amount, finalDescription, timestamp]
        );
        totalImported++;
        console.log(`  ✅ ${type}: ${finalDescription} — Rp${amount.toLocaleString()}`);
      } else {
        totalSkipped++;
      }
    }
  }

  await db.end();

  console.log(`\n🎉 SELESAI!`);
  console.log(`   Imported: ${totalImported}`);
  console.log(`   Skipped (duplikat): ${totalSkipped}`);
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
