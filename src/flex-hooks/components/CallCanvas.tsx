import * as Flex from '@twilio/flex-ui';
import ConferenceDialog from '../../components/ConferenceDialog';
import ConferenceMonitor from '../../components/ConferenceMonitor';

export function addConferenceToCallCanvas(flex: typeof Flex) {
  
  // This component doesn't render anything to the UI, it just monitors
  // conference changes and takes action as necessary
  flex.CallCanvas.Content.add(<ConferenceMonitor
    key="conference-monitor"
  />, { sortOrder: 999 });
  
  flex.CallCanvas.Content.add(<ConferenceDialog
    key="conference-modal"
  />, { sortOrder: 100 });
}
