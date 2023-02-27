import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';
import { ErrorManager, FlexPluginErrorType } from '../../utils/ErrorManager';

export function handleInternalUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
  try {
    flex.Actions.addListener('beforeUnholdCall', async (payload, abortFunction) => {
      if (!isInternalCall(payload.task)) {
        return;
      }

      const { task } = payload;
      const conference = task.conference ? task.conference.conferenceSid : task.attributes.conferenceSid;

      const participant = task.attributes.conference.participants
        ? task.attributes.conference.participants.worker
        : task.attributes.worker_call_sid;

      await InternalCallService.unholdParticipant(conference, participant);
      abortFunction();
    });
  } catch (e) {
    throw ErrorManager.createAndProcessError("Could not add 'beforeUnholdCall' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeUnholdCall' listener",
      context: 'Plugin.Action.beforeUnholdCall',
      wrappedError: e,
    });
  }
}
