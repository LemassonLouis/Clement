import Calendar from "@/components/Calendar";
import CurrentSession from "@/components/CurrentSession";
import CustomModal from "@/components/modals/CustomModal";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getUserStore } from "@/store/UserStore";
import WelcomModal from "@/components/modals/WelcomeModal";
import EditContraceptionModal from "@/components/modals/EditContraceptionModal";
import EditStartDateModal from "@/components/modals/EditStartDateModal";
import { UserContext } from "@/context/UserContext";

export default function Index() {
  const now: Date = new Date();
  const { user } = useContext(UserContext);

  const [welcomeModalVisible, setWelcomeModalVisible] = useState<boolean>(false);
  const [contraceptionModalVisible, setContraceptionModalVisible] = useState<boolean>(false);
  const [startDateModalVisible, setStartDateModalVisible] = useState<boolean>(false);
  const [thanksModalVisible, setThanksModalVisible] = useState<boolean>(false);

  if(!user) setWelcomeModalVisible(true);
  else if(!user.method) setContraceptionModalVisible(true);
  else if(!user.startDate) setStartDateModalVisible(true);

  return (
    <View style={styles.container}>
      <Calendar/>
      <Text style={styles.text}>Accès rapide - {now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
      <CurrentSession/>

      <WelcomModal
        visible={welcomeModalVisible}
        additionalActionTrue={async () => {
          setWelcomeModalVisible(false);
          setContraceptionModalVisible(true);
        }}
      />

      <EditContraceptionModal
        visible={contraceptionModalVisible}
        additionalActionTrue={async () => {
          setContraceptionModalVisible(false);
          setStartDateModalVisible(true);
        }}
      />

      <EditStartDateModal
        visible={startDateModalVisible}
        additionalActionTrue={async () => {
          setStartDateModalVisible(false);
          setThanksModalVisible(true);
        }}
      />

      <CustomModal
        title="C'est terminé !"
        visible={thanksModalVisible}
        actionTrueText="Terminer"
        actionTrue={() => setThanksModalVisible(false)}
      >
        <Text style={{textAlign: "center"}}>Merci d'avoir télécharger Clément !</Text>
        <Text style={{textAlign: "center"}}>Nous vous souhaitons de réussir votre contracéption</Text>
      </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  text: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
})