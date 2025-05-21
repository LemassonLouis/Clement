import { ImportType } from "@/enums/ImportTypes";
import { toast } from "@backpackapp-io/react-native-toast";
import { getDocumentAsync } from "expo-document-picker";
import { DEFAULT_TOAST_ERROR_CONFIG, DEFAULT_TOAST_SUCCESS_CONFIG } from "./toast";
import * as FileSystem from 'expo-file-system';
import { parse } from "papaparse";
import { timeVerifications } from "./session";
import { Session } from "@/types/SessionType";
import { createSession } from "@/database/session";
import { getSessionStore } from "@/store/SessionStore";


/**
 * Import data.
 * @param type Import type
 */
export async function importData(type: ImportType): Promise<void> {
  switch(type) {
    case ImportType.CSV: {
      await importFromCSV();

      break;
    }
    default: {
      console.error("This export type isn't supported");
      toast.error("This export type isn't supported", DEFAULT_TOAST_ERROR_CONFIG);
    }
  }
}



/**
 * Import data from a CSV file.
 */
async function importFromCSV(): Promise<void> {
  try {
    const document = await getDocumentAsync({
      multiple: false,
      type: [
        'text/csv',
        'text/comma-separated-values'
      ]
    });
    
    if(!document.canceled) {
      const content = await FileSystem.readAsStringAsync(document.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const result = parse<Session>(content, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });

      const verifications = result.data.map(session => {
        return {
          ok: timeVerifications({...session, id: 0}, session.dateTimeStart, session.dateTimeEnd!),
          sessionId: session.id
        }
      });

      if(verifications.every(verification => verification.ok)) {
        for(const session of result.data) {
          const sessionId = await createSession(session);

          if(sessionId) {
            session.id = sessionId;
            getSessionStore().addSession(session);
          }
        }

        toast.success("Import terminé", DEFAULT_TOAST_SUCCESS_CONFIG);
      }
      else {
        const badSessionIds = verifications.filter(verification => !verification.ok).map(verification => verification.sessionId);

        toast.error("Impossible d'importer, les sessions avec les id suivant posent problème : " + badSessionIds, DEFAULT_TOAST_ERROR_CONFIG)
      }
    }
  }
  catch(error) {
    console.error("Error while trying to import from CSV : " + error);
    toast.error("Error while trying to import from CSV : " + error, DEFAULT_TOAST_ERROR_CONFIG);
  }
}