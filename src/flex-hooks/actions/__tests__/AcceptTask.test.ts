import * as Flex from '@twilio/flex-ui';
import { handleInternalAcceptTask } from '../AcceptTask';
import InternalCallService from '../../../service/InternalCallService';

jest.mock('../../../service/InternalCallService', () => {
  return {
    acceptInternalTask: jest.fn(),
  };
});

describe('HoldCall Action', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(InternalCallService, 'acceptInternalTask');
  jest.mock('../../../service/InternalCallService', () => {
    return {
      acceptInternalTask: jest.fn(),
    };
  });
  beforeEach(() => {
    jest.mock('../../../service/InternalCallService', () => {
      return {
        acceptInternalTask: jest.fn(),
      };
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('adds beforeAcceptTask listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalAcceptTask(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should call InternalCallService.acceptInternalTask with correct parameters', async () => {
    await handleInternalAcceptTask(flex, manager);
    const mockReservationObj = {
      task: {
        attributes: {
          conference: { participants: { worker: [] } },
        },
      },
      call: jest.fn(),
    };
    const mockPayload = {
      task: {
        sourceObject: mockReservationObj,
        taskSid: 'mockTaskSid',
        attributes: { client_call: true },
      },
    };
    flex.Actions.invokeAction('AcceptTask', mockPayload);
    expect(actionSpy).toBeCalledWith(mockReservationObj, 'mockTaskSid');
    actionSpy.mockRestore();
  });

  it('should not call InternalCallService.acceptInternalTask as it is not an internal call', async () => {
    await handleInternalAcceptTask(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: false, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('AcceptTask', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should not call InternalCallService.acceptInternalTask with incorrect participantType', async () => {
    await handleInternalAcceptTask(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('AcceptTask', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });
});
