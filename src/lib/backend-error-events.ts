export type BackendErrorDetail = {
  message: string;
};

export const backendErrorEventName = "creator-commerce:backend-error";

export function showBackendError(message: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<BackendErrorDetail>(backendErrorEventName, {
      detail: { message },
    }),
  );
}
