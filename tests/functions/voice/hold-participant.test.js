import helpers from '../../test-utils/test-helper';
jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ConferenceUtils: jest.fn(),
}));

import { ConferenceUtils } from '@twilio/flex-plugins-library-utils';

const mockCallSid = 'CSxxxxx';
describe('Hold Participant', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './functions/twilio-wrappers/conference-participant.private.js',
    );
  });

  it('holdParticipant is called successfully ', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        holdParticipant: jest.fn(() =>
          Promise.resolve({
            status: 200,
            participantsResponse: {
              callSid: mockCallSid,
            },
            success: true,
          }),
        ),
      };
    });
    const HoldParticipant = require('../../../functions/voice/hold-participant');
    const handlerFn = HoldParticipant.handler;
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
      hold: true,
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn(() => Promise.resolve());

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body.callSid).toBe(mockCallSid);
    };
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });

  it('holdParticipant thorws error', async () => {
    const HoldParticipant = require('../../../functions/voice/hold-participant');
    const handlerFn = HoldParticipant.handler;

    const mockEvent = {
      conference: 'mockTaskSid',
      participant: 'mockParticipantSid',
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn();

    const mockCallbackObject = jest.fn();
    await handlerFn({}, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
