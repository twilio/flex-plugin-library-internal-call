import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';

export function handleHoldConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeHoldParticipant', async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;

    if (participantType !== 'unknown') {
      return;
    }

    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    console.log('Holding participant', participantSid);
    await ConferenceService.holdParticipant(conferenceSid, participantSid);
  });
}
