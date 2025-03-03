import * as SQLite from 'expo-sqlite';

export const DB_NAME = 'cmt-reporter';

export const getDB = async () => {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

export const createTables = async () => {
  const db = await getDB();

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_time_start TEXT NOT NULL,
        date_time_end TEXT,
        sexWithoutProtection INTEGER
      );
    `);

    console.log('Tables créées avec succès'); // TEMP
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error); // TEMP ?
  }
};

