import * as Flex from '@twilio/flex-ui';
import InternalCallService from '../../service/InternalCallService';
import { isInternalCall } from '../../helpers/internalCall';

export function handleInternalHoldCall(flex: typeof Flex, manager: Flex.Manager) {
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
}
