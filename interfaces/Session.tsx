/**
 * Represente a session.
 */
interface SessionInterface {
  id: number,
  dateTimeStart: Date,
  dateTimeEnd: Date | null,
  sexWithoutProtection: boolean,
}