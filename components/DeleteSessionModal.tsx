import { deleteSession } from "@/database/session";
import CustomModal from "./CustomModal";
import { getSessionStore } from "@/store/SessionStore";
import { reScheduleNotifications } from "@/services/notifications";


export default function DeleteSessionModal({ session, visible, setVisible }: DeleteSessionModalInterface) {
  const sessionStore = getSessionStore();

  const actionTrue = async () => {
    await deleteSession(session.id);
    sessionStore.removeSession(session);

    await reScheduleNotifications();

    setVisible(false);
  }

  const actionFalse = () => {
    setVisible(false);
  }

  return (
    <CustomModal
      title="Êtes-vous sur de vouloir supprimer cette session ?"
      visible={visible}
      actionFalseText="Non"
      actionFalse={actionFalse}
      actionTrueText="Oui"
      actionTrue={actionTrue}
    />
  )
}