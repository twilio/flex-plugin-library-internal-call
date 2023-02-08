import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import AddReducers from './flex-hooks/redux';
import Conference from './flex-hooks/notifications/Conference';
import ConfigureFlexStrings from './flex-hooks/strings/Conference';
import { handleConferenceHangup } from './flex-hooks/actions/HangupCall';
import { handleHoldConferenceParticipant } from './flex-hooks/actions/HoldParticipant';
import { handleKickConferenceParticipant } from './flex-hooks/actions/KickParticipant';
import { handleUnholdConferenceParticipant } from './flex-hooks/actions/UnholdParticipant';
import { addConferenceToCallCanvas } from './flex-hooks/components/CallCanvas';
import { addConferenceToCallCanvasActions } from './flex-hooks/components/CallCanvasActions';
import { addConferenceToParticipantCanvas } from './flex-hooks/components/ParticipantCanvas';
import CustomizePasteElements from './utils/PasteThemeProvider';

const PLUGIN_NAME = 'Conference';

export default class InternalCallPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {

    const initializers = [
      AddReducers,
      ConfigureFlexStrings,
      CustomizePasteElements,
      addConferenceToCallCanvas,
      addConferenceToCallCanvasActions,
      addConferenceToParticipantCanvas,
      Conference,
      handleConferenceHangup,
      handleHoldConferenceParticipant,
      handleKickConferenceParticipant,
      handleUnholdConferenceParticipant
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
