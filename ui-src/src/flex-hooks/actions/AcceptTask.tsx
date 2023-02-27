import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { ErrorManager, FlexPluginErrorType } from 'utils/ErrorManager';

export function handleInternalAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeAcceptTask', async (payload, abortFunction) => {
      if (!isInternalCall(payload.task)) {
        return;
      }

      abortFunction();
      await InternalCallService.acceptInternalTask(payload.task.sourceObject, payload.task.taskSid);
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeAcceptTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeAcceptTask' listener",
      context: 'Plugin.Action.beforeAcceptTask',
      wrappedError: e,
    });
  }
}
