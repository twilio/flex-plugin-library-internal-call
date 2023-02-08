import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';

export function handleInternalAcceptTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeAcceptTask', async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }

    abortFunction();
    await InternalCallService.acceptInternalTask(payload.task.sourceObject, payload.task.taskSid);
  });
}
