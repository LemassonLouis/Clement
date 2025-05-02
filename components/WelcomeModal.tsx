import { Text } from "react-native";
import CustomModal from "./CustomModal";

export default function WelcomModal({ visible, additionalActionTrue }: {visible: boolean, additionalActionTrue: () => {}}) {
  return (
    <CustomModal
      title="Bienvenue !"
      visible={visible}
      actionTrueText="OK"
      actionTrue={additionalActionTrue}
    >
      <Text>Bonjour et bienvenu sur Clément !</Text>
      <Text style={{textAlign: "center"}}>Nous allons vous poser quelques questions afin de configurer l'application</Text>
      <Text style={{textAlign: "center"}}>(Ces informations seront modifiables)</Text> {/* TODO : changer le style verbale : je plutôt que nous car c'est l'assitant */}
    </CustomModal>
  )
}