import { AppStyles } from "@/enums/AppStyles";
import { AppStyleInterface } from "@/interfaces/AppStyle";
import { getAllAppStyles } from "@/services/appStyle";
import { ThemeContextType } from "@/types/ThemeContextType";
import { createContext } from "react";


export const defaultTheme: AppStyleInterface = getAllAppStyles().find(style => style.slug === AppStyles.DEFAULT)!


export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
})
