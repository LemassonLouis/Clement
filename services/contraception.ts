import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { ContraceptionMethodInterface } from "@/interfaces/ContraceptionMethod";

/**
 * All the contraception methods
 */
const CONTRACEPTION_METHODS: ContraceptionMethodInterface[] = [
  {
    slug: ContraceptionMethods.ANDRO_SWITCH,
    name: "AndroSwitch (anneau thermique)",
    objective_min_extra: 43_200_000, // 12h (ms)
    objective_min: 50_400_000,       // 14h (ms)
    objective_max: 57_600_000,       // 16h (ms)
    objective_max_extra: 64_800_000, // 18h (ms)
  },
  {
    slug: ContraceptionMethods.SLIP_REMONTE_COUILLES,
    name: "Slip remonte couille",
    objective_min_extra: 43_200_000, // 12h (ms)
    objective_min: 50_400_000,       // 14h (ms)
    objective_max: 57_600_000,       // 16h (ms)
    objective_max_extra: 64_800_000, // 18h (ms)
  },
  {
    slug: ContraceptionMethods.SPERMA_PAUSE,
    name: "SpermaPause (slip chauffant)",
    objective_min_extra: 7_200_000,  // 2h (ms)
    objective_min: 10_800_000,       // 3h (ms)
    objective_max: 10_800_000,       // 3h (ms)
    objective_max_extra: 14_400_000, // 4h (ms)
  },
]


/**
 * Get all the contraception methods.
 * @returns 
 */
export function getAllContraceptionMethods(): ContraceptionMethodInterface[] {
  return CONTRACEPTION_METHODS;
}


/**
 * Get contraception method by slug.
 * @param slug The slug of the method
 * @returns 
 */
export function getContraceptionMethod(slug: ContraceptionMethods): ContraceptionMethodInterface {
  return CONTRACEPTION_METHODS.find(method => method.slug === slug) ?? CONTRACEPTION_METHODS[0];
}