import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { removeDirectoryFromInternalCalls } from '../CallCanvasActions';

describe('CallCanvas', () => {
  const flex: typeof Flex = Flex;
  const addContentSpy = jest.spyOn(Flex.CallCanvasActions.Content, 'remove');

  it('removes directory from call canvas', () => {
    removeDirectoryFromInternalCalls(flex);
    expect(addContentSpy).toHaveBeenCalledTimes(1);
  });
});
