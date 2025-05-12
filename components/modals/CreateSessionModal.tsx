import CustomModal from "./CustomModal";
import { useContext, useState } from "react";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import TimeEditor from "../TimeEditor";
import { createSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";
import { timeVerifications } from "@/services/session";
import { reScheduleNotifications } from "@/services/notifications";
import { UserContext } from "@/context/UserContext";
import { Session } from "@/types/SessionType";


type CreateSessionModalProps = {
  date: Date,
  sexWithoutProtection: boolean,
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}


export default function CreateSessionModal({ date, sexWithoutProtection, visible, setVisible }: CreateSessionModalProps) {
  const { user } = useContext(UserContext);

  const sessionStore = getSessionStore();

  const [startTime, setStartTime] = useState<Date>(date);
  const [endTime, setEndTime] = useState<Date>(date);

  const actionTrue = async () => {
    const session: Session = {
      id: 0,
      dateTimeStart: startTime,
      dateTimeEnd: endTime,
      sexWithoutProtection: sexWithoutProtection
    }
    const ok = timeVerifications(session, startTime, endTime, 'MODAL::1');
    if(!ok) return;

    const sessionId = await createSession({
      id: 0,
      dateTimeStart: startTime,
      dateTimeEnd: endTime,
      sexWithoutProtection: sexWithoutProtection,
    });

    if(sessionId) {
      session.id = sessionId;
      sessionStore.addSession(session);
    }

    await reScheduleNotifications(user);

    setVisible(false);
  }

  return (
    <CustomModal
      title="Ajouter une session"
      visible={visible}
      actionFalseText="Annuler"
      actionTrueText="Ajouter"
      actionFalse={() => {
        setStartTime(date);
        setEndTime(date);
        setVisible(false);
      }}
      actionTrue={actionTrue}
    >
      <TimeEditor icon={TimeTextIcon.CALENDAR_START} date={startTime} setDate={setStartTime} />
      <TimeEditor icon={TimeTextIcon.CALENDAR_END} date={endTime} setDate={setEndTime} />
    </CustomModal>
  )
}


