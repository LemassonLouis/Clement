import { Text, View } from "react-native";
import CustomModal from "./CustomModal";
import { useContext, useRef } from "react";
import ContraceptionEndDateForm from "../forms/ContraceptionEndDateForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type SetContraceptionEndDateModalProps = {
  visible: boolean,
  additionalActionTrue: () => void
}


export default function SetContraceptionEndDateModal({ visible, additionalActionTrue }: SetContraceptionEndDateModalProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);
  const contraceptionEndDateForm = useRef<{ saveForm: () => void }>();

  return (
    <CustomModal
      title="Date de fin de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={() => {
        if(contraceptionEndDateForm.current) contraceptionEndDateForm.current.saveForm();

        additionalActionTrue();
      }}
    >
      <View style={{alignItems: 'center'}}>
        <Text style={{textAlign: "center", marginBottom: 20, color: currentTheme.text_color}}>À quel date souhaitez vous ou allez vous arrêter la contraception ?</Text>
        <ContraceptionEndDateForm ref={contraceptionEndDateForm} />
      </View>
    </CustomModal>
  )
}