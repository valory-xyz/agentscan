import * as amplitude from "@amplitude/analytics-browser";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "agentscan_user_id";

export const initAmplitude = () => {
  // Get existing user ID or generate a new one
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: true,
    },
  });

  // Set the user ID in Amplitude
  amplitude.setUserId(userId);
};

// Helper function to generate a unique user ID
const generateUserId = () => {
  return uuidv4();
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const logEvent = (
  eventName: string,
  eventProperties?: Record<string, string>
) => {
  amplitude.track(eventName, eventProperties);
};
