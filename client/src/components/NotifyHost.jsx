import { App } from "antd";
import { useLayoutEffect } from "react";
import { registerMessageApi } from "../feedback/notify";

/**
 * Bridges `App.useApp().message` into the shared `toast` module so messages
 * respect `<App message={{ ... }} />` placement and styling.
 */
export default function NotifyHost() {
  const { message } = App.useApp();

  useLayoutEffect(() => {
    registerMessageApi(message);
    return () => registerMessageApi(null);
  }, [message]);

  return null;
}
