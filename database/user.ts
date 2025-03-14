import { getDB } from "./db";


/**
 * Get the only user
 * @returns 
 */
export async function getUser(): Promise<UserInterface | null | undefined> {
  const db = await getDB();

  try {
    return await db.getFirstAsync('SELECT * FROM User');
  }
  catch (error) {
    console.error('Error when trying to get user :', error);
  }
}


/**
 * Create a user.
 * @param method The contraception method.
 * @returns 
 */
export async function createUser(method: string): Promise<number | null | undefined> {
  if(!getUser()) {
    const db = await getDB();

    const statement = await db.prepareAsync(
      'INSERT INTO User (method) VALUES (?)'
    );
  
    try {
      const result = await statement.executeAsync([method]);
      console.log('user created'); // TEMP
  
      return result.lastInsertRowId;
    }
    catch (error) {
      console.error('Error when trying to create user :', error);
      return null;
    }
  }
}


/**
 * Update a user.
 * @param updatedUser The updated user.
 */
export async function updateUser(updatedUser: UserInterface): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync("UPDATE User SET method = ? WHERE id = ?", [updatedUser.method, updatedUser.id]);
  }
  catch (error) {
    console.error('Error when trying to update user :', error);
  }
}
