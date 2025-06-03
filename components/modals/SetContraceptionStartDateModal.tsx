import { Text, View } from "react-native";
import CustomModal from "./CustomModal";
import { useContext, useRef } from "react";
import ContraceptionStartDateForm from "../forms/ContraceptionStartDateForm";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type SetContraceptionStartDateModalProps = {
  visible: boolean,
  additionalActionTrue: () => void
}


export default function SetContraceptionStartDateModal({ visible, additionalActionTrue }: SetContraceptionStartDateModalProps) {
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);
  const contraceptionStartDateForm = useRef<{ saveForm: () => void }>();

  return (
    <CustomModal
      title="Date de début de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={() => {
        if(contraceptionStartDateForm.current) contraceptionStartDateForm.current.saveForm();

        additionalActionTrue();
      }}
    >
      <View style={{alignItems: 'center'}}>
        <Text style={{textAlign: "center", marginBottom: 20, color: currentTheme.text_color}}>À quel date souhaitez vous ou avez commencé la contraception ?</Text>
        <ContraceptionStartDateForm ref={contraceptionStartDateForm} />
      </View>
    </CustomModal>
  )
}