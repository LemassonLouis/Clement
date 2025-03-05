/**
 * Represente a day.
 */
interface DayInterface {
  date: Date,
  sessions: SessionInterface[],
  isCurrentMonth: boolean,
}
