import { AppStyles } from "@/enums/AppStyles";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { UserContextType } from "@/types/UserContextType";
import { User } from "@/types/UserType";
import { createContext } from "react";


export const defaultUser: User = {
  id: 0,
  method: ContraceptionMethods.ANDRO_SWITCH,
  startDate: new Date(),
  wantFiveMinutesRemainingNotification: true,
  wantOneHourRemainingNotification: true,
  wantTwoHoursRemainingNotification: true,
  wantObjectiveMinExtraReachedNotification: true,
  wantObjectiveMinReachedNotification: true,
  wantObjectiveMaxReachedNotification: true,
  wantObjectiveMaxExtraReachedNotification: true,
  isActive: true,
  style: AppStyles.DEFAULT,
}


export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
})
