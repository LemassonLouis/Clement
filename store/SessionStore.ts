import { getAllSessionsBetweenDates } from "@/database/session";
import { getCalendarLastSunday, getCalendarStartMonday, getStartAndEndDate } from "@/services/date";
import { Session } from "@/types/SessionType";
import { useCallback, useSyncExternalStore } from "react";

class SessionStore {
  private sessions: Session[] = [];
  private listeners: Set<() => void> = new Set();
  private startDate: string | null = null;
  private endDate: string | null = null;

  public getSessions() {
    return this.sessions;
  }

  public async refreshSessions(year: number, month: number) {
    const firstDayOfMonth: Date = new Date(year, month, 1);
    const calendarFirstMonday: string = getStartAndEndDate(getCalendarStartMonday(firstDayOfMonth)).dateStart.toISOString();
    const calendarLastSunday: string = getStartAndEndDate(getCalendarLastSunday(firstDayOfMonth)).dateEnd.toISOString();

    if(calendarFirstMonday !== this.startDate || calendarLastSunday !== this.endDate) {
      this.startDate = calendarFirstMonday;
      this.endDate = calendarLastSunday;

      const sessions = await getAllSessionsBetweenDates(calendarFirstMonday, calendarLastSunday);
      this.sessions = sessions;
  
      this.notifyListeners();
    }
  }

  public addSession(session: Session) {
    this.sessions = [...this.sessions, session];
    this.notifyListeners();
  }

  public updateSessions(updatedSessions: Session[]) {
    updatedSessions.forEach(session => {
      const index = this.sessions.findIndex(s => s.id === session.id);
  
      if(index !== -1) {
        this.sessions[index] = session;
        this.sessions = [...this.sessions];
      }
    });

    this.notifyListeners();
  }

  public removeSession(session: Session) {
    const index = this.sessions.findIndex(s => s.id === session.id);

    if(index !== -1) {
      this.sessions.splice(index, 1);
      this.sessions = [...this.sessions];
      this.notifyListeners();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  public forceNotifyListeners() {
    this.sessions = [...this.sessions];
    this.notifyListeners();
  }
}

const sessionStore = new SessionStore();

export function getSessionStore(): SessionStore {
  return sessionStore;
}

export function getSessionsStored(): Session[] {
  return useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );
}