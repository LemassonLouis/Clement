/**
 * Represente a session.
 */
export type Session = {
  id: number,
  dateTimeStart: Date,
  dateTimeEnd: Date | null,
  sexWithoutProtection: boolean,
  note: string | null,
}


export type SerializedSession = Omit<Session, 'dateTimeStart' | 'dateTimeEnd'> & {
  dateTimeStart: string,
  dateTimeEnd: string | null,
}