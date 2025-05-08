import { ToastOptions, ToastPosition } from "@backpackapp-io/react-native-toast";

export const DEFAULT_TOAST_ERROR_CONFIG: ToastOptions = {
  position: ToastPosition.BOTTOM,
  duration: 5_000,
}

export const DEFAULT_TOAST_SUCCESS_CONFIG: ToastOptions = {
  position: ToastPosition.BOTTOM,
  duration: 2_000,
}