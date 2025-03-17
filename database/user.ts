import UserInterface from "@/interfaces/User";
import { getDB } from "./db";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";


/**
 * Get the only user
 * @returns 
 */
export async function getUser(): Promise<UserInterface | null> {
  const db = await getDB();

  try {
    const user = await db.getFirstAsync<UserInterface>('SELECT * FROM User');

    if(!user) return null;

    return deserializeUser(user);
  }
  catch (error) {
    console.error('Error when trying to get user :', error);
    return null;
  }
}


/**
 * Create a user.
 * @param method The contraception method.
 * @returns 
 */
export async function createUser(method: ContraceptionMethods|null = null, startDate: string|null = null): Promise<number | null> {
  const theUser = await getUser();

  if(theUser == null) {
    const db = await getDB();

    try {
      const statement = await db.prepareAsync(
        'INSERT INTO User (method, startDate) VALUES (?, ?)'
      );

      const result = await statement.executeAsync([method, startDate]);

      return result.lastInsertRowId;
    }
    catch (error) {
      console.error('Error when trying to create user :', error);
      return null;
    }
  }
  else return theUser.id;
}


/**
 * Update a user.
 * @param updatedUser The updated user.
 */
export async function updateUser(id: number, method: ContraceptionMethods|null, startDate: string|null): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync("UPDATE User SET method = ?, startDate = ? WHERE id = ?", [method, startDate, id]);
  }
  catch (error) {
    console.error('Error when trying to update user :', error);
  }
}


/**
 * Deserialize a user.
 * @param user The user to deserialize
 * @returns 
 */
export function deserializeUser(user: UserInterface): UserInterface {
  return {
    id: user.id,
    method: user.method,
    startDate: user.startDate === null ? null : new Date(user.startDate),
  }
}