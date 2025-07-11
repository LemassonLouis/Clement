import { TimeTextIcon } from "@/enums/TimeTextIcon";
import DateEditor from "../dateAndTime/DateEditor";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { StyleSheet, Text, View } from "react-native";
import { User } from "@/types/UserType";
import { updateUser } from "@/database/user";
import { getStartAndEndDate } from "@/services/date";
import { reScheduleNotifications } from "@/services/notifications";
import CustomModal from "../modals/CustomModal";
import { ThemeContext } from "@/context/ThemeContext";
import { getTheme } from "@/services/appStyle";


type ContraceptionStartDateFormProps = {
  autoValidate?: boolean
}


const ContraceptionStartDateForm = forwardRef(({ autoValidate = false }: ContraceptionStartDateFormProps, ref) => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const currentTheme = getTheme(theme.slug);

  const [startDate, setStartDate] = useState<Date>(user.startDate);
  const [resetEndDateConfirmationModalVisible, setResetEndDateConfirmationModalVisible] = useState<boolean>(false);

  const saveForm = async (date: Date = startDate, force: boolean = false) => {
    if(!force) {
      setResetEndDateConfirmationModalVisible(true);
      return;
    }

    const datePlus4Years = new Date(date);
    datePlus4Years.setFullYear(datePlus4Years.getFullYear() + 4);

    const newUser: User = {
      ...user,
      startDate: getStartAndEndDate(date).dateStart,
      endDate: getStartAndEndDate(datePlus4Years).dateEnd,
    }

    await updateUser(newUser);
    setUser(newUser);
    reScheduleNotifications(newUser);
  }

  useImperativeHandle(ref, () => ({
    saveForm,
  }));

  return (
    <View style={styles.container}>
      <DateEditor
        icon={TimeTextIcon.CALENDAR_START}
        date={startDate}
        setDate={setStartDate}
        additionnalOnConfirm={date => {
          if(autoValidate) saveForm(date);
        }}
      />
      <CustomModal
        title="Attention"
        visible={resetEndDateConfirmationModalVisible}
        actionFalseText="Annuler"
        actionFalse={() => {
          setStartDate(user.startDate);
          setResetEndDateConfirmationModalVisible(false);
        }}
        actionTrueText="OK"
        actionTrue={() => {
          saveForm(startDate, true)
          setResetEndDateConfirmationModalVisible(false);
        }}
      >
        <Text style={{textAlign: "center", color: currentTheme.text_color}}>Changer la date de début de contraception va réinitialiser la date de fin de contraception.</Text>
      </CustomModal>
    </View>
  )
});


export default ContraceptionStartDateForm;


const styles = StyleSheet.create({
  container: {

  }
})