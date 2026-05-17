import { message as staticMessage } from "antd";

let messageApi = null;

/** Call from `<App>` via `NotifyHost` so toasts use the same context as `ConfigProvider` / `<App message={{...}}>`. Pass `null` on unmount. */
export function registerMessageApi(api) {
  messageApi = api;
}

function getMessage() {
  return messageApi ?? staticMessage;
}

/**
 * Transient feedback — delegates to `App.useApp().message` when available.
 * Import this (or `./toast`) instead of antd `message` directly.
 */
export const toast = {
  success(content, duration, onClose) {
    return getMessage().success(content, duration, onClose);
  },
  error(content, duration, onClose) {
    return getMessage().error(content, duration, onClose);
  },
  warning(content, duration, onClose) {
    return getMessage().warning(content, duration, onClose);
  },
  info(content, duration, onClose) {
    return getMessage().info(content, duration, onClose);
  },
  loading(content, duration, onClose) {
    return getMessage().loading(content, duration, onClose);
  },
};
