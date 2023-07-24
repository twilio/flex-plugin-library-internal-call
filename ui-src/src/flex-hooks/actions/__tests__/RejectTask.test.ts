import * as Flex from '@twilio/flex-ui';
import { handleInternalRejectTask } from '../RejectTask';
import InternalCallService from '../../../service/InternalCallService';

jest.mock('../../../service/InternalCallService', () => {
  return {
    rejectInternalTask: jest.fn(),
  };
});

describe('HoldCall Action', () => {
  const flex: typeof Flex = Flex;
  const manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(InternalCallService, 'rejectInternalTask');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.mock('../../../service/InternalCallService', () => {
      return {
        rejectInternalTask: jest.fn(),
      };
    });
  });

  it('adds beforeRejectTask listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalRejectTask(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should not call InternalCallService.rejectInternalTask as it is not an internal call', async () => {
    await handleInternalRejectTask(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: false, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('RejectTask', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should call InternalCallService.rejectInternalTask with correct parameters', async () => {
    await handleInternalRejectTask(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: { worker: [] } } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('RejectTask', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith({
      conference: { conferenceSid: 'mockSid' },
      attributes: { client_call: true, conference: { participants: { worker: [] } } },
    });
    actionSpy.mockRestore();
  });

  it('should not call InternalCallService.rejectInternalTask with incorrect participantType', async () => {
    await handleInternalRejectTask(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('RejectTask', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });
});
