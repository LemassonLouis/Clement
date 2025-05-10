import { Text } from "react-native";
import CustomModal from "./CustomModal";


type WelcomModalProps = {
  visible: boolean,
  additionalActionTrue: () => {}
}


export default function WelcomModal({ visible, additionalActionTrue }: WelcomModalProps) {
  return (
    <CustomModal
      title="Bienvenue !"
      visible={visible}
      actionTrueText="OK"
      actionTrue={additionalActionTrue}
    >
      <Text>Bonjour et bienvenu sur Clément !</Text>
      <Text style={{textAlign: "center"}}>Je vais vous poser quelques questions afin de configurer l'application</Text>
      <Text style={{textAlign: "center"}}>(Ces informations resterons modifiables)</Text>
    </CustomModal>
  )
}