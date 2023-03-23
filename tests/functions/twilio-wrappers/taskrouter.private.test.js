import helpers from '../../test-utils/test-helper';
import axios from 'axios';

describe('taskrouter.createTask', () => {
  const mockCreateTaskFn = jest.fn(() =>
    Promise.resolve({
      sid: 'TSxxxxxx',
      attributes: '{}',
    }),
  );
  const taskRouterTwilioClient = function (updateFunc) {
    const getWorkspace = (workspaceSid) => ({
      sid: workspaceSid,
      tasks: {
        create: updateFunc,
      },
    });

    const mockTaskRouterService = {
      workspaces: getWorkspace,
    };
    return {
      taskrouter: mockTaskRouterService,
    };
  };

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('createTask gives success', async () => {
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(mockCreateTaskFn),
    };
    const payload = {
      context: mockContext,
      workflowSid: '123',
      taskChannel: '87678',
      priority: 1,
      timeout: 898,
      attributes: {},
      attempts: 0,
    };

    const task = await createTask({ ...payload });

    expect(task).toEqual({
      success: true,
      taskSid: 'TSxxxxxx',
      task: { sid: 'TSxxxxxx', attributes: {} },
      status: 200,
    });
    expect(mockCreateTaskFn.mock.calls.length).toBe(1);
    expect(mockCreateTaskFn.mock.calls[0][0]).toStrictEqual({
      attributes: '{}',
      workflowSid: '123',
      taskChannel: '87678',
      priority: 1,
      timeout: 898,
    });
  });

  it('createTask gives error due to invalid taskChannel', async () => {
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      workflowSid: '123',
      taskChannel: 87678,
      priority: {
        overriddenPriority: 1,
      },
      timeOut: { overriddenTimeout: 898 },
      attributes: {},
      attempts: 0,
    };
    await createTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain taskChannel string');
    });
  });
  it('createTask gives error due to invalid attributes', async () => {
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      workflowSid: '123',
      taskChannel: '87678',
      priority: {
        overriddenPriority: 1,
      },
      timeOut: { overriddenTimeout: 898 },
      attributes: '',
      attempts: 0,
    };
    await createTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain attributes object');
    });
  });
});

describe('taskrouter.fetchTask', () => {
  const mockFetchTaskFn = jest.fn(() =>
    Promise.resolve({
      sid: 'TSxxxxxx',
      attributes: '{}',
    }),
  );
  const taskRouterTwilioClient = function (fetchFunc) {
    const getWorkspace = (workspaceSid) => ({
      sid: workspaceSid,
      tasks: (_taskSid) => ({
        fetch: fetchFunc,
      }),
    });

    const mockTaskRouterService = {
      workspaces: getWorkspace,
    };
    return {
      taskrouter: mockTaskRouterService,
    };
  };

  beforeAll(() => {
    helpers.setup();

    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('fetchTask gives success', async () => {
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(mockFetchTaskFn),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      attempts: 0,
    };

    const task = await fetchTask({ ...payload });

    expect(task).toEqual({
      success: true,
      task: { sid: 'TSxxxxxx', attributes: {} },
      status: 200,
    });
    expect(mockFetchTaskFn.mock.calls.length).toBe(1);
  });

  it('fetchTask gives error due to invalid attempts', async () => {
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      context: mockContext,
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      taskSid: 'TSxxxxxx',
      attempts: '0',
    };
    await fetchTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts');
    });
  });

  it('fetchTask gives error due to invalid taskSid', async () => {
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      taskSid: 123,
      attempts: 0,
    };
    await fetchTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the taskSid string');
    });
  });

  it('fetchTask gives error due to invalid context', async () => {
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const payload = {
      context: 'mockContext',
      taskSid: '123',
      attempts: 0,
    };
    await fetchTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain reason context object');
    });
  });
});

describe('taskrouter.updateTaskAttributes', () => {
  jest.mock('axios', () => ({
    post: jest.fn((_url, _body) => {
      return new Promise((resolve) => {
        resolve({
          data: {
            attributes: '{"attr1": "mockValue","attr2": "mockValue"}',
          },
        });
      });
    }),
    get: jest.fn((_url, _body) => {
      return new Promise((resolve) => {
        resolve({ data: { attributes: '{ "attr1": "mockValue" }' }, headers: { etag: '{"attr1":"value1"}' } });
      });
    }),
  }));
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('updateTaskAttributes gives success', async () => {
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');
    const payload = {
      attributesUpdate: '{"attr2": "mockValue"}',
      taskSid: 'TSxxxxxx',
      attempts: 0,
      context: {}
    };

    const task = await updateTaskAttributes({ ...payload });

    expect(task).toEqual({
      success: true,
      status: 200,
      task: { attributes: { attr1: 'mockValue', attr2: 'mockValue' } },
    });
  });

  it('updateTaskAttributes gives error due to invalid attempts', async () => {
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');
    const payload = {
      attributesUpdate: '{"attr2": "mockValue"}',
      taskSid: 'TSxxxxxx',
      attempts: '0',
    };
    await updateTaskAttributes({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts');
    });
  });

  it('updateTaskAttributes gives error due to invalid taskSid', async () => {
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');
    const payload = {
      attributesUpdate: '{"attr2": "mockValue"}',
      taskSid: 123,
      attempts: 0,
    };
    await updateTaskAttributes({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the taskSid string');
    });
  });

  it('updateTaskAttributes gives error due to invalid attributesUpdate', async () => {
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const payload = {
      attributesUpdate: { attr2: 'mockValue' },
      taskSid: '123',
      attempts: 0,
    };
    await updateTaskAttributes({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain attributesUpdate JSON string');
    });
  });
});

describe('taskrouter.updateTask', () => {
  const mockUpdateTaskFn = jest.fn(() =>
    Promise.resolve({
      sid: 'TSxxxxxx',
      attributes: '{}',
    }),
  );
  const taskRouterTwilioClient = function (updateFunc) {
    const getWorkspace = (workspaceSid) => ({
      sid: workspaceSid,
      tasks: (_taskSid) => ({
        update: updateFunc,
      }),
    });

    const mockTaskRouterService = {
      workspaces: getWorkspace,
    };
    return {
      taskrouter: mockTaskRouterService,
    };
  };

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('updateTask gives success', async () => {
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(mockUpdateTaskFn),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      updateParams: {},
      attempts: 0,
    };

    const task = await updateTask({ ...payload });

    expect(task).toEqual({
      success: true,
      status: 200,
      task: { sid: 'TSxxxxxx', attributes: {} },
    });
    expect(mockUpdateTaskFn.mock.calls.length).toBe(1);
    expect(mockUpdateTaskFn.mock.calls[0][0]).toStrictEqual({});
  });

  it('updateTask gives error due to invalid attempts', async () => {
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      updateParams: {},
      attempts: '0',
    };
    await updateTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts');
    });
  });
  it('updateTask gives error due to invalid taskSid', async () => {
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      taskSid: 12345,
      updateParams: {},
      attempts: 0,
    };
    await updateTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the taskSid string');
    });
  });
  it('updateTask gives error due to invalid updateParams', async () => {
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => taskRouterTwilioClient(updateFunc),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      updateParams: '{}',
      attempts: 0,
    };
    await updateTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain updateParams object');
    });
  });
  it('updateTask gives error due to invalid context', async () => {
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const payload = {
      context: '',
      taskSid: 'TSxxxxxx',
      updateParams: {},
      attempts: 0,
    };
    await updateTask({ ...payload }).catch((err) => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain reason context object');
    });
  });
});
