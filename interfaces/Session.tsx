/**
 * Represente a session.
 */
interface SessionInterface {
  id: number,
  date_time_start: Date,
  date_time_end: Date | null,
  sexWithoutProtection: boolean,
}