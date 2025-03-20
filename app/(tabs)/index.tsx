import Calendar from "@/components/Calendar";
import CurrentSession from "@/components/CurrentSession";
import CustomModal from "@/components/CustomModal";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getUserStore } from "@/store/UserStore";
import WelcomModal from "@/components/WelcomeModal";
import EditContraceptionModal from "@/components/EditContraceptionModal";
import EditStartDateModal from "@/components/EditStartDateModal";

export default function Index() {
  const now: Date = new Date();

  const [welcomeModalVisible, setWelcomeModalVisible] = useState<boolean>(false);
  const [contraceptionModalVisible, setContraceptionModalVisible] = useState<boolean>(false);
  const [startDateModalVisible, setStartDateModalVisible] = useState<boolean>(false);
  const [thanksModalVisible, setThanksModalVisible] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      await getUserStore().loadUser();
      const user = getUserStore().getUser();

      console.log("user", user);

      if(!user) setWelcomeModalVisible(true);
      else if(!user.method) setContraceptionModalVisible(true);
      else if(!user.startDate) setStartDateModalVisible(true);
    }

    fetchData();
  }, [])

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </GestureHandlerRootView>
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