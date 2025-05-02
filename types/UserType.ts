import { ContraceptionMethods } from "@/enums/ContraceptionMethod";

export type User = {
  id: number,
  method: ContraceptionMethods,
  startDate: Date,
  wantFiveMinutesRemainingNotification: boolean,
  wantOneHourRemainingNotification: boolean,
  wantTwoHoursRemainingNotification: boolean,
  wantObjectiveMinExtraReachedNotification: boolean,
  wantObjectiveMinReachedNotification: boolean,
  wantObjectiveMaxReachedNotification: boolean,
  wantObjectiveMaxExtraReachedNotification: boolean,
}

export type SerializedUser = Omit<User, 'startDate'> & {
  startDate: string
}