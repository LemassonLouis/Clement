import { ContraceptionMethods } from "@/enums/ContraceptionMethod";

/**
 * Represent a user
 */
export default interface UserInterface {
  id: number,
  method: ContraceptionMethods | null,
  startDate: Date | null
}