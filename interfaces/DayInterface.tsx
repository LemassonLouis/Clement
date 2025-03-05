export default interface DayInterface {
  date: Date,
  sessions: SessionInterface[],
  isCurrentMonth: boolean,
}
