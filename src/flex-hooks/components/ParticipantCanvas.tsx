import * as Flex from '@twilio/flex-ui';
import ConnectingParticipants from '../../components/ConnectingParticipants';
import ParticipantActionsButtons from '../../components/ParticipantActionsButtons';
import ParticipantName from '../../components/ParticipantName';
import ParticipantStatus from '../../components/ParticipantStatus';
import ParticipantStatusContainer from '../../components/ParticipantStatusContainer';

export function addConferenceToParticipantCanvas(flex: typeof Flex) {

  const isUnknownParticipant = (props: any) => props.participant.participantType === 'unknown';
  const replaceButtons = (props: any) => {
    // if the add button is disabled, only the customer participant needs replacement buttons
    return props.participant.participantType !== 'transfer';
  };
  
  flex.ParticipantCanvas.Content.remove('actions', { if: replaceButtons });
  flex.ParticipantCanvas.Content.add(
    <ParticipantActionsButtons
      key="custom-actions"
    />, { sortOrder: 10, if: replaceButtons }
  );
  
  flex.ParticipantCanvas.ListItem.Content.remove('actions', { if: replaceButtons });
  flex.ParticipantCanvas.ListItem.Content.add(
    <ParticipantActionsButtons
      key="custom-actions"
    />, { sortOrder: 10, if: replaceButtons }
  );
  
  flex.ParticipantCanvas.Content.remove('name', { if: isUnknownParticipant });
  flex.ParticipantCanvas.Content.add(
    <ParticipantName
      key="custom-name"
    />, { sortOrder: 1, if: isUnknownParticipant }
  );
  
  flex.ParticipantCanvas.Content.remove('status');
  flex.ParticipantCanvas.Content.add(
    <ParticipantStatus
      key="custom-status"
    />, { sortOrder: 2 }
  );
  
  flex.ParticipantCanvas.ListItem.Content.remove('statusContainer');
  flex.ParticipantCanvas.ListItem.Content.add(
    <ParticipantStatusContainer
      key="custom-statusContainer"
    />, { sortOrder: 1 }
  );
  
  // This is used for dynamically displaying 'connecting' conference participants
  flex.ParticipantsCanvas.Content.add(
    <ConnectingParticipants
      key="connecting-participants"
    />, { sortOrder: 1000 }
  );
}
