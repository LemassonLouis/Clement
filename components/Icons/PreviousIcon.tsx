import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";
import { Feather } from "@expo/vector-icons";
import { useContext } from "react";


export default function PreviousIcon() {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  return <Feather name="chevron-left" size={25} color={currentTheme.text_color}/>
}