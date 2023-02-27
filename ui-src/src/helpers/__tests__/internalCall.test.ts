import * as Flex from '@twilio/flex-ui';
import { makeInternalCall } from '../internalCall';
import { Worker as InstantQueryWorker } from '../../types/InstantQuery';

describe('internal call', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = flex.Manager.getInstance();
  const mockWorker = {
    attributes: { full_name: 'mockFullName', contact_uri: 'mockContatctURI' },
    friendly_name: 'mockFriendlyName',
  } as InstantQueryWorker;
  it('makes an internal call', () => {
    const workerClient = manager.workerClient as any;
    const spyFn = jest.spyOn(workerClient, 'createTask');
    makeInternalCall(manager, mockWorker);
    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).toHaveBeenCalledWith('mockContatctURI', 'mockContactURI', 'WFxxxxxx', 'QSxxxxxx', {
      attributes: {
        to: 'mockContatctURI',
        direction: 'outbound',
        name: 'mockFullName',
        fromName: 'mockFullName',
        targetWorker: 'mockContactURI',
        autoAnswer: 'true',
        client_call: true,
      },
      taskChannelUniqueName: 'voice',
    });
  });
});
