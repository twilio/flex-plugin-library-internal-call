import * as Flex from '@twilio/flex-ui';
import React from 'react';
import InternalDialpad from '../../components/InternalDialpad';

export function addInternalCallToDialerPanel(flex: typeof Flex, manager: Flex.Manager) {
  flex.OutboundDialerPanel.Content.add(<InternalDialpad key="select-dialpad" manager={manager} />);
}
