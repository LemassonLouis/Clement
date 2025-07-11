import { getDB } from "./db";
import { toast } from "@backpackapp-io/react-native-toast";
import { SerializedUser, User } from "@/types/UserType";
import { DEFAULT_TOAST_ERROR_CONFIG } from "@/services/toast";


/**
 * Create the user table if needed.
 */
export async function createUserTable(): Promise<void> {
  const db = await getDB();

  try {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        method TEXT,
        startDate TEXT
      );
    `);
  }
  catch (error) {
    console.error("Error while trying to create user table : " + error);
    toast.error("Error while trying to create user table : " + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}


/**
 * Get the only user
 * @returns 
 */
export async function getUser(): Promise<User | null> {
  const db = await getDB();

  try {
    const user = await db.getFirstAsync<SerializedUser>('SELECT * FROM User');

    if(!user) return null;

    return deserializeUser(user);
  }
  catch (error) {
    console.error("Error when trying to fetch user : " + error);
    toast.error("Error when trying to fetch user : " + error, DEFAULT_TOAST_ERROR_CONFIG);

    return null;
  }
}


/**
 * Create a user.
 * @param method The contraception method.
 * @returns 
 */
export async function createUser(user: User): Promise<number | null> {
  let currentUser = await getUser();

  if(currentUser == null) {
    const db = await getDB();

    try {
      const serializedUser = serializeUser({ ...user, isActive: false });
      const { id, ...fields } = serializedUser;
      const keys = Object.keys(fields);
      const placeholders = keys.map(() => '?').join(', ');
      const cols = keys.join(', ');
      const values = Object.values(fields);

      const statement = await db.prepareAsync(`INSERT INTO User (${cols}) VALUES (${placeholders})`);
      const result = await statement.executeAsync(values);

      return result.lastInsertRowId;
    }
    catch (error) {
      console.error("Error while trying to create user : " + error);
      toast.error("Error while trying to create user : " + error, DEFAULT_TOAST_ERROR_CONFIG);

      return null;
    }
  }
  else return currentUser.id;
}


/**
 * Update a user.
 * @param updatedUser The updated user.
 */
export async function updateUser(user: User): Promise<void> {
  const db = await getDB();

  try {
    const serializedUser = serializeUser(user);
    const { id, ...fields } = serializedUser;
    const keys = Object.keys(fields);
    const setters = keys.map(key =>  `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    await db.runAsync(`UPDATE User SET ${setters} WHERE id = ?`, values);
  }
  catch (error) {
    console.error("Error while trying to update user : " + error);
    toast.error("Error while trying to update user : " + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}


/**
 * Deserialize a user.
 * @param user The serialized user to deserialize
 * @returns 
 */
function deserializeUser(user: SerializedUser): User {
  return {
    ...user,
    startDate: user.startDate === null ? new Date() : new Date(user.startDate),
    endDate: user.endDate === null ? new Date() : new Date(user.endDate),
    wantFiveMinutesRemainingNotification: !!user.wantFiveMinutesRemainingNotification,
    wantOneHourRemainingNotification: !!user.wantOneHourRemainingNotification,
    wantTwoHoursRemainingNotification: !!user.wantTwoHoursRemainingNotification,
    wantObjectiveMinExtraReachedNotification: !!user.wantObjectiveMinExtraReachedNotification,
    wantObjectiveMinReachedNotification: !!user.wantObjectiveMinReachedNotification,
    wantObjectiveMaxReachedNotification: !!user.wantObjectiveMaxReachedNotification,
    wantObjectiveMaxExtraReachedNotification: !!user.wantObjectiveMaxExtraReachedNotification,
    isActive: !!user.isActive,
  }
}


/**
 * Serialize a user.
 * @param user The user to serialize
 * @returns
 */
function serializeUser(user: User): SerializedUser {
  return {
    ...user,
    startDate: user.startDate.toISOString(),
    endDate: user.endDate.toISOString(),
  }
}