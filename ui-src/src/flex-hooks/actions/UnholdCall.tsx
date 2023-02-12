import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';

export function handleInternalUnholdCall(flex: typeof Flex, manager: Flex.Manager) {
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
}
