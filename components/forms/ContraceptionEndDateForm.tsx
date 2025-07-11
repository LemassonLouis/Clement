import { TimeTextIcon } from "@/enums/TimeTextIcon";
import DateEditor from "../dateAndTime/DateEditor";
import { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { StyleSheet, View } from "react-native";
import { User } from "@/types/UserType";
import { updateUser } from "@/database/user";
import { getStartAndEndDate } from "@/services/date";
import { reScheduleNotifications } from "@/services/notifications";
import { toast } from "@backpackapp-io/react-native-toast";
import { DEFAULT_TOAST_ERROR_CONFIG } from "@/services/toast";


type ContraceptionEndDateFormProps = {
  autoValidate?: boolean
}


const ContraceptionEndDateForm = forwardRef(({ autoValidate = false }: ContraceptionEndDateFormProps, ref) => {
  const { user, setUser } = useContext(UserContext);

  const [endDate, setEndDate] = useState<Date>(user.endDate);

  const saveForm = async (date: Date = endDate) => {
    if(date < user.startDate) {
      toast.error("La date de fin ne peux pas être inférieur à la date de début", DEFAULT_TOAST_ERROR_CONFIG);
      setEndDate(user.endDate);
      return;
    }

    const newUser: User = {
      ...user,
      endDate: getStartAndEndDate(date).dateEnd
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
        icon={TimeTextIcon.CALENDAR_END}
        date={endDate}
        setDate={setEndDate}
        additionnalOnConfirm={date => {
          if(autoValidate) saveForm(date);
        }}
      />
    </View>
  )
});


export default ContraceptionEndDateForm;


const styles = StyleSheet.create({
  container: {

  }
})