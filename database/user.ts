import { getDB } from "./db";
import { toast, ToastPosition } from "@backpackapp-io/react-native-toast";
import { SerializedUser, User } from "@/types/UserType";


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
    toast.error("Error while trying to create user table : " + error, { position: ToastPosition.BOTTOM });
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
    toast.error("Error when trying to fetch user : " + error, { position: ToastPosition.BOTTOM });
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

    const serializedUser = serializeUser(user);

    try {
      const statement = await db.prepareAsync(
        `INSERT INTO User (
          method,
          startDate,
          wantFiveMinutesRemainingNotification,
          wantOneHourRemainingNotification,
          wantTwoHoursRemainingNotification,
          wantObjectiveMinExtraReachedNotification,
          wantObjectiveMinReachedNotification,
          wantObjectiveMaxReachedNotification,
          wantObjectiveMaxExtraReachedNotification,
          isActive,
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      );

      const result = await statement.executeAsync([
        serializedUser.method,
        serializedUser.startDate,
        serializedUser.wantFiveMinutesRemainingNotification,
        serializedUser.wantOneHourRemainingNotification,
        serializedUser.wantTwoHoursRemainingNotification,
        serializedUser.wantObjectiveMinExtraReachedNotification,
        serializedUser.wantObjectiveMinReachedNotification,
        serializedUser.wantObjectiveMaxReachedNotification,
        serializedUser.wantObjectiveMaxExtraReachedNotification,
        serializedUser.isActive,
      ]);

      return result.lastInsertRowId;
    }
    catch (error) {
      toast.error("Error while trying to create user : " + error, { position: ToastPosition.BOTTOM });
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

  const serializedUser = serializeUser(user);

  try {
    await db.runAsync(`
      UPDATE User
      SET
        method = ?,
        startDate = ?,
        wantFiveMinutesRemainingNotification = ?,
        wantOneHourRemainingNotification = ?,
        wantTwoHoursRemainingNotification = ?,
        wantObjectiveMinExtraReachedNotification = ?,
        wantObjectiveMinReachedNotification = ?,
        wantObjectiveMaxReachedNotification = ?,
        wantObjectiveMaxExtraReachedNotification = ?,
        isActive = ?
      WHERE
        id = ?
      `,
      [
        serializedUser.method,
        serializedUser.startDate,
        serializedUser.wantFiveMinutesRemainingNotification,
        serializedUser.wantOneHourRemainingNotification,
        serializedUser.wantTwoHoursRemainingNotification,
        serializedUser.wantObjectiveMinExtraReachedNotification,
        serializedUser.wantObjectiveMinReachedNotification,
        serializedUser.wantObjectiveMaxReachedNotification,
        serializedUser.wantObjectiveMaxExtraReachedNotification,
        serializedUser.isActive,
        serializedUser.id,
      ]
    );
  }
  catch (error) {
    toast.error("Error while trying to update user : " + error, { position: ToastPosition.BOTTOM });
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
    wantFiveMinutesRemainingNotification: user.wantFiveMinutesRemainingNotification ? true : false,
    wantOneHourRemainingNotification: user.wantOneHourRemainingNotification ? true : false,
    wantTwoHoursRemainingNotification: user.wantTwoHoursRemainingNotification ? true : false,
    wantObjectiveMinExtraReachedNotification: user.wantObjectiveMinExtraReachedNotification ? true : false,
    wantObjectiveMinReachedNotification: user.wantObjectiveMinReachedNotification ? true : false,
    wantObjectiveMaxReachedNotification: user.wantObjectiveMaxReachedNotification ? true : false,
    wantObjectiveMaxExtraReachedNotification: user.wantObjectiveMaxExtraReachedNotification ? true : false,
    isActive: user.isActive ? true : false,
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
    startDate: user.startDate.toISOString()
  }
}