import CustomModal from "./CustomModal";
import { useContext, useState } from "react";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import TimeEditor from "../TimeEditor";
import { updateSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";
import { timeVerifications } from "@/services/session";
import { reScheduleNotifications } from "@/services/notifications";
import { UserContext } from "@/context/UserContext";
import { Session } from "@/types/SessionType";
import { View } from "react-native";


type EditSessionModalProps = {
  session: Session,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function EditSessionModal({ session, visible, setVisible }: EditSessionModalProps) {
  const { user } = useContext(UserContext);

  const sessionStore = getSessionStore();

  const [startTime, setStartTime] = useState<Date>(session.dateTimeStart);
  const [endTime, setEndTime] = useState<Date>(session.dateTimeEnd!);

  const actionTrue = async () => {
    const ok = timeVerifications(session, startTime, endTime, 'MODAL::1');
    if(!ok) return;

    const newSession = {
      ...session,
      dateTimeStart: startTime,
      dateTimeEnd: endTime
    }

    await updateSession(newSession);
    sessionStore.updateSessions([newSession]);

    await reScheduleNotifications(user);

    setVisible(false);
  }

  return (
    <CustomModal
      title="Modifier la session"
      visible={visible}
      actionFalseText="Annuler"
      actionTrueText="Modifier"
      actionFalse={() => {
        setStartTime(session.dateTimeStart);
        setEndTime(session.dateTimeEnd!);
        setVisible(false);
      }}
      actionTrue={actionTrue}
    >
      <View style={{ alignItems: 'flex-start', margin: 'auto' }}>
        <TimeEditor icon={TimeTextIcon.CALENDAR_START} date={startTime} setDate={setStartTime} />
        <TimeEditor icon={TimeTextIcon.CALENDAR_END} date={endTime} setDate={setEndTime} />
      </View>
    </CustomModal>
  )
}
