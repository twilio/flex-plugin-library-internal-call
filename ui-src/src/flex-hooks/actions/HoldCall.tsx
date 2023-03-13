import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export function handleInternalHoldCall(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeHoldCall', async (payload, abortFunction) => {
      if (!isInternalCall(payload.task)) {
        return;
      }

      const { task } = payload;
      const conference = task.conference ? task.conference.conferenceSid : task.attributes.conferenceSid;

      const participant = task.attributes.conference.participants
        ? task.attributes.conference.participants.worker
        : task.attributes.worker_call_sid;

      await InternalCallService.holdParticipant(conference, participant);
      abortFunction();
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeHoldCall' listener ", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeHoldCall' listener",
      context: 'Plugin.Action.beforeHoldCall',
      wrappedError: e,
    });
  }
}
