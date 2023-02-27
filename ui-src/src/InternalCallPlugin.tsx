import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import InternalCall from './flex-hooks/notifications/InternalCall';
import { handleInternalAcceptTask } from './flex-hooks/actions/AcceptTask';
import { handleInternalRejectTask } from './flex-hooks/actions/RejectTask';
import { handleInternalHoldCall } from './flex-hooks/actions/HoldCall';
import { handleInternalUnholdCall } from './flex-hooks/actions/UnholdCall';
import { removeDirectoryFromInternalCalls } from './flex-hooks/components/CallCanvasActions';
import { addInternalCallToDialerPanel } from './flex-hooks/components/OutboundDialerPanel';
import CustomizePasteElements from './utils/PasteThemeProvider';
import ConfigureFlexStrings from './flex-hooks/strings/InternalCall';

const PLUGIN_NAME = 'InternalCall';

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
      CustomizePasteElements,
      handleInternalAcceptTask,
      handleInternalHoldCall,
      handleInternalRejectTask,
      handleInternalUnholdCall,
      addInternalCallToDialerPanel,
      removeDirectoryFromInternalCalls,
      InternalCall,
      ConfigureFlexStrings,
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
