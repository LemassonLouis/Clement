import Calendar from "@/components/calendar/Calendar";
import CurrentSession from "@/components/session/CurrentSession";
import CustomModal from "@/components/modals/CustomModal";
import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WelcomModal from "@/components/modals/WelcomeModal";
import SetContraceptionMethodModal from "@/components/modals/SetContraceptionMethodModal";
import SetContraceptionStartDateModal from "@/components/modals/SetContraceptionStartDateModal";
import { UserContext } from "@/context/UserContext";
import { User } from "@/types/UserType";
import { updateUser } from "@/database/user";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


export default function Index() {
  const now: Date = new Date();
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const hasUserConfigured = useRef(false);
  const currentTheme = getTheme(theme.slug);

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
      <Text style={[styles.text, { color: currentTheme.text_color }]}>Accès rapide - {now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
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
        <Text style={{textAlign: "center", marginBottom: 10, color: currentTheme.text_color}}>Merci d'avoir télécharger Clément !</Text>
        <Text style={{textAlign: "center", color: currentTheme.text_color }}>Je vous souhaite de réussir votre contracéption</Text>
      </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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