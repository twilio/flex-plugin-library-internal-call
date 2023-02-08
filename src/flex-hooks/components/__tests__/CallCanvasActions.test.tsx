import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { removeDirectoryFromInternalCalls } from '../CallCanvasActions';

describe('CallCanvas', () => {
  let flex: typeof Flex = Flex;
  const addContentSpy = jest.spyOn(Flex.CallCanvasActions.Content, 'remove');

  it('removes directory from call canvas', () => {
    removeDirectoryFromInternalCalls(flex);
    expect(addContentSpy).toHaveBeenCalledTimes(1);
    expect(addContentSpy).toHaveBeenCalledWith('directory', { if: true });
  });
});
