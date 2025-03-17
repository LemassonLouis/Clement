import { Text } from "react-native";
import CustomModal from "./CustomModal";
import { createUser } from "@/database/user";
import { getUserStore } from "@/store/UserStore";

export default function WelcomModal({ visible, additionalActionTrue }: {visible: boolean, additionalActionTrue: () => {}}) {
  const userStore = getUserStore();

  return (
    <CustomModal
      title="Bienvenue !"
      visible={visible}
      actionTrueText="OK"
      actionTrue={async () => {
        const id = await createUser();
        if(id) {
          userStore.updateUser({
            id: id,
            method: null,
            startDate: null
          });
        }

        additionalActionTrue();
      }}
    >
      <Text>Bonjour et bienvenu sur Clément !</Text>
      <Text style={{textAlign: "center"}}>Nous allons vous poser quelques questions afin de configurer l'application</Text>
      <Text style={{textAlign: "center"}}>(Ces informations seront modifiables)</Text>
    </CustomModal>
  )
}