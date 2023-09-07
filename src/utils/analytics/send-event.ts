type UserLoginEvent = {
  type: "user_login";
  timestamp: Date;
  data: {};
};

type AnalyticsEvent = UserLoginEvent;

export const sendEvent = async (event: AnalyticsEvent) => {
  if (!import.meta.env.VITE_PUBLIC_TINYBIRD_TOKEN) {
    throw new Error("VITE_PUBLIC_TINYBIRD_TOKEN is required for sendEvent");
  }

  try {
    await fetch(`https://api.us-east.tinybird.co/v0/events?name=${event.type}`, {
      method: "POST",
      body: JSON.stringify({ ...event.data, timestamp: event.timestamp.toISOString() }),
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_TINYBIRD_TOKEN}`,
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};
