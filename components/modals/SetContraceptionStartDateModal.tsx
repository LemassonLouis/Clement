import { Text } from "react-native";
import CustomModal from "./CustomModal";
import { useRef } from "react";
import ContraceptionStartDateForm from "../forms/ContraceptionStartDateForm";


type SetContraceptionStartDateModalProps = {
  visible: boolean,
  additionalActionTrue: () => void
}


export default function SetContraceptionStartDateModal({ visible, additionalActionTrue }: SetContraceptionStartDateModalProps) {
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
      <Text style={{textAlign: "center", marginBottom: 20}}>À quel date souhaitez vous ou avez commencé la contraception ?</Text>
      <ContraceptionStartDateForm ref={contraceptionStartDateForm} />
    </CustomModal>
  )
}