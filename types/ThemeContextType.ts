import { AppStyleInterface } from "@/interfaces/AppStyle";

export type ThemeContextType = {
  theme: AppStyleInterface;
  setTheme: React.Dispatch<React.SetStateAction<AppStyleInterface>>;
}