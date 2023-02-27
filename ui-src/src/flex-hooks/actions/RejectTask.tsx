import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { ErrorManager, FlexPluginErrorType } from 'utils/ErrorManager';

export function handleInternalRejectTask(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeRejectTask', async (payload, abortFunction) => {
      if (!isInternalCall(payload.task)) {
        return;
      }

      abortFunction();
      await InternalCallService.rejectInternalTask(payload.task);
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeRejectTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeRejectTask' listener",
      context: 'Plugin.Action.beforeRejectTask',
      wrappedError: e,
    });
  }
}
