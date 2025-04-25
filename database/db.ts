import * as SQLite from 'expo-sqlite';
import { createSessionTable } from './session';
import { createUserTable } from './user';


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
  await createSessionTable();
  await createUserTable();
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