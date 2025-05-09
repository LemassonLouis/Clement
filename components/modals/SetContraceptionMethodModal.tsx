import { Text } from "react-native";
import CustomModal from "./CustomModal";
import { useRef } from "react";
import ContraceptionMethodFrom from "../forms/ContraceptionMethodForm";


type SetContraceptionMethodProps = {
  visible: boolean,
  additionalActionTrue: () => void
}


export default function SetContraceptionMethodModal({ visible, additionalActionTrue }: SetContraceptionMethodProps) {
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
      <Text style={{textAlign: "center"}}>Quelle méthode de contracepation thermique utilisez-vous ou souhaitez-vous utiliser ?</Text>
      <ContraceptionMethodFrom ref={contraceptionMethodFrom}/>
    </CustomModal>
  )
}
