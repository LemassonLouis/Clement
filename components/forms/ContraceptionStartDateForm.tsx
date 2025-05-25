import { TimeTextIcon } from "@/enums/TimeTextIcon";
import DateEditor from "../dateAndTime/DateEditor";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { StyleSheet, View } from "react-native";
import { User } from "@/types/UserType";
import { updateUser } from "@/database/user";
import { getStartAndEndDate } from "@/services/date";
import { reScheduleNotifications } from "@/services/notifications";


type ContraceptionStartDateFormProps = {
  autoValidate?: boolean
}


const ContraceptionStartDateForm = forwardRef(({ autoValidate = false }: ContraceptionStartDateFormProps, ref) => {
  const { user, setUser } = useContext(UserContext);

  const [startDate, setStartDate] = useState<Date>(user.startDate);

  const saveForm = async (date: Date = startDate) => {
    const newUser: User = {
      ...user,
      startDate: getStartAndEndDate(date).dateStart
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
    </View>
  )
});


export default ContraceptionStartDateForm;


const styles = StyleSheet.create({
  container: {

  }
})