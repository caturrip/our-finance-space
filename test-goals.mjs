import { google } from 'googleapis';

const SERVICE_ACCOUNT_EMAIL = 'catur-finance-bot@catur-finance-bot.iam.gserviceaccount.com';
const SPREADSHEET_ID = '13fZhZ1BbRc-G6anQlccFeTaoYMNDgc1B9KIK83171KI';
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
nejPxxGD+I9sf2VzH4ai5Vqo9c68sw5ZiGJMhNftH1hgZhbOAe4/QRD93ZDdKaVBR
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

async function test() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Saving/Investasi!B7:N25', 
  });

  const rows = res.data.values;
  if (!rows || rows.length < 1) {
    console.log('No rows found');
    return;
  }

  const goals = [];
  const goalMapping = [
    { key: 'rumah', name: 'Dana Rumah', target: 350000000 },
    { key: 'anak', name: 'Dana Persalinan', target: 50000000 },
    { key: 'liburan', name: 'Dana Liburan', target: 25000000 },
  ];

  for (const mapping of goalMapping) {
    const row = rows.find(r => r[0] && r[0].toLowerCase().includes(mapping.key));
    if (row) {
      let current = 0;
      for (let i = 1; i <= 12; i++) {
        if (row[i]) {
          const val = parseFloat(row[i].toString().replace(/[^0-9.-]+/g, '')) || 0;
          current += val;
        }
      }
      goals.push({ name: mapping.name, current });
    }
  }

  console.log('Detected Goals:', JSON.stringify(goals, null, 2));
}

test();
