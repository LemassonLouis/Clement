import { AndroSwitch } from "@/enums/AndroSwitch";
import { getDateDifference, getStartAndEndDate, isDateBetween } from "./date";
import { Status } from "@/enums/Status";
import { getSessionStore } from "@/store/SessionStore";


/**
 * Calculate the total wearing from sessions.
 * @param sessions Sessions
 * @returns miliseconds
 */
export function calculateTotalWearing(sessions: SessionInterface[]): number {
  return sessions.reduce((previous, current) => {
    return previous + getDateDifference(current.dateTimeStart, current.dateTimeEnd ?? new Date());
  }, 0);
}

/**
 * Get the status from a total wearing.
 * @param totalWearing miliseconds
 * @returns
 */
export function getStatusFromTotalWearing(totalWearing: number): string {
  if(totalWearing === 0) {
    return Status.NONE;
  }
  else if(totalWearing < AndroSwitch.OBJECTIVE_MIN_EXTRA) {
    return Status.FAILED;
  }
  else if(totalWearing < AndroSwitch.OBJECTIVE_MIN) {
    return Status.WARNED;
  }
  else if(totalWearing < AndroSwitch.OBJECTIVE_MAX) {
    return Status.SUCCESSED;
  }
  else if(totalWearing < AndroSwitch.OBJECTIVE_MAX_EXTRA) {
    return Status.REACHED;
  }
  else if(totalWearing > AndroSwitch.OBJECTIVE_MAX_EXTRA) {
    return Status.EXCEEDED;
  }
  else {
    return Status.NONE;
  }
}

/**
 * Get the color of the status.
 * @param status The status
 */
export function getColorFromStatus(status: Status | string): string {
  switch(status) {
    case Status.FAILED:
      return '#FF5656';
    case Status.WARNED:
      return '#FFC249';
    case Status.SUCCESSED:
      return '#49B24E';
    case Status.REACHED:
      return '#6DDAFF';
    case Status.EXCEEDED:
      return '#D67FFF';
    default:
      return '#B5B5B5';
  }
}

/**
 * Extract sessions from a date.
 * @param sessions The sessions to iterate.
 * @param date The date from which extract the sessions.
 * @returns 
 */
export function extractDateSessions(sessions: SessionInterface[], date: Date): SessionInterface[] {
  return sessions.filter(session => {
    const { dateStart, dateEnd } = getStartAndEndDate(date);
    return isDateBetween(session.dateTimeStart, dateStart, dateEnd);
  });
}


/**
 * Return if times are set correctly and if they don't override an other session, return the errors.
 * @param session The session reference.
 * @param startTime The strat time
 * @param endTime the end time
 * @returns 
 */
export function timeVerifications(session: SessionInterface, startTime: Date, endTime: Date): { ok: boolean, errors: string[] } {
  const sessionStore = getSessionStore();
  let ok = true;
  const errors = [];

  if(endTime > new Date()) {
    errors.push("L'heure de fin ne peut pas être supérieur à l'heure actuel");
    ok = false;
  }

  if(endTime <= startTime) {
    errors.push("L'heure de fin ne peut pas êter inférieur ou égal à l'heure de début");
    ok = false;
  }
  else {
    const otherDateSessions = extractDateSessions(sessionStore.getSessions(), session.dateTimeStart).filter(thisSession => thisSession.id !== session.id);
    if(otherDateSessions.some(thisSession => {
      const maxEndTime = getStartAndEndDate(thisSession.dateTimeStart).dateEnd;
      return isDateBetween(startTime, thisSession.dateTimeStart, thisSession.dateTimeEnd ?? maxEndTime)
          || isDateBetween(thisSession.dateTimeStart, startTime, endTime)
    })) {
      errors.push("Les heures sélectionnées font se chevaucher une autre session");
      ok = false;
    }
  }

  return {
    ok,
    errors
  };
}