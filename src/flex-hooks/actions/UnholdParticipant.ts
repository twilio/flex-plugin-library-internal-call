import * as Flex from '@twilio/flex-ui';
import ConferenceService from '../../service/ConferenceService';

export function handleUnholdConferenceParticipant(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener('beforeUnholdParticipant', async (payload, abortFunction) => {
    const { participantType, targetSid: participantSid, task } = payload;

    if (participantType !== 'unknown') {
      return;
    }

    console.log('Unholding participant', participantSid);

    const conferenceSid = task.conference?.conferenceSid;
    abortFunction();
    await ConferenceService.unholdParticipant(conferenceSid, participantSid);
  });
}
