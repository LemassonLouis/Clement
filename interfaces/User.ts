import { ContraceptionMethods } from "@/enums/ContraceptionMethod";

/**
 * Represent a user
 */
export default interface UserInterface {
  id: number,
  method: ContraceptionMethods | null,
  startDate: Date | null,
  // wantFiveMinutesRemainingNotification: boolean,
  // wantOneHourRemainingNotification: boolean,
  // wantTwoHoursRemainingNotification: boolean,
  // wantObjectiveMinExtraReachedNotification: boolean,
  // wantObjectiveMinReachedNotification: boolean,
  // wantObjectiveMaxReachedNotification: boolean,
  // wantObjectiveMaxExtraReachedNotification: boolean,
}