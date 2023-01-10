import * as Flex from '@twilio/flex-ui';
import ConferenceButton from '../../components/ConferenceButton';

export function addConferenceToCallCanvasActions(flex: typeof Flex) {
  
  flex.CallCanvasActions.Content.add(<ConferenceButton
    key="conference"
  />, { sortOrder: 2 });
}
