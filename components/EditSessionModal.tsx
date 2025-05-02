import CustomModal from "./CustomModal";
import { useContext, useState } from "react";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import TimeEditor from "./TimeEditor";
import { updateSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";
import { timeVerifications } from "@/services/session";
import { reScheduleNotifications } from "@/services/notifications";
import { UserContext } from "@/context/UserContext";


export default function EditSessionModal({ session, visible, setVisible }: DeleteSessionModalInterface) {
  const { user } = useContext(UserContext);

  const sessionStore = getSessionStore();

  const [startTime, setStartTime] = useState<Date>(session.dateTimeStart);
  const [endTime, setEndTime] = useState<Date>(session.dateTimeEnd);

  const actionTrue = async () => {
    const ok = timeVerifications(session, startTime, endTime, 'MODAL::1');
    if(!ok) return;

    await updateSession(session.id, startTime.toISOString(), endTime.toISOString(), session.sexWithoutProtection);

    sessionStore.updateSessions([{
      id: session.id,
      dateTimeStart: startTime,
      dateTimeEnd: endTime,
      sexWithoutProtection: session.sexWithoutProtection
    }]);

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
        setEndTime(session.dateTimeEnd);
        setVisible(false);
      }}
      actionTrue={actionTrue}
    >
      <TimeEditor icon={TimeTextIcon.CALENDAR_START} date={startTime} setDate={setStartTime} />
      <TimeEditor icon={TimeTextIcon.CALENDAR_END} date={endTime} setDate={setEndTime} />
    </CustomModal>
  )
}
