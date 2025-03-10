import { deserializeSession, getAllSessionsBetweenDates } from "@/database/session";
import { getCacheData, storeCacheData } from "@/services/cache";
import { getCalendarLastSunday, getCalendarStartMonday, getStartAndEndDate } from "@/services/date";

class SessionStore {
  private sessions: SessionInterface[] = [];
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

      // const sessionsCached = await getCacheData(`sessions_${year}_${month}`);
      // if(sessionsCached) {
      //   this.sessions = JSON.parse(sessionsCached).map((session: SessionInterface) => deserializeSession(session));
      // }
      // else {
        const sessions = await getAllSessionsBetweenDates(calendarFirstMonday, calendarLastSunday);
        this.sessions = sessions;
      //   await storeCacheData(`sessions_${year}_${month}`, JSON.stringify(sessions));
      // }

      this.notifyListeners();
    }
  }

  public addSession(session: SessionInterface) {
    this.sessions = [...this.sessions, session];
    this.notifyListeners();
  }

  public updateSession(updatedSession: SessionInterface) {
    const index = this.sessions.findIndex(s => s.id === updatedSession.id);

    if(index !== -1) {
      this.sessions[index] = updatedSession;
      this.sessions = [...this.sessions];
      this.notifyListeners();
    }
  }

  public removeSession(session: SessionInterface) {
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
}

const sessionStore = new SessionStore();

export function getSessionStore() {
  return sessionStore;
}