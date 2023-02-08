import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';

export function handleInternalRejectTask(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeRejectTask', async (payload, abortFunction) => {
    if (!isInternalCall(payload.task)) {
      return;
    }

    abortFunction();
    await InternalCallService.rejectInternalTask(payload.task);
  });
}
