import * as amplitude from "@amplitude/analytics-browser";

export const initAmplitude = () => {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string);
};

export const setUserId = (userId: string | null) => {
  if (userId) {
    amplitude.setUserId(userId);
  }
};

export const logEvent = (
  eventName: string,
  eventProperties?: Record<string, string>
) => {
  amplitude.track(eventName, eventProperties);
};
