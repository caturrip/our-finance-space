import pg from 'pg';
const { Client } = pg;

const DATABASE_URL = 'postgresql://postgres:gxWfuFDSdUNZUfiYqxuXALllmstBjQcn@monorail.proxy.rlwy.net:39002/railway';

async function check() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  
  const res = await client.query("SELECT timestamp, description FROM \"Transaction\" ORDER BY timestamp DESC LIMIT 50");
  console.log('Recent Transactions:');
  res.rows.forEach(r => {
    console.log(`${r.timestamp.toISOString()} | ${r.description}`);
  });

  await client.end();
}

check();
