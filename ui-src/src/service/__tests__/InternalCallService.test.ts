import InternalService from '../InternalCallService';
import * as Flex from '@twilio/flex-ui';
import { setServiceConfiguration } from '../../../test-utils/flex-service-configuration';
import fetch from 'jest-fetch-mock';

describe('holdParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await InternalService.holdParticipant('CFxxxxxx', 'PSxxxxxx');
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await InternalService.holdParticipant('CFxxxxxx', 'PSxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('unholdParticipant', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('adds participant to the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
    const response = await InternalService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
    expect(response).toBe('CSxxxxxx');
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      await InternalService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('rejectInternalTask', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('rejects an internal task successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));
    const payload = {
      // task: {
      sourceObject: {
        accept: jest.fn(),
      },
      wrapUp: jest.fn(),
      complete: jest.fn(),
      attributes: { conferenceSid: 'mockSid' },
      // },
    };
    const response = await InternalService.rejectInternalTask(payload);
    expect(response).toEqual({});
  });

  it('throws error when trying to add a participant to the conference', async () => {
    fetch.mockRejectOnce('Mock Error string');
    let err = null;
    try {
      const payload = {
        sourceObject: {
          accept: jest.fn(),
        },
        wrapUp: jest.fn(),
        complete: jest.fn(),
        attributes: { conferenceSid: 'mockSid' },
      };
      await InternalService.rejectInternalTask(payload);
    } catch (error) {
      err = error;
    }
    expect(err).toEqual('Mock Error string');
  });
});

describe('acceptInternalTask', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('rejects an internal task with conference successfully', async () => {
    const callMock = jest.fn();
    const mockTaskSid = 'TSxxxxxx';
    const reservation = {
      task: {
        attributes: {
          from: 'mockFrom',
          conference: {
            friendlyName: 'mockName',
          },
        },
      },
      call: callMock,
    };
    await InternalService.acceptInternalTask(reservation, mockTaskSid);
    expect(callMock).toHaveBeenCalled();
  });

  it('rejects an internal task without conference successfully', async () => {
    const callMock = jest.fn();
    const mockTaskSid = 'TSxxxxxx';
    const reservation = {
      task: {
        attributes: {
          from: 'mockFrom',
        },
      },
      call: callMock,
    };
    await InternalService.acceptInternalTask(reservation, mockTaskSid);
    expect(callMock).toHaveBeenCalled();
  });
});
