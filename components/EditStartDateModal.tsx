import { Text } from "react-native";
import CustomModal from "./CustomModal";
import DateEditor from "./DateEditor";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import { useCallback, useState, useSyncExternalStore } from "react";
import { updateUser } from "@/database/user";
import { getUserStore } from "@/store/UserStore";
import { getStartAndEndDate } from "@/services/date";

export default function EditStartDateModal({ visible, additionalActionTrue }: {visible: boolean, additionalActionTrue: () => void}) {
  const userStore = getUserStore();
  const userStored = useSyncExternalStore(
    useCallback((callback) => userStore.subscribe(callback), [userStore]),
    useCallback(() => userStore.getUser(), [userStore])
  );

  const [startDate, setStartDate] = useState<Date>(userStored?.startDate ?? new Date());

  return (
    <CustomModal
      title="Date de début de contraception"
      visible={visible}
      actionTrueText="Suivant"
      actionTrue={async () => {
        await updateUser(userStored.id, userStored.method, getStartAndEndDate(startDate).dateStart.toISOString());
        userStore.updateUser({
          id: userStored.id,
          method: userStored.method,
          startDate: getStartAndEndDate(startDate).dateStart
        })

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