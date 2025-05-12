import { SerializedSession, Session } from "@/types/SessionType";

/**
 * Represente a day.
 */
export type Day = {
  date: Date,
  sessions: Session[],
  isCurrentMonth: boolean,
}


export type SerializedDay = Omit<Day, 'sessions'> & {
  sessions: SerializedSession[]
}