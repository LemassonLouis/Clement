import * as SQLite from 'expo-sqlite';


export const DB_NAME = 'clement';


/**
 * Get (and open) the DB.
 * @returns 
 */
export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME);
}


/**
 * Create the tables if needed
 */
export async function createTables(): Promise<void> {
  const db: SQLite.SQLiteDatabase = await getDB();

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date_time_start TEXT NOT NULL,
        date_time_end TEXT,
        sexWithoutProtection INTEGER
      );
    `);
  } catch (error) {
    console.error('Erreur lors de la création des tables:', error); // TEMP ?
  }
};


// TEMP ?
export const deleteTables = async () => {
  const db = await getDB();

  try {
    await db.execAsync(`DROP TABLE IF EXISTS Session;`);

    console.log('Tables supprimées avec succès'); // TEMP
  } catch (error) {
    console.error('Erreur lors de la suppression des tables:', error); // TEMP ?
  }
}