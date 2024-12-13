import { useCallback } from "react";
import { useNotification } from "mds";
import { ErrorResponseHandler } from "../../../../common/types";
import { QueryErrorHookNotificationOpts } from "../../../../types";

export const useQueryError = () => {
  const notification = useNotification();

  const notifyError = useCallback(
    (
      error: ErrorResponseHandler,
      options?: QueryErrorHookNotificationOpts,
    ) => {
      if (error) {
        notification.danger(options?.title || error.errorMessage, {
          ...options,
          children: error.detailedError,
        });
      }
    },
    [notification],
  );

  const notifyPageError = useCallback(
    (
      error: ErrorResponseHandler,
      options?: QueryErrorHookNotificationOpts,
    ) => {
      if (error) {
        notification.danger(options?.title || error.errorMessage, {
          ...options,
          children: error.detailedError,
          duration: 0,
        });
      }
    },
    [notification],
  );

  return {
    notifyError,
    notifyPageError,
  };
};