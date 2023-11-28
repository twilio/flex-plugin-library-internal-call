const taskSid = 'TSxxxxxxxx';
const mockCallSid = 'CSxxxxxxxx';
const participantSid = 'PSxxxxxxxx';

jest.mock('@twilio/flex-plugins-library-utils', () => ({
  __esModule: true,
  ConferenceUtils: jest.fn(),
}));

import { ConferenceUtils } from '@twilio/flex-plugins-library-utils';

describe('holdParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('holdParticipant returns success response', async () => {
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
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await holdParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
  });

  it('holdParticipant returns error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        holdParticipant: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };
    const errParticipant = await holdParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('updateParticipant tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateParticipant returns success response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        updateParticipant: jest.fn(() =>
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
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const participant = await updateParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
  });

  it('updateParticipant return error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        updateParticipant: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };

    const context = {
      getTwilioClient: () => () => jest.fn(),
    };
    const errParticipant = await updateParticipant({ context, ...parameters });

    expect(errParticipant).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});

describe('fetchByTask tests from ConferenceParticipant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchByTask is called successfully', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        fetchConferencesByTask: jest.fn(() =>
          Promise.resolve({
            status: 200,
            conference: {},
            success: true,
          }),
        ),
      };
    });
    const { fetchByTask } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      status: '',
      limit: 1,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const task = await fetchByTask({ context, ...parameters });

    expect(task).toEqual({
      success: true,
      conference: {},
      status: 200,
    });
  });

  it('fetchByTask return error response', async () => {
    ConferenceUtils.mockImplementation((value) => {
      return {
        fetchConferencesByTask: jest.fn(() =>
          Promise.reject({
            success: false,
            status: 400,
            message: 'Mock Error Message',
          }),
        ),
      };
    });
    const { fetchByTask } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      status: '',
      limit: 1,
    };
    const context = {
      getTwilioClient: () => () => jest.fn(),
    };

    const errTask = await fetchByTask({ context, ...parameters });

    expect(errTask).toEqual({
      success: false,
      status: 400,
      message: 'Mock Error Message',
    });
  });
});
