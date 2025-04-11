import { getFirstUnfinishedSession } from "@/database/session";
import { useCallback, useSyncExternalStore } from "react";

class CurrentSessionStore {
  private currentSession: CurrentSessionInterface = {
    sessionId: null,
    sessionStartTime: null
  }
  private listeners: Set<() => void> = new Set();

  public getCurrentSession() {
    return this.currentSession;
  }

  public async loadCurrentSession(): Promise<void> {
    const currentSession: SessionInterface | null = await getFirstUnfinishedSession();

    if(this.currentSession.sessionId !== currentSession?.id && this.currentSession.sessionStartTime !== currentSession?.dateTimeStart) {
      this.currentSession.sessionId = currentSession?.id ?? null;
      this.currentSession.sessionStartTime = currentSession?.dateTimeStart ?? null;
    }
  }

  public updateCurrentSession(currentSession: CurrentSessionInterface) {
    this.currentSession = currentSession;

    this.notifyListeners();
  }


  public subscribe(listener: () => void) {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

const currentSessionStore = new CurrentSessionStore();

export function getCurrentSessionStore(): CurrentSessionStore {
  return currentSessionStore;
}

export function getCurrentSessionStored(): CurrentSessionInterface {
  return useSyncExternalStore(
    useCallback((callback) => currentSessionStore.subscribe(callback), [currentSessionStore]),
    useCallback(() => currentSessionStore.getCurrentSession(), [currentSessionStore])
  );
}