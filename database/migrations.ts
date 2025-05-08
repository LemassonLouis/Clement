import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { getDB } from "./db";


/**
 * Migrate tables if needed (using pragma versions)
 */
export async function migrateTables(): Promise<void> {
  const db = await getDB();

  const NOTIFICATION_MIGRATION = 1;
  const USER_ACTIVE_MIGRATION = 2;

  // TEMP : reset pragma version
  await resetMigration("User", [
    'wantFiveMinutesRemainingNotification',
    'wantOneHourRemainingNotification',
    'wantTwoHoursRemainingNotification',
    'wantObjectiveMinExtraReachedNotification',
    'wantObjectiveMinReachedNotification',
    'wantObjectiveMaxReachedNotification',
    'wantObjectiveMaxExtraReachedNotification',
    'isActive',
  ]);

  const [{ user_version }] = await db.getAllAsync<{ user_version: number }>(
    'PRAGMA user_version;'
  );

  // Notification migration
  if (user_version < NOTIFICATION_MIGRATION) {
    toast.success(`migrate to version ${NOTIFICATION_MIGRATION}`, { position: ToastPosition.BOTTOM }); // TEMP
    try {
      await db.execAsync(`
        ALTER TABLE User ADD COLUMN wantFiveMinutesRemainingNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantOneHourRemainingNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantTwoHoursRemainingNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantObjectiveMinExtraReachedNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantObjectiveMinReachedNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantObjectiveMaxReachedNotification INTEGER DEFAULT 1;
        ALTER TABLE User ADD COLUMN wantObjectiveMaxExtraReachedNotification INTEGER DEFAULT 1;
        PRAGMA user_version = ${NOTIFICATION_MIGRATION};
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
    }
    catch (error) {
      toast.error(`Error while trying to migrate user table to version ${NOTIFICATION_MIGRATION} : ` + error, { position: ToastPosition.BOTTOM });
    }
  }

  // User active migration
  if (user_version < USER_ACTIVE_MIGRATION) {
    toast.success(`migrate to version ${USER_ACTIVE_MIGRATION}`, { position: ToastPosition.BOTTOM }); // TEMP
    try {
      await db.execAsync(`
        ALTER TABLE User ADD COLUMN isActive INTEGER DEFAULT 0;
        PRAGMA user_version = ${USER_ACTIVE_MIGRATION};
      `);

      await db.execAsync(`
        UPDATE User SET
          isActive = 1
        WHERE
          isActive IS NULL;
      `);
    }
    catch (error) {
      toast.error(`Error while trying to migrate user table to version ${USER_ACTIVE_MIGRATION} : ` + error, { position: ToastPosition.BOTTOM })
    }
  }
}

async function resetMigration(table: string, columnsToDrop: string[]): Promise<void> {
  const db = await getDB();

  const tableSchema = await db.getAllAsync<{
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: string | null;
    pk: number;
  }>(`PRAGMA table_info(${table});`)

  try {
    tableSchema
      .filter(col => columnsToDrop.includes(col.name))
      .forEach(async col => {
        await db.execAsync(`ALTER TABLE ${table} DROP COLUMN ${col.name}`);
      });
  }
  catch (error) {
  }
}