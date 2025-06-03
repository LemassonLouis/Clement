import { Text, View } from "react-native";
import CustomModal from "./CustomModal";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type WelcomModalProps = {
  visible: boolean,
  additionalActionTrue: () => {}
}


export default function WelcomModal({ visible, additionalActionTrue }: WelcomModalProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);
  
  return (
    <CustomModal
      title="Bienvenue !"
      visible={visible}
      actionTrueText="OK"
      actionTrue={additionalActionTrue}
    >
      <Text style={{textAlign: "center", marginBottom: 10, color: currentTheme.text_color}}>Bonjour et bienvenu sur Clément !</Text>
      <Text style={{textAlign: "center", color: currentTheme.text_color}}>Je vais vous poser quelques questions afin de configurer l'application</Text>
    </CustomModal>
  )
}