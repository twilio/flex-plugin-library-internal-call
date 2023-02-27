const helpers = require('../../test-utils/test-helper');
const agentOutboundJoin = require('../../../functions/voice/agent-outbound-join.protected').handler;
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
    taskSid: 'mockTaskSid',
  };

  setupLifeCycle(context);

  it('returns a VoiceResponse', (done) => {
    const callback = (_err, result) => {
      expect(result).toBeInstanceOf(Twilio.twiml.VoiceResponse);
      done();
    };

    agentOutboundJoin(context, event, callback);
  });

  it('returns a twiml call', (done) => {
    const callback = (_err, result) => {
      const xml = result.toString();
      expect(xml).toBe(
        '<?xml version="1.0" encoding="UTF-8"?><Response><Dial><Conference statusCallback="call-outbound-join" statusCallbackEvent="join end" endConferenceOnExit="true">mockTaskSid</Conference></Dial></Response>',
      );
      done();
    };

    agentOutboundJoin(context, event, callback);
  });
});
