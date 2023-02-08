import * as Flex from '@twilio/flex-ui';
import { handleInternalUnholdCall } from '../UnholdCall';
import InternalCallService from '../../../service/InternalCallService';

jest.mock('../../../service/InternalCallService', () => {
  return {
    unholdParticipant: jest.fn(),
  };
});

describe('UnholdParticipant Action', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(InternalCallService, 'unholdParticipant');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeUnholdParticipant listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalUnholdCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should not call InternalCallService.unholdParticipant as it is not an internal call', async () => {
    await handleInternalUnholdCall(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: false, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('UnholdCall', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should call InternalCallService.unholdParticipant with correct parameters', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalUnholdCall(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: { worker: [] } } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('UnholdCall', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should not call InternalCallService.unholdParticipant with incorrect participantType', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalUnholdCall(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('UnholdCall', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });
});
