require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function normalize(v) {
  if (/^\d{2}:\d{2}$/.test(String(v))) return v;
  const n = parseInt(v, 10);
  if (!isNaN(n)) {
    if (n >= 100) {
      const h = Math.floor(n / 100);
      const m = n % 100;
      return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
    }
    return String(n).padStart(2, '0') + ':00';
  }
  return v;
}

async function run() {
  const { rows } = await pool.query('SELECT open_hour, close_hour FROM "Settings" WHERE id=1');
  console.log('Current DB values:', rows);
  if (rows.length > 0) {
    const { open_hour, close_hour } = rows[0];
    const newOpen = normalize(open_hour);
    const newClose = normalize(close_hour);
    await pool.query('UPDATE "Settings" SET open_hour=$1, close_hour=$2 WHERE id=1', [newOpen, newClose]);
    console.log('Updated to:', { open_hour: newOpen, close_hour: newClose });
  }
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
