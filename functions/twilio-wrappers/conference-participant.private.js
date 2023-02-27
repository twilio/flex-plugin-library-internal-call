const { isString, isObject, isNumber, isBoolean } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['twilio-wrappers/retry-handler'].path).retryHandler;

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

  if (!isObject(context)) throw 'Invalid parameters object passed. Parameters must contain reason context object';
  if (!isString(conference)) throw 'Invalid parameters object passed. Parameters must contain conference string';
  if (!isString(participant)) throw 'Invalid parameters object passed. Parameters must contain participant string';
  if (!isBoolean(hold)) throw 'Invalid parameters object passed. Parameters must contain hold boolean';

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).update({
      hold,
    });

    return { success: true, callSid: participantsResponse.callSid, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
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

  if (!isObject(context)) throw 'Invalid parameters object passed. Parameters must contain reason context object';
  if (!isString(conference)) throw 'Invalid parameters object passed. Parameters must contain conference string';
  if (!isString(participant)) throw 'Invalid parameters object passed. Parameters must contain participant string';
  if (!isBoolean(endConferenceOnExit))
    throw 'Invalid parameters object passed. Parameters must contain endConferenceOnExit boolean';

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).update({
      endConferenceOnExit,
    });

    return { success: true, callSid: participantsResponse.callSid, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
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

  if (!isObject(context)) throw 'Invalid parameters object passed. Parameters must contain reason context object';
  if (!isString(taskSid)) throw 'Invalid parameters object passed. Parameters must contain taskSid string';
  if (!isString(status)) throw 'Invalid parameters object passed. Parameters must contain status string';
  if (!isNumber(limit)) throw 'Invalid parameters object passed. Parameters must contain limit number';

  try {
    const client = context.getTwilioClient();

    const conferences = await client.conferences.list({
      friendlyName: taskSid,
      status,
      limit,
    });

    return { success: true, conferences, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
