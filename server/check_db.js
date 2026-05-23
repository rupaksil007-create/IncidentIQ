console.log('DEBUG: Script started');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');
console.log('DEBUG: DB Path:', dbPath);
const db = new sqlite3.Database(dbPath);

db.all('SELECT email, isVerified FROM users', [], (err, rows) => {
  console.log('DEBUG: Query callback reached');
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Users:', JSON.stringify(rows, null, 2));
  }
});

setTimeout(() => {
  console.log('DEBUG: Timeout reached');
  db.close();
}, 2000);
