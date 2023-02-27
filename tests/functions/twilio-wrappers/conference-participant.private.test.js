import { setup } from '../../test-utils/test-helper.js';

const mockTo = '+91xxxxxxxxxx';
const mockFrom = '+91xxxxxxxxxx';
const taskSid = 'TSxxxxxxxx';
const mockCallSid = 'CSxxxxxxxx';
const participantSid = 'PSxxxxxxxx';

describe('holdParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('holdParticipant returns success response', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    const participant = await holdParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
    expect(holdUpdateParticipant.mock.calls.length).toBe(1);
    expect(holdUpdateParticipant.mock.calls[0][0]).toStrictEqual({
      hold: true,
    });
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: true,
    };

    let err = null;
    try {
      await holdParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: 1,
      participant: participantSid,
      hold: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain conference string');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: 1,
      hold: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain participant string');
  });

  it('holdParticipant throws invalid parameters object passed', async () => {
    const { holdParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      hold: 1,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await holdParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain hold boolean');
  });
});

describe('updateParticipant tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const holdUpdateParticipant = jest.fn(() =>
    Promise.resolve({
      callSid: mockCallSid,
    }),
  );

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

  it('updateParticipant returns success response', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    const participant = await updateParticipant({ context, ...parameters });

    expect(participant).toEqual({
      success: true,
      callSid: mockCallSid,
      status: 200,
    });
    expect(holdUpdateParticipant.mock.calls.length).toBe(1);
    expect(holdUpdateParticipant.mock.calls[0][0]).toStrictEqual({
      endConferenceOnExit: true,
    });
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: true,
    };

    let err = null;
    try {
      await updateParticipant({ ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain reason context object');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: 1,
      participant: participantSid,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain conference string');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: 1,
      endConferenceOnExit: true,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain participant string');
  });

  it('updateParticipant throws invalid parameters object passed', async () => {
    const { updateParticipant } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      conference: taskSid,
      participant: participantSid,
      endConferenceOnExit: 1,
    };
    const context = {
      getTwilioClient: () => getHolUpdateParticipantMockTwilioClient(holdUpdateParticipant),
    };

    let err = null;
    try {
      await updateParticipant({ context, ...parameters });
    } catch (error) {
      err = error;
    }

    expect(err).toBe('Invalid parameters object passed. Parameters must contain endConferenceOnExit boolean');
  });
});

describe('fetchByTask tests from ConferenceParticipant', () => {
  beforeAll(() => {
    setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  const fetchByTaskMock = jest.fn(() => Promise.resolve({}));

  const getFetchByTaskMockTwilioClient = function (fetchTaskMock) {
    return {
      conferences: {
        list: fetchTaskMock,
      },
    };
  };

  it('fetchByTask is called successfully', async () => {
    const { fetchByTask } = require('../../../functions/twilio-wrappers/conference-participant.private');
    const parameters = {
      taskSid,
      status: '',
      limit: 1,
    };
    const context = {
      getTwilioClient: () => getFetchByTaskMockTwilioClient(fetchByTaskMock),
    };

    const task = await fetchByTask({ context, ...parameters });

    expect(task).toEqual({
      success: true,
      conferences: {},
      status: 200,
    });
    expect(fetchByTaskMock.mock.calls.length).toBe(1);
    expect(fetchByTaskMock.mock.calls[0][0]).toStrictEqual({
      friendlyName: 'TSxxxxxxxx',
      limit: 1,
      status: '',
    });
  });
});
