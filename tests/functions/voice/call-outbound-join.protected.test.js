const helpers = require('../../test-utils/test-helper');

const context = {};

const setupLifeCycle = (context) => {
  beforeAll(() => {
    helpers.setup(context);
    global.Runtime._addFunction('twilio-wrappers/taskrouter', './functions/twilio-wrappers/taskrouter.private.js');
  });
  afterAll(() => {
    helpers.teardown();
  });
};

describe('Call Outbound Join', () => {
  setupLifeCycle(context);

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.resetModules();
    jest.unmock('../../../functions/twilio-wrappers/taskrouter.private.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const fetchCallMock = jest.fn(() =>
    Promise.resolve({
      to: 'client',
    }),
  );

  const fetchCallMockTwilioClient = function (fetchCall) {
    const mockfetchCallService = {
      fetch: fetchCall,
    };
    return {
      calls: (_callSid) => mockfetchCallService,
    };
  };
  it('join participant successfully', async () => {
    jest.mock('../../../functions/twilio-wrappers/taskrouter.private.js', () => {
      return {
        createTask: jest.fn(() =>
          Promise.resolve({
            task: {
              sid: 'TSxxxxxx',
            },
          }),
        ),
        fetchTask: jest.fn(() =>
          Promise.resolve({
            task: {
              attributes: {
                worker_call_sid: 'Cxxxxxxx',
                to: 'client',
                fromName: 'mockFrom',
                targetWorker: 'mockTargetWorker',
              },
            },
          }),
        ),
        updateTaskAttributes: jest.fn(() => Promise.resolve()),
      };
    });
    const TaskOperations = require(global.Runtime.getFunctions()['twilio-wrappers/taskrouter'].path);
    const callOutboundJoin = require('../../../functions/voice/call-outbound-join.protected').handler;
    const event = {
      StatusCallbackEvent: 'participant-join',
      ConferenceSid: 'CSxxxxxx',
      FriendlyName: 'mockName',
      CallSid: 'Cxxxxxxx',
    };
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => fetchCallMockTwilioClient(fetchCallMock),
    };

    await callOutboundJoin(mockContext, event, jest.fn());
    expect(fetchCallMock).toHaveBeenCalledTimes(1);
    expect(TaskOperations.fetchTask).toHaveBeenCalledWith({
      context: mockContext,
      taskSid: 'mockName',
      attempts: 0,
    });
    expect(TaskOperations.createTask).toHaveBeenCalledTimes(1);
    expect(TaskOperations.updateTaskAttributes).toHaveBeenCalledWith({
      context: mockContext,
      taskSid: 'mockName',
      attributesUpdate: JSON.stringify({
        conference: {
          sid: 'CSxxxxxx',
          participants: {
            worker: 'Cxxxxxxx',
            taskSid: 'TSxxxxxx',
          },
        },
      }),
      attempts: 0,
    });
  });

  it('end conference successfully', async () => {
    jest.mock('../../../functions/twilio-wrappers/taskrouter.private.js', () => {
      return {
        updateTask: jest.fn(() => Promise.resolve()),
        fetchTask: jest.fn(() =>
          Promise.resolve({
            task: {
              assignmentStatus: 'pending',
              attributes: {
                worker_call_sid: 'Cxxxxxxx',
                to: 'client',
                fromName: 'mockFrom',
                targetWorker: 'mockTargetWorker',
                conference: {
                  participants: {
                    taskSid: 'MTSxxxxx',
                  },
                },
              },
            },
          }),
        ),
      };
    });
    const TaskOperations = require(global.Runtime.getFunctions()['twilio-wrappers/taskrouter'].path);
    const callOutboundJoin = require('../../../functions/voice/call-outbound-join.protected').handler;
    const eventConf = {
      StatusCallbackEvent: 'conference-end',
      ConferenceSid: 'CSxxxxxx',
      FriendlyName: 'mockName',
      CallSid: 'Cxxxxxxx',
    };
    const mockContextConf = {
      PATH: 'mockPath',
      getTwilioClient: () => fetchCallMockTwilioClient(fetchCallMock),
    };

    await callOutboundJoin(mockContextConf, eventConf, jest.fn());
    expect(TaskOperations.fetchTask).toHaveBeenCalledTimes(2);
    expect(TaskOperations.updateTask).toHaveBeenCalledTimes(2);
  });
});
