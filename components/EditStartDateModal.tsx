import { Text } from "react-native";
import CustomModal from "./CustomModal";
import DateEditor from "./DateEditor";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { useContext, useState } from "react";
import { updateUser } from "@/database/user";
import { getStartAndEndDate } from "@/services/date";
import { UserContext } from "@/context/UserContext";
import { User } from "@/types/UserType";

export default function EditStartDateModal({ visible, additionalActionTrue }: {visible: boolean, additionalActionTrue: () => void}) {
  const { user, setUser } = useContext(UserContext);

  const [startDate, setStartDate] = useState<Date>(user.startDate);

  return (
    <CustomModal
      title="Date de début de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={async () => {
        const newUser: User = {
          ...user,
          startDate: getStartAndEndDate(startDate).dateStart
        }

        await updateUser(newUser);
        setUser(newUser);

        additionalActionTrue();
      }}
    >
      <Text style={{textAlign: "center", marginBottom: 20}}>À quel date souhaitez vous ou avez commencer la contraception ?</Text>
      <DateEditor
        icon={TimeTextIcon.CALENDAR_START}
        date={startDate}
        setDate={setStartDate}
      />
    </CustomModal>
  )
}