import * as Flex from '@twilio/flex-ui';
import { handleInternalHoldCall } from '../HoldCall';
import InternalCallService from '../../../service/InternalCallService';

jest.mock('../../../service/InternalCallService', () => {
  return {
    holdParticipant: jest.fn(),
  };
});

describe('HoldCall Action', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  const actionSpy = jest.spyOn(InternalCallService, 'holdParticipant');

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('adds beforeHoldParticipant listener', async () => {
    const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await handleInternalHoldCall(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should not call InternalCallService.holdParticipant as it is not an internal call', async () => {
    await handleInternalHoldCall(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: false, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('HoldCall', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should call InternalCallService.holdParticipant with correct parameters', async () => {
    await handleInternalHoldCall(flex, manager);
    const mockPayload = {
      participantType: 'unknown',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: { worker: [] } } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('HoldCall', mockPayload);
    expect(actionSpy).toHaveBeenCalled();
    expect(actionSpy).toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });

  it('should not call InternalCallService.holdParticipant with incorrect participantType', async () => {
    await handleInternalHoldCall(flex, manager);
    const mockPayload = {
      participantType: 'agent',
      task: {
        conference: { conferenceSid: 'mockSid' },
        attributes: { client_call: true, conference: { participants: [] } },
      },
      targetSid: 'mockPartSid',
    };
    flex.Actions.invokeAction('HoldCall', mockPayload);
    expect(actionSpy).not.toBeCalledWith('mockSid', []);
    actionSpy.mockRestore();
  });
});
