import CustomModal from "./CustomModal";
import { useState } from "react";
import { TimeTextIcon } from "@/enums/TimeTextIcon";
import TimeEditor from "./TimeEditor";
import { updateSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";
import { timeVerifications } from "@/services/session";
import ErrorsDisplayer from "./ErrorsDisplayer";


export default function CreateSessionModal({ session, visible, setVisible }: DeleteSessionModalInterface) {
  const sessionStore = getSessionStore();

  const [startTime, setStartTime] = useState<Date>(session.dateTimeStart);
  const [endTime, setEndTime] = useState<Date>(session.dateTimeEnd);
  const [errors, setErrors] = useState<string[]>([]);

  const actionTrue = async () => {
    const { ok, errors } = timeVerifications(session, startTime, endTime);
    if(!ok){
      setErrors(errors);
      return;
    }

    setErrors([]);

    await updateSession(session.id, startTime.toISOString(), endTime.toISOString(), session.sexWithoutProtection);

    sessionStore.updateSession({
      id: session.id,
      dateTimeStart: startTime,
      dateTimeEnd: endTime,
      sexWithoutProtection: session.sexWithoutProtection
    });

    setVisible(false);
  }

  return (
    <CustomModal
      title="Ajouter une session"
      visible={visible}
      actionFalseText="Annuler"
      actionTrueText="Ajouter"
      actionFalse={() => {
        setErrors([]);
        setStartTime(session.dateTimeStart);
        setEndTime(session.dateTimeEnd);
        setVisible(false);
      }}
      actionTrue={actionTrue}
    >
      <TimeEditor icon={TimeTextIcon.CALENDAR_START} date={startTime} setDate={setStartTime} />
      <TimeEditor icon={TimeTextIcon.CALENDAR_END} date={endTime} setDate={setEndTime} />

      <ErrorsDisplayer errors={errors} />
    </CustomModal>
  )
}


