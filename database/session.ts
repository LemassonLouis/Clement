import { toast } from "@backpackapp-io/react-native-toast";
import { getDB } from "./db";
import { DEFAULT_TOAST_ERROR_CONFIG } from "@/services/toast";
import { SerializedSession, Session } from "@/types/SessionType";


/**
 * Create the session table if needed.
 */
export async function createSessionTable(): Promise<void> {
  const db = await getDB();

  try {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS Session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dateTimeStart TEXT NOT NULL,
        dateTimeEnd TEXT,
        sexWithoutProtection INTEGER NOT NULL
      );
    `);
  }
  catch (error) {
    toast.error("Error while trying to create the session table : " + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}


/**
 * Create a session.
 * @param dateTimeStart Date as an ISO string.
 * @param dateTimeEnd Date as an ISO string.
 * @param sexWithoutProtection Default = `false`.
 * @returns 
 */
export async function createSession(session: Session): Promise<number | null> {
  const db = await getDB();
  
  try {
    let serializedSession = serializeSession(session);

    const  statement = await db.prepareAsync(
      'INSERT INTO Session (dateTimeStart, dateTimeEnd, sexWithoutProtection) VALUES (?, ?, ?)'
    );

    const result = await statement.executeAsync([
      serializedSession.dateTimeStart,
      serializedSession.dateTimeEnd,
      serializedSession.sexWithoutProtection
    ]);

    return result.lastInsertRowId;
  }
  catch (error) {
    toast.error("Error while trying to create session : " + error, DEFAULT_TOAST_ERROR_CONFIG);
    return null;
  }
};


/**
 * Get all sessions between 2 dates.
 * @param dateTimeStart Date as an ISO string.
 * @param dateTimeEnd Date as an ISO string.
 * @param getCurrentSession If need to 
 * @returns 
 */
export async function getAllSessionsBetweenDates(dateTimeStart: string, dateTimeEnd: string, getCurrentSession: boolean = true): Promise<Session[]> {
  const db = await getDB();

  try {
    if(getCurrentSession) {
      var sessions = await db.getAllAsync<SerializedSession>("SELECT * FROM Session WHERE dateTimeStart >= ? AND (dateTimeEnd <= ? OR dateTimeEnd IS NULL)", [dateTimeStart, dateTimeEnd]);
    }
    else {
      var sessions = await db.getAllAsync<SerializedSession>("SELECT * FROM Session WHERE dateTimeStart >= ? AND (dateTimeEnd <= ? OR dateTimeEnd IS NULL) AND dateTimeStart <= dateTimeEnd", [dateTimeStart, dateTimeEnd]);
    }

    return sessions.map(session => deserializeSession(session));
  }
  catch (error) {
    toast.error("Error while tryingto fetch all sessions : " + error, DEFAULT_TOAST_ERROR_CONFIG);
    return [];
  }
};


/**
 * Get the first unfinished session.
 * @returns 
 */
export async function getFirstUnfinishedSession(): Promise<Session | null> {
  const db = await getDB();

  try {
    const session = await db.getFirstAsync<SerializedSession>("SELECT * FROM Session WHERE dateTimeEnd IS NULL");

    if(!session) {
      return null;
    }

    return deserializeSession(session);
  }
  catch (error) {
    toast.error("Error while trying to fetch unfinished session : " + error, DEFAULT_TOAST_ERROR_CONFIG);
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
export async function updateSession(session: Session): Promise<void> {
  const db = await getDB();

  try {
    let serializedSession = serializeSession(session);

    await db.runAsync(
      `UPDATE Session SET
        dateTimeStart = ?,
        dateTimeEnd = ?,
        sexWithoutProtection = ?
      WHERE
        id = ?`
      ,
      [
        serializedSession.dateTimeStart,
        serializedSession.dateTimeEnd,
        serializedSession.sexWithoutProtection,
        serializedSession.id
      ]
    );
  }
  catch (error) {
    toast.error("Error while trying to update session : " + error, DEFAULT_TOAST_ERROR_CONFIG);
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
    toast.error("Error while trying to update multiple sessions : " + error, DEFAULT_TOAST_ERROR_CONFIG);
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
    toast.error("Error while trying to delete session : " + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}


/**
 * Deserialize a session.
 * @param session 
 * @returns 
 */
export function deserializeSession(session: SerializedSession): Session {
  return {
    ...session,
    dateTimeStart: new Date(session.dateTimeStart),
    dateTimeEnd: session.dateTimeEnd ? new Date(session.dateTimeEnd) : null,
    sexWithoutProtection: !!session.sexWithoutProtection,
  }
}


function serializeSession(session: Session): SerializedSession {
  return {
    ...session,
    dateTimeStart: session.dateTimeStart.toISOString(),
    dateTimeEnd: session.dateTimeEnd && session.dateTimeEnd.toISOString(),
  }
}