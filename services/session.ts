import { AndroSwitch } from "@/enums/AndroSwitch";
import { getDifference } from "./date";
import { Status } from "@/enums/Status";

export function getTotalWearing(sessions: any): number {
  return sessions.reduce((previous, current) => {
    return previous + getDifference(current.date_time_start, current.date_time_end);
  }, 0);
}

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