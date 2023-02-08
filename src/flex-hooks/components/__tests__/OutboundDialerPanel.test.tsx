import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { addInternalCallToDialerPanel } from '../OutboundDialerPanel';

describe('CallCanvas', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = flex.Manager.getInstance();
  const addContentSpy = jest.spyOn(Flex.OutboundDialerPanel.Content, 'add');

  it('adds InternalDialpad to call canvas', () => {
    addInternalCallToDialerPanel(flex, manager);
    expect(addContentSpy).toHaveBeenCalledTimes(1);
  });
});
