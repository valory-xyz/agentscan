import * as amplitude from "@amplitude/analytics-browser";

import { v4 as uuidv4 } from "uuid";

const ANONYMOUS_ID_KEY = "agentscan_anonymous_id";

export const initAmplitude = () => {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string);
  setUserId(null);
};

export const setUserId = (userId: string | null) => {
  const anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY) || uuidv4();

  if (!anonymousId) {
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  }

  if (userId) {
    amplitude.setUserId(userId);
  }
  amplitude.identify(new amplitude.Identify().set("anonymousId", anonymousId));
};

export const logEvent = async (
  eventName: string,
  eventProperties?: Record<string, any>
) => {
  try {
    amplitude.track(eventName, eventProperties);
  } catch (error) {}
};
