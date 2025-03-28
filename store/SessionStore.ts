import { getAllSessionsBetweenDates } from "@/database/session";
import { getCalendarLastSunday, getCalendarStartMonday, getStartAndEndDate } from "@/services/date";
import { useCallback, useSyncExternalStore } from "react";

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

  public updateSessions(updatedSessions: SessionInterface[]) {
    updatedSessions.forEach(session => {
      const index = this.sessions.findIndex(s => s.id === session.id);
  
      if(index !== -1) {
        this.sessions[index] = session;
        this.sessions = [...this.sessions];
      }
    });

    this.notifyListeners();
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

  public forceNotifyListeners() {
    this.sessions = [...this.sessions];
    this.notifyListeners();
  }
}

const sessionStore = new SessionStore();

export function getSessionStore(): SessionStore {
  return sessionStore;
}

export function getSessionsStored(): SessionInterface[] {
  return useSyncExternalStore(
    useCallback((callback) => sessionStore.subscribe(callback), [sessionStore]),
    useCallback(() => sessionStore.getSessions(), [sessionStore])
  );
}