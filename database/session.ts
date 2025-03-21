import { getDB } from "./db";


/**
 * Create a session.
 * @param dateTimeStart Date as an ISO string.
 * @param dateTimeEnd Date as an ISO string.
 * @param sexWithoutProtection Default = `false`.
 * @returns 
 */
export async function createSession(dateTimeStart: string, dateTimeEnd: string | null = null, sexWithoutProtection: boolean = false): Promise<number | null> {
  const db = await getDB();

  try {
    const  statement = await db.prepareAsync(
      'INSERT INTO Session (dateTimeStart, dateTimeEnd, sexWithoutProtection) VALUES (?, ?, ?)'
    );

    const result = await statement.executeAsync([dateTimeStart, dateTimeEnd, sexWithoutProtection ? 1 : 0]);

    return result.lastInsertRowId;
  }
  catch (error) {
    console.error('Erreur lors de la création de la session :', error);
    return null;
  }
};


/**
 * Get all sessions between 2 dates.
 * @param dateTimeStart Date as an ISO string.
 * @param dateTimeEnd Date as an ISO string.
 * @returns 
 */
export async function getAllSessionsBetweenDates(dateTimeStart: string, dateTimeEnd: string): Promise<SessionInterface[]> {
  const db = await getDB();

  try {
    const sessions = await db.getAllAsync<SessionInterface>("SELECT * FROM Session WHERE dateTimeStart >= ? AND (dateTimeEnd <= ? OR dateTimeEnd IS NULL)", [dateTimeStart, dateTimeEnd]);

    return sessions.map(session => deserializeSession(session));
  }
  catch (error) {
    console.error('Erreur lors de la récupération des sessions :', error);
    return [];
  }
};


/**
 * Get the first unfinished session.
 * @returns 
 */
export async function getFirstUnfinishedSession(): Promise<SessionInterface | null> {
  const db = await getDB();

  try {
    const session = await db.getFirstAsync<SessionInterface>("SELECT * FROM Session WHERE dateTimeEnd IS NULL");

    if(!session) {
      return null;
    }

    return deserializeSession(session);
  }
  catch (error) {
    console.error('Erreur lors de la récupération de la session actuel :', error);
    return null;
  }
}


/**
 * Update a session.
 * @param id The session id.
 * @param dateTimeStart The new date time start.
 * @param dateTimeEnd The new date time end.
 * @param sexWithoutProtection The new sex without protection.
 */
export async function updateSession(id: number, dateTimeStart: string, dateTimeEnd: string | null, sexWithoutProtection: boolean): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync("UPDATE Session SET dateTimeStart = ?, dateTimeEnd = ?, sexWithoutProtection = ? WHERE id = ?", [dateTimeStart, dateTimeEnd, sexWithoutProtection, id]);
  }
  catch (error) {
    console.error('Error lors de la mise à jour de la session :', error);
  }
}


/**
 * Update multiple sessions sexWithoutProtection at the same time.
 * @param ids Session ids to update.
 * @param sexWithoutProtection New value of sexWithoutProtection.
 */
export async function updateSessionsSexWithoutProtection(ids: number[], sexWithoutProtection: boolean): Promise<void> {
  const db = await getDB();

  try {
    const placeholders = ids.map(() => '?').join(',');
    await db.runAsync(`UPDATE Session SET sexWithoutProtection = ? WHERE id IN (${placeholders})`, [sexWithoutProtection, ...ids]);
  }
  catch (error) {
    console.error('Error lors de la mise à jour des sessions :', error);
  }
}


/**
 * Delete a session.
 * @param id The session id.
 */
export async function deleteSession(id: number): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync('DELETE FROM Session WHERE id = ?', [id]);
  }
  catch (error) {
    console.error('Error when trying to delete session', error);
  }
}


/**
 * Deserialize a session.
 * @param session 
 * @returns 
 */
export function deserializeSession(session: SessionInterface): SessionInterface {
  session.dateTimeStart = new Date(session.dateTimeStart);
  session.dateTimeEnd = session.dateTimeEnd === null ? null : new Date(session.dateTimeEnd);
  session.sexWithoutProtection = session.sexWithoutProtection ? true : false;

  return session;
}
