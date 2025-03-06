import { getDB } from "./db";


/**
 * Create a session.
 * @param dateTimeStart Date as an ISO string.
 * @param dateTimeEnd Date as an ISO string.
 * @param sexWithoutProtection Default = `false`.
 * @returns 
 */
export async function createSession(dateTimeStart: string, dateTimeEnd: string|null = null, sexWithoutProtection: boolean = false): Promise<number | null> {
  const db = await getDB();

  const statement = await db.prepareAsync(
    'INSERT INTO Session (date_time_start, date_time_end, sexWithoutProtection) VALUES (?, ?, ?)'
  );

  try {
    const result = await statement.executeAsync([dateTimeStart, dateTimeEnd, sexWithoutProtection ? 1 : 0]);
    console.log('Session created');

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
    const sessions = await db.getAllAsync<SessionInterface>("SELECT * FROM Session WHERE date_time_start >= ? AND date_time_end <= ?", [dateTimeStart, dateTimeEnd]);

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
    const session = await db.getFirstAsync<SessionInterface>("SELECT * FROM Session WHERE date_time_end IS NULL");

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
 * Update a date time end session.
 * @param id The session id.
 * @param dateTimeEnd Date as an ISO string.
 */
export async function updateSessionDateTimeEnd(id: number, dateTimeEnd: string): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync("UPDATE Session SET date_time_end = ? WHERE id = ?", [dateTimeEnd, id]);
  }
  catch (error) {
    console.error('Erreur lors de la mise à jour du date time de fin de la session :', error);
  }
}


/**
 * Update the wex without protection session.
 * @param id The session id
 * @param sexWithoutProtection 
 */
export async function updateSessionSexWithoutProtection(id: number, sexWithoutProtection: boolean): Promise<void> {
  const db = await getDB();

  try {
    await db.runAsync("UPDATE Session SET sexWithoutProtection = ? WHERE id = ?", [sexWithoutProtection, id]);
  }
  catch (error) {
    console.error('Errur lors de la mise à jour de rapport sexuel sans protection de la session :', error);
  }
}


/**
 * Deserialize a session, transform string into date and boolean 0/1 into false/true.
 * @param session 
 * @returns 
 */
function deserializeSession(session: SessionInterface) {
  session.date_time_start = new Date(session.date_time_start);
  session.date_time_end = new Date(session.date_time_end);
  session.sexWithoutProtection = session.sexWithoutProtection ? true : false;

  return session;
}
