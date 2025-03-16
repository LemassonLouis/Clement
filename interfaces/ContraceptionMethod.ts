import { ContraceptionMethods } from "@/enums/ContraceptionMethod";

export interface ContraceptionMethodInterface {
  slug: ContraceptionMethods,
  name: string,
  objective_min_extra: number,
  objective_min: number,
  objective_max: number,
  objective_max_extra: number,
}