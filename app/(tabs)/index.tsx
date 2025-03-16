import Calendar from "@/components/Calendar";
import CurrentSession from "@/components/CurrentSession";
import CustomModal from "@/components/CustomModal";
import { ContraceptionMethods } from "@/enums/ContraceptionMethod";
import { ContraceptionMethodInterface } from "@/interfaces/ContraceptionMethod";
import { getAllContraceptionMethods } from "@/services/contraception";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import DatePicker from "react-native-date-picker";
import DateEditor from "@/components/DateEditor";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { getUser } from "@/database/user";

export default function Index() {
  const now: Date = new Date();

  const [welcomeModalVisible, setWelcomeModalVisible] = useState<boolean>(false);
  const [contraceptionModalVisible, setContraceptionModalVisible] = useState<boolean>(false);
  const [selectedContraception, setSelectedContraception] = useState<ContraceptionMethods>(ContraceptionMethods.ANDRO_SWITCH);
  const [startDateModalVisible, setStartDateModalVisible] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [thanksModalVisible, setThanksModalVisible] = useState<boolean>(false);


  const chooseContraceptionMethod = (item: any) => {
    setSelectedContraception(item.slug);
  }

  const renderContraceptionMethod = ({ item }: { item: ContraceptionMethodInterface }) => {
    return (
      <TouchableOpacity
        style={[styles.contraceptionMethod, selectedContraception === item.slug && styles.selectedMethod]}
        onPress={() => chooseContraceptionMethod(item)}
      >
        <Text>{item.name}</Text>
        {selectedContraception === item.slug && <Feather name="check-circle" size={20} color="#000" />}
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      console.log("user", user);
      // Si il n'y a pas de user
      if(!user) setWelcomeModalVisible(true);
      // si le user n'a pas de méthodes choisi

      // si le user n'a pas de date de début
    }

    fetchData();
  }, [])

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Calendar/>
        <Text style={styles.text}>Accès rapide - {now.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</Text>
        <CurrentSession/>

        <CustomModal
          title="Bienvenue !"
          visible={welcomeModalVisible}
          actionTrueText="OK"
          actionTrue={() => {
            setWelcomeModalVisible(false);
            // TODO : create user
            setContraceptionModalVisible(true);
          }}
        >
          <Text>Bonjour et bienvenu sur Clément !</Text>
          <Text style={{textAlign: "center"}}>Nous allons vous poser quelques questions afin de configurer l'application</Text>
          <Text style={{textAlign: "center"}}>(Ces informations seront modifiables)</Text>
        </CustomModal>

        <CustomModal
          title="Votre méthode de contraception"
          visible={contraceptionModalVisible}
          actionTrueText="Suivant"
          actionTrue={() => {
            setContraceptionModalVisible(false);
            // TODO : update user (contraception method)
            setStartDateModalVisible(true);
          }}
        >
          <Text style={{textAlign: "center"}}>Quel méthode de contracepation thèrmique utilisez-vous ou souhaitez-vous utiliser ?</Text>
          <FlatList
            numColumns={1}
            style={styles.contraceptionList}
            data={getAllContraceptionMethods()}
            keyExtractor={item => item.slug}
            extraData={selectedContraception}
            renderItem={renderContraceptionMethod}
          />
        </CustomModal>

        <CustomModal
          title="Date de début de contraception"
          visible={startDateModalVisible}
          actionTrueText="Suivant"
          actionTrue={() => {
            setStartDateModalVisible(false);
            // TODO : update user (start date)
            setThanksModalVisible(true);
          }}
        >
          <Text style={{textAlign: "center", marginBottom: 20}}>À quel date souhaitez vous ou avez commencer la contraception ?</Text>
          <DateEditor
            icon={TimeTextIcon.CALENDAR_START}
            date={startDate}
            setDate={setStartDate}
          />
        </CustomModal>

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
  contraceptionList: {
    flexGrow: 0,
    marginVertical: 10,
  },
  contraceptionMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '100%',
  },
  selectedMethod: {
    backgroundColor: '#ddd',
  }
})