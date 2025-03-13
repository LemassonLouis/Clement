import { ReactNode } from "react";

/**
 * Represent a custom modal component.
 */
export default interface CustomModalInterface {
  visible: boolean,
  title: string,
  actionTrueText?: string,
  actionFalseText?: string | null,
  actionTrue?: (() => void),
  actionFalse?: (() => void) | null,
  children?: ReactNode | null,
}