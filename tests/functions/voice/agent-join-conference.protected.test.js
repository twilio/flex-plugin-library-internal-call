const helpers = require('../../test-utils/test-helper');
const agentJoin = require('../../../functions/voice/agent-join-conference.protected').handler;
const Twilio = require('twilio');

const context = {};

const setupLifeCycle = (context) => {
  beforeAll(() => {
    helpers.setup(context);
  });
  afterAll(() => {
    helpers.teardown();
  });
};

describe('a completed conference', () => {
  const event = {
    conferenceName: 'mockConferenceName',
  };

  setupLifeCycle(context);

  it('returns a VoiceResponse', (done) => {
    const callback = (_err, result) => {
      expect(result).toBeInstanceOf(Twilio.twiml.VoiceResponse);
      done();
    };

    agentJoin(context, event, callback);
  });

  it('returns a twiml call', (done) => {
    const callback = (_err, result) => {
      const xml = result.toString();
      expect(xml).toBe(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Conference endConferenceOnExit="true">mockConferenceName</Conference></Dial></Response>',
      );
      done();
    };

    agentJoin(context, event, callback);
  });
});
