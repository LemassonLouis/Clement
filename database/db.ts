import * as SQLite from 'expo-sqlite';
import { createSessionTable } from './session';
import { createUserTable } from './user';
import { TableSchema } from '@/types/TableSchema';
import { toast } from '@backpackapp-io/react-native-toast';
import { DEFAULT_TOAST_ERROR_CONFIG } from '@/services/toast';


export const DB_NAME = 'clement';


/**
 * Get (and open) the DB.
 * @returns 
 */
export async function getDB(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME, { useNewConnection: true });
}


/**
 * Get schema of a table.
 * @param table Table Name
 * @returns 
 */
export async function getTableSchema(table: string): Promise<TableSchema[]> {
  const db = await getDB();

  try {
    return await db.getAllAsync<TableSchema>(`PRAGMA table_info(${table});`)
  }
  catch(error) {
    console.error(`Error while try to get ${table} table schema : ` + error);
    toast.error(`Error while try to get ${table} table schema : ` + error, DEFAULT_TOAST_ERROR_CONFIG);

    return [];
  }
}


/**
 * Create the tables if needed
 */
export async function createTables(): Promise<void> {
  await createSessionTable();
  await createUserTable();
};


// TEMP ? : tables deletion
export const deleteTables = async () => {
  const db = await getDB();

  try {
    await db.execAsync(`DROP TABLE IF EXISTS Session;`);
    await db.execAsync(`DROP TABLE IF EXISTS User;`);
    await db.execAsync('PRAGMA user_version = 0');

    console.log('Tables supprimées avec succès'); // TEMP : tables deletion succed
  } catch (error) {
    console.error('Erreur lors de la suppression des tables:', error);
  }
}