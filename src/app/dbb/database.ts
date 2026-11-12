import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('notes.db');

export function migrate() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}