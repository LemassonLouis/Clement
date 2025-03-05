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

    return result.lastInsertRowId;
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
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
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return [];
  }
};


// const updateSession = async (dateTimeStart: string, dateTimeEnd: string|null, sexWithoutProtection: boolean) => {
//   const db = await getDB();

//   const insertStatement = await db.prepareAsync(
//     'INSERT INTO Session (date_time_start, date_time_end, sexWithoutProtection) VALUES (?, ?, ?)'
//   );
  
//   try {
//     await insertStatement.executeAsync([dateTimeStart, dateTimeEnd, sexWithoutProtection ? 1 : 0]);
//     console.log('Session insérée avec succès');
//   } catch (error) {
//     console.error('Erreur lors de la création de la session:', error);
//   } finally {
//     await insertStatement.finalizeAsync();
//   }
// };


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
