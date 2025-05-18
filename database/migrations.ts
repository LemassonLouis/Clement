import { toast } from "@backpackapp-io/react-native-toast";
import { getDB, getTableSchema } from "./db";
import { DEFAULT_TOAST_ERROR_CONFIG } from "@/services/toast";
import { TableSchema } from "@/types/TableSchema";


/**
 * Migrate tables if needed (using pragma versions)
 */
export async function migrateTables(): Promise<void> {
  const db = await getDB();

  const NOTIFICATION_MIGRATION = 1;
  const USER_ACTIVE_MIGRATION = 2;
  const SESSION_NOTE_MIGRATION = 3;

  // await resetMigrations(); // TEMP : reset pragma version

  const [{ user_version }] = await db.getAllAsync<{ user_version: number }>(
    'PRAGMA user_version;'
  );

  try {
    // Notification migration
    if (user_version < NOTIFICATION_MIGRATION) {
      console.log(`migrate to version ${NOTIFICATION_MIGRATION}`); // TEMP
      try {
        await db.execAsync(`
          ALTER TABLE User ADD COLUMN wantFiveMinutesRemainingNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantOneHourRemainingNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantTwoHoursRemainingNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantObjectiveMinExtraReachedNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantObjectiveMinReachedNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantObjectiveMaxReachedNotification INTEGER DEFAULT 1;
          ALTER TABLE User ADD COLUMN wantObjectiveMaxExtraReachedNotification INTEGER DEFAULT 1;
        `);

        await db.execAsync(`
          UPDATE User SET
            wantFiveMinutesRemainingNotification = 1,
            wantOneHourRemainingNotification = 1,
            wantTwoHoursRemainingNotification = 1,
            wantObjectiveMinExtraReachedNotification = 1,
            wantObjectiveMinReachedNotification = 1,
            wantObjectiveMaxReachedNotification = 1,
            wantObjectiveMaxExtraReachedNotification = 1
          WHERE
            wantFiveMinutesRemainingNotification IS NULL OR
            wantOneHourRemainingNotification IS NULL OR
            wantTwoHoursRemainingNotification IS NULL OR
            wantObjectiveMinExtraReachedNotification IS NULL OR
            wantObjectiveMinReachedNotification IS NULL OR
            wantObjectiveMaxReachedNotification IS NULL OR
            wantObjectiveMaxExtraReachedNotification IS NULL;
        `);

        await db.execAsync(`PRAGMA user_version = ${NOTIFICATION_MIGRATION};`);
      }
      catch (error) {
        console.error(`Error while trying to migrate user table to version ${NOTIFICATION_MIGRATION} : ` + error);
        toast.error(`Error while trying to migrate user table to version ${NOTIFICATION_MIGRATION} : ` + error, DEFAULT_TOAST_ERROR_CONFIG);
      }
    }

    // User active migration
    if (user_version < USER_ACTIVE_MIGRATION) {
      console.log(`migrate to version ${USER_ACTIVE_MIGRATION}`); // TEMP
      try {
        await db.execAsync(`ALTER TABLE User ADD COLUMN isActive INTEGER DEFAULT 0;`);
        await db.execAsync(`UPDATE User SET isActive = 1 WHERE isActive IS NULL;`);
        await db.execAsync(`PRAGMA user_version = ${USER_ACTIVE_MIGRATION};`);
      }
      catch (error) {
        console.error(`Error while trying to migrate user table to version ${USER_ACTIVE_MIGRATION} : ` + error);
        toast.error(`Error while trying to migrate user table to version ${USER_ACTIVE_MIGRATION} : ` + error, DEFAULT_TOAST_ERROR_CONFIG);
      }
    }

    // Session note migration
    if (user_version < SESSION_NOTE_MIGRATION) {
      console.log(`migrate to version ${SESSION_NOTE_MIGRATION}`); // TEMP
      try {
        await db.execAsync(`ALTER TABLE Session ADD COLUMN note TEXT;`);
        await db.execAsync(`PRAGMA user_version = ${SESSION_NOTE_MIGRATION};`);
      }
      catch (error) {
        console.error(`Error while trying to migrate user table to version ${SESSION_NOTE_MIGRATION} : ` + error);
        toast.error(`Error while trying to migrate user table to version ${SESSION_NOTE_MIGRATION} : ` + error, DEFAULT_TOAST_ERROR_CONFIG);
      }
    }
  }
  catch(error) {
    console.error(`Error while trying to make migrations : ` + error);
    toast.error(`Error while trying to make migrations : ` + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}


/**
 * __/!\ DANGEROUS /!\__ Reset the migrations.
 */
async function resetMigrations(): Promise<void> {
  const db = await getDB();

  const migrations = [
    {
      name: "User",
      columns: [
        'wantFiveMinutesRemainingNotification',
        'wantOneHourRemainingNotification',
        'wantTwoHoursRemainingNotification',
        'wantObjectiveMinExtraReachedNotification',
        'wantObjectiveMinReachedNotification',
        'wantObjectiveMaxReachedNotification',
        'wantObjectiveMaxExtraReachedNotification',
        'isActive',
      ]
    },
    {
      name: "Session",
      columns: [
        'note',
      ]
    }
  ]

  try {
    migrations.forEach(async table => {
      const tableSchema: TableSchema[] = await getTableSchema(table.name);

      tableSchema
        .filter(col => table.columns.includes(col.name))
        .forEach(async col => {
          await db.execAsync(`ALTER TABLE ${table} DROP COLUMN ${col.name}`);
        });
    });

    await db.execAsync('PRAGMA user_version = 0');
  }
  catch (error) {
    console.error(`Error while trying to reset migrations : ` + error);
    toast.error(`Error while trying to reset migrations : ` + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}
