import { getAllSessions } from "@/database/session";
import { Session } from "@/types/SessionType";
import { toast } from "@backpackapp-io/react-native-toast";
import { DEFAULT_TOAST_ERROR_CONFIG, DEFAULT_TOAST_SUCCESS_CONFIG } from "./toast";
import { ExportType } from "@/enums/ExportTypes";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import * as FileSystem from 'expo-file-system';
import { Platform } from "react-native";


/**
 * Export data (sessions) to a defined type.
 * @param type The export type
 */
export async function exportData(type: ExportType): Promise<void> {
  const sessions : Session[] = await getAllSessions();

  switch(type) {
    case ExportType.CSV: {
      await saveCSVToFile(sessions);

      break;
    }
    default: {
      console.error("This export type isn't supported");
      toast.error("This export type isn't supported", DEFAULT_TOAST_ERROR_CONFIG);
    }
  }
}


/**
 * Convert session to CSV and create file (export).
 * @param sessions The sessions to export.
 * @returns 
 */
async function saveCSVToFile(sessions: Session[]): Promise<void> {
  const header: string[] = Object.keys(sessions[0]);
  const rows = sessions.map(session => [
    session.id,
    session.dateTimeStart.toISOString(),
    session.dateTimeEnd ? session.dateTimeEnd.toISOString() : '',
    session.sexWithoutProtection ? 'true' : 'false',
    session.note ? session.note.replace(/"/g, '""') : ''
  ]);

  const csvContent = [
    header.join(','),
    ...rows.map(row => row.map(value => `"${value}"`).join(','))
  ].join('\n');

  const fileName = `clement-sessions-${Date.now()}.csv`;

  if (Platform.OS === 'android') {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if(!permissions.granted) {
        console.error("Permission not granted");
        toast.error("Permission not granted", DEFAULT_TOAST_ERROR_CONFIG);
        return;
      }

      const directoryUri = permissions.directoryUri;
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri,
        fileName,
        'text/csv'
      );

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      toast.success("Export terminé dans " + fileUri, DEFAULT_TOAST_SUCCESS_CONFIG);

      return;
    } catch (error) {
      console.error("Error while trying to save file on Android : " + error);
      toast.error("Error while trying to save file on Android : " + error, DEFAULT_TOAST_ERROR_CONFIG);
      return;
    }
  }
  
  if (Platform.OS === 'ios') {
    try {
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await isAvailableAsync();
      if(!isAvailable) {
        console.error("Sharing is not available on this device");
        toast.error("Sharing is not available on this device", DEFAULT_TOAST_ERROR_CONFIG);
        return;
      }

      await shareAsync(fileUri);

      toast.success("Export terminé dans " + fileUri, DEFAULT_TOAST_SUCCESS_CONFIG);
      return;
    } catch (error) {
      console.error("Error while trying to save file on iOS : " + error);
      toast.error("Error while trying to save file on iOS : " + error, DEFAULT_TOAST_ERROR_CONFIG);
      return;
    }
  }
};
