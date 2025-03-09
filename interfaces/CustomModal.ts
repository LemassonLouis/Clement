import { ReactNode } from "react";

/**
 * Represent a custom modal component.
 */
export default interface CustomModalInterface {
  visible: boolean,
  title: string,
  actionTrueText?: string | null,
  actionFalseText?: string | null,
  actionTrue?: (() => void) | null,
  actionFalse?: (() => void) | null,
  children?: ReactNode | null,
}