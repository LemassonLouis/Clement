import { AppStyles } from "@/enums/AppStyles";
import { AppStyleInterface } from "@/interfaces/AppStyle";
import { ThemeInterface } from "@/interfaces/Theme";
import { DARK_THEME } from "@/theme/dark";
import { LIGHT_THEME } from "@/theme/light";
import { ColorSchemeName } from "react-native";


const APP_STYLES: AppStyleInterface[] = [
  {
    slug: AppStyles.DEFAULT,
    name: "Système",
  },
  {
    slug: AppStyles.LIGHT,
    name: "Clair",
  },
  {
    slug: AppStyles.DARK,
    name: "Sombre",
  },
]


/**
 * Get all the app styles.
 * @returns 
 */
export function getAllAppStyles(): AppStyleInterface[] {
  return APP_STYLES;
}


/**
 * Get the app styles.
 * @returns 
 */
export function getAppStyle(slug: AppStyles|ColorSchemeName): AppStyleInterface {
  return APP_STYLES.find(style => style.slug == slug)!;
}


/**
 * Get the theme according to slug
 * @param slug Omit<AppStyles, AppStyles.DEFAULT>
 */
export function getTheme(slug: Omit<AppStyles, AppStyles.DEFAULT>): ThemeInterface {
  switch(slug) {
    case AppStyles.LIGHT: {
      return LIGHT_THEME;
    }
    case AppStyles.DARK: {
      return DARK_THEME;
    }
    default: {
      return LIGHT_THEME;
    }
  }
}