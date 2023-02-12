import helpers from '../../test-utils/test-helper';

jest.mock('../../../functions/helpers/prepare-function.private.js', () => ({
  __esModule: true,
  prepareFlexFunction: (_, fn) => fn,
}));

const mockConfUpdate = jest.fn(() => Promise.resolve({}));
const mockConfFetch = jest.fn(() =>
  Promise.resolve({ success: true, conferences: [{ sid: 'CSxxxxxx' }], status: 200 }),
);
jest.mock('../../../functions/twilio-wrappers/conference-participant.private.js', () => ({
  __esModule: true,
  updateConference: mockConfUpdate,
  fetchByTask: mockConfFetch,
}));

const mockCallSid = 'CSxxxxx';
describe('Remove Participant', () => {
  const fetchByTaskMock = jest.fn(() => Promise.resolve({ conferences: [{ sid: 'CSxxxxxx' }] }));

  const getFetchByTaskMockTwilioClient = function (fetchTaskMock) {
    return {
      conferences: {
        list: fetchTaskMock,
      },
    };
  };
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/conference-participant',
      './functions/twilio-wrappers/conference-participant.private.js',
    );
  });

  it('CleanUpTask is called successfully ', async () => {
    const CleanUp = require('../../../functions/voice/cleanup-rejected-task');
    const handlerFn = CleanUp.handler;
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getFetchByTaskMockTwilioClient(fetchByTaskMock),
    };
    const mockEvent = {
      taskSid: 'mockTaskSid',
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn(() => Promise.resolve());

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body).toBe({});
    };
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });
});
