const { ConferenceUtils } =  require('@twilio/flex-plugins-library-utils');

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.hold whether to hold or unhold the participant
 * @returns {Participant} The newly updated conference participant
 * @description holds or unholds the given conference participant
 */
exports.holdParticipant = async (parameters) => {
  const { context, conference, participant, hold } = parameters;

  const config = {
    attempts: 3,
    conferenceSid: conference,
    participantSid: participant,
    hold,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.holdParticipant(config);
    return { success: true, callSid: participants.participantsResponse.callSid, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.endConferenceOnExit whether to end conference when the participant leaves
 * @returns {Participant} The newly updated conference participant
 * @description sets endConferenceOnExit on the given conference participant
 */
exports.updateParticipant = async (parameters) => {
  const { context, conference, participant, endConferenceOnExit } = parameters;

  const config = {
    attempts: 3,
    conferenceSid: conference,
    participantSid: participant,
    endConferenceOnExit,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const participants = await conferenceClient.updateParticipant(config);
    return { success: true, callSid: participants.participantsResponse.callSid, status: 200 };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task SID to fetch conferences for
 * @param {string} parameters.status the status of conference(s) to fetch
 * @param {number} parameters.limit the maximum number of conferences to retrieve
 * @returns {Conference[]} The fetched conference(s)
 * @description fetches conferences matching the given task SID and status
 */
exports.fetchByTask = async (parameters) => {
  const { context, taskSid, status, limit } = parameters;

  const config = {
    attempts: 3,
    taskSid,
    status,
    limit,
  };

  const client = context.getTwilioClient();
  const conferenceClient = new ConferenceUtils(client, config);
  try {
    const conferences = await conferenceClient.fetchConferencesByTask(config);
    return { ...conferences };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};
