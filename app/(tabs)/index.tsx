import Calendar from "@/components/Calendar";
import CurrentSession from "@/components/CurrentSession";
import CustomModal from "@/components/modals/CustomModal";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WelcomModal from "@/components/modals/WelcomeModal";
import SetContraceptionMethodModal from "@/components/modals/SetContraceptionMethodModal";
import SetContraceptionStartDateModal from "@/components/modals/SetContraceptionStartDateModal";
import { UserContext } from "@/context/UserContext";
import { User } from "@/types/UserType";
import { updateUser } from "@/database/user";

export default function Index() {
  const now: Date = new Date();
  const { user, setUser } = useContext(UserContext);
  const hasUserConfigured = useRef(false);

  const [welcomeModalVisible, setWelcomeModalVisible] = useState<boolean>(false);
  const [contraceptionModalVisible, setContraceptionModalVisible] = useState<boolean>(false);
  const [startDateModalVisible, setStartDateModalVisible] = useState<boolean>(false);
  const [thanksModalVisible, setThanksModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!hasUserConfigured.current && !user.isActive) {
      setWelcomeModalVisible(true);
      hasUserConfigured.current = true;
    }
  }, [user]);

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

      <SetContraceptionMethodModal
        visible={contraceptionModalVisible}
        additionalActionTrue={async () => {
          setContraceptionModalVisible(false);
          setStartDateModalVisible(true);
        }}
      />

      <SetContraceptionStartDateModal
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
        actionTrue={async () => {
          setThanksModalVisible(false);
          
          const newUser: User = {
            ...user,
            isActive: true
          }

          await updateUser(newUser);
          setUser(newUser);
        }}
      >
        <Text style={{textAlign: "center", marginBottom: 10}}>Merci d'avoir télécharger Clément !</Text>
        <Text style={{textAlign: "center"}}>Je vous souahite de réussir votre contracéption</Text>
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