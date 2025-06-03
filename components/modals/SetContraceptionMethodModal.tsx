import { Text } from "react-native";
import CustomModal from "./CustomModal";
import { useContext, useRef } from "react";
import ContraceptionMethodFrom from "../forms/ContraceptionMethodForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type SetContraceptionMethodProps = {
  visible: boolean,
  additionalActionTrue: () => void
}


export default function SetContraceptionMethodModal({ visible, additionalActionTrue }: SetContraceptionMethodProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);
  const contraceptionMethodFrom = useRef<{ saveForm: () => void }>();

  return (
    <CustomModal
      title="Votre méthode de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={async () => {
        if(contraceptionMethodFrom.current) contraceptionMethodFrom.current.saveForm();

        additionalActionTrue();
      }}
    >
      <Text style={{textAlign: "center", color: currentTheme.text_color}}>Quelle méthode de contracepation thermique utilisez-vous ou souhaitez-vous utiliser ?</Text>
      <ContraceptionMethodFrom ref={contraceptionMethodFrom}/>
    </CustomModal>
  )
}
