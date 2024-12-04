import * as amplitude from "@amplitude/analytics-browser";

import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "agentscan_user_id";

export const initAmplitude = () => {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string);
  setUserId(null);
};

export const setUserId = (userId: string | null) => {
  if (userId) {
    amplitude.setUserId(userId);
  } else {
    const existingUserId = localStorage.getItem(USER_ID_KEY);
    if (existingUserId) {
      amplitude.setUserId(existingUserId);
    } else {
      const newUserId = uuidv4();
      localStorage.setItem(USER_ID_KEY, newUserId);
      amplitude.setUserId(newUserId);
    }
  }
};

export const logEvent = (
  eventName: string,
  eventProperties?: Record<string, string>
) => {
  amplitude.track(eventName, eventProperties);
};
