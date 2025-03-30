import { toast, ToastPosition } from '@backpackapp-io/react-native-toast';
import * as SQLite from 'expo-sqlite';


export const DB_NAME = 'clement';


/**
 * Get (and open) the DB.
 * @returns 
 */
export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME, { useNewConnection: true });
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
        dateTimeStart TEXT NOT NULL,
        dateTimeEnd TEXT,
        sexWithoutProtection INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT,
        startDate TEXT
      );
    `);
  } catch (error) {
    toast.error("Error while trying to create tables : " + error, { position: ToastPosition.BOTTOM });
  }
};


// TEMP ?
export const deleteTables = async () => {
  const db = await getDB();

  try {
    await db.execAsync(`DROP TABLE IF EXISTS Session;`);
    await db.execAsync(`DROP TABLE IF EXISTS User;`);

    console.log('Tables supprimées avec succès'); // TEMP
  } catch (error) {
    console.error('Erreur lors de la suppression des tables:', error); // TEMP ?
  }
}