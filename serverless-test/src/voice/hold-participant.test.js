import helpers from '../../test-utils/test-helper';

// functions/helpers/prepare-function.private.js
jest.mock('../../../serverless/src/functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

const mockCallSid = 'CSxxxxx';
describe('Hold Participant', () => {
  const getHolUpdateParticipantMockTwilioClient = function (holdParticipant) {
    const mockConferenceService = {
      participants: (_partSid) => ({
        update: holdParticipant,
      }),
    };
    return {
      conferences: (_taskSid) => mockConferenceService,
    };
  };
  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'helpers/prepare-function',
      './serverless/src/functions/helpers/prepare-function.private.js',
    );
    global.Runtime._addFunction(
      'helpers/parameter-validator',
      './serverless/src/functions/helpers/parameter-validator.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './serverless/src/functions/twilio-wrappers/conference-participant.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './serverless/src/functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('holdParticipant is called successfully ', async () => {
    const HoldParticipant = require('../../../serverless/src/functions/voice/hold-participant');
    const handlerFn = HoldParticipant.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
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
    const HoldParticipant = require('../../../serverless/src/functions/voice/hold-participant');
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
