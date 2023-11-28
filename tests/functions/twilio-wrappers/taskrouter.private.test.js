jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  TaskRouterUtils: jest.fn(),
}));

import { TaskRouterUtils } from '@twilio/flex-plugins-library-utils';

describe('taskrouter.createTask', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('createTask gives success', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        createTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              sid: 'TSxxxxxx',
              attributes: '{}',
            },
            success: true,
          }),
        ),
      };
    });
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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
  });

  it('createTask gives error', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        createTask: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { createTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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

    const errTask = await createTask({ ...payload });

    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('taskrouter.fetchTask', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchTask gives success', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        fetchTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              sid: 'TSxxxxxx',
              attributes: '{}',
            },
            success: true,
          }),
        ),
      };
    });
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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
  });

  it('fetchTask gives error', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        fetchTask: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { fetchTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      attempts: '0',
    };

    const errTask = await fetchTask({ ...payload });

    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('taskrouter.updateTaskAttributes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('updateTaskAttributes gives success', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        updateTaskAttributes: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              attributes: '{ "attr1": "mockValue", "attr2": "mockValue" }',
            },
            success: true,
          }),
        ),
      };
    });
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      attributesUpdate: { attr1: 'mockValue', attr2: 'mockValue' },
      taskSid: 'TSxxxxxx',
      attempts: 0,
    };

    const task = await updateTaskAttributes({ ...payload });

    expect(task).toEqual({
      success: true,
      status: 200,
      task: { attributes: { attr1: 'mockValue', attr2: 'mockValue' } },
    });
  });

  it('updateTaskAttributes gives error', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        updateTaskAttributes: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { updateTaskAttributes } = require('../../../functions/twilio-wrappers/taskrouter.private');
    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      attributesUpdate: '{}',
      taskSid: 'TSxxxxxx',
      attempts: '0',
    };

    const errTask = await updateTaskAttributes({ ...payload });

    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('taskrouter.updateTask', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('updateTask gives success', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        updateTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            task: {
              sid: 'TSxxxxxx',
              attributes: '{}',
            },
            success: true,
          }),
        ),
      };
    });
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
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
  });

  it('updateTask gives error', async () => {
    TaskRouterUtils.mockImplementation((value) => {
      return {
        updateTask: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { updateTask } = require('../../../functions/twilio-wrappers/taskrouter.private');

    const mockContext = {
      getTwilioClient: () => () => jest.fn(),
    };
    const payload = {
      context: mockContext,
      taskSid: 'TSxxxxxx',
      updateParams: {},
      attempts: '0',
    };
    const errTask = await updateTask({ ...payload });
    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});
