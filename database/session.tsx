import { getDB } from "./db";

export const createSession = async (dateTimeStart: string, dateTimeEnd: string|null = null, sexWithoutProtection: boolean = false): Promise<number | null> => {
  const db = await getDB();

  const statement = await db.prepareAsync(
    'INSERT INTO Session (date_time_start, date_time_end, sexWithoutProtection) VALUES (?, ?, ?)'
  );

  try {
    const result = await statement.executeAsync([dateTimeStart, dateTimeEnd, sexWithoutProtection ? 1 : 0]);
    console.log('Session insérée avec succès'); // TEMP ?
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return null;
  }
};

export const getAllSessionsBetweenDates = async (dateTimeStart: string, dateTimeEnd: string): Promise<SessionInterface[]> => {
  const db = await getDB();

  try {
    const sessions = await db.getAllAsync<SessionInterface>("SELECT * FROM Session WHERE date_time_start >= ? AND date_time_end <= ?", [dateTimeStart, dateTimeEnd]);
    return sessions.map(session => deserializeSession(session));
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
    return [];
  }
};

export const getSessionByDate = async (dateTimeStart: string, dateTimeEnd: string) => {
  const db = await getDB();

  try {
    const sessions = await db.getAllAsync("SELECT * FROM Session WHERE date_time_start >= ? AND date_time_end <= ?", [dateTimeStart, dateTimeEnd]);
    // console.log('Sessions récupérées avec succès');
    return sessions.map(session => deserializeSession(session));
  } catch (error) {
    console.error('Erreur lors de la récupération des sessions:', error);
  }
}

const deserializeSession = (session: any) => {
  session.date_time_start = new Date(session.date_time_start);
  session.date_time_end = new Date(session.date_time_end);
  session.sexWithoutProtection = session.sexWithoutProtection ? true : false;
  return session;
}

