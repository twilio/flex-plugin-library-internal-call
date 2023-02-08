const { merge, isString, isObject, isNumber } = require('lodash');

const { retryHandler } = require(Runtime.getFunctions()['twilio-wrappers/retry-handler'].path);

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.workflowSid the workflow to submit the task
 * @param {string} parameters.taskChannel the task channel to submit the task on
 * @param {object} parameters.attributes the attributes applied to the task
 * @param {number} parameters.priority the priority
 * @param {number} parameters.timeout timeout
 * @returns {object} an object containing the task if successful
 * @description creates a task
 */
exports.createTask = async function createTask(parameters) {
  const {
    context,
    workflowSid,
    taskChannel,
    attributes,
    priority: overriddenPriority,
    timeout: overriddenTimeout,
    attempts,
  } = parameters;

  if (!isNumber(attempts)) throw 'Invalid parameters object passed. Parameters must contain the number of attempts';
  if (!isObject(context)) throw 'Invalid parameters object passed. Parameters must contain context object';
  if (!isString(workflowSid) || workflowSid.length == 0)
    throw 'Invalid parameters object passed. Parameters must contain workflowSid string';
  if (!isString(taskChannel) || taskChannel.length == 0)
    throw 'Invalid parameters object passed. Parameters must contain taskChannel string';
  if (!isObject(attributes)) throw 'Invalid parameters object passed. Parameters must contain attributes object';

  const timeout = overriddenTimeout || 86400;
  const priority = overriddenPriority || 0;

  try {
    const client = context.getTwilioClient();
    const task = await client.taskrouter.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).tasks.create({
      attributes: JSON.stringify(attributes),
      workflowSid,
      taskChannel,
      priority,
      timeout,
    });

    return {
      success: true,
      taskSid: task.sid,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
      status: 200,
    };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to fetch
 * @returns {object} an object containing the task if successful
 * @description fetches the given task
 */
exports.fetchTask = async function fetchTask(parameters) {
  const { attempts, taskSid, context } = parameters;

  if (!isNumber(attempts)) throw 'Invalid parameters object passed. Parameters must contain the number of attempts';
  if (!isString(taskSid)) throw 'Invalid parameters object passed. Parameters must contain the taskSid string';
  if (!isObject(context)) throw 'Invalid parameters object passed. Parameters must contain reason context object';

  try {
    const client = context.getTwilioClient();

    const task = await client.taskrouter.workspaces(process.env.TWILIO_FLEX_WORKSPACE_SID).tasks(taskSid).fetch();

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    // 20001 error code is returned when the task is not in an assigned state
    // this can happen if its not been assigned at all or its been already closed
    // through another process; as a result assuming the latter and
    // treating as a success
    // https://www.twilio.com/docs/api/errors/20001
    // 20404 error code is returned when the task no longer exists
    // in which case it is also assumed to be completed
    // https://www.twilio.com/docs/api/errors/20404
    if (error.code === 20001 || error.code === 20404) {
      const { context } = parameters;
      console.warn(`${context.PATH}.${arguments.callee.name}(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return retryHandler(error, parameters, arguments.callee);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {string} parameters.taskSid the task to update
 * @param {string} parameters.attributesUpdate a JSON object to merge with the task
 * @returns {object} an object containing the task if successful
 * @description this operation safely updates the task attributes with the object
 * given by performing a deep merge with the existing task attributes and ensuring
 * its updating the version it started with using the ETag header
 * more explained here https://www.twilio.com/docs/taskrouter/api/task#task-version
 */
exports.updateTaskAttributes = async function updateTaskAttributes(parameters) {
  const { attempts, taskSid, attributesUpdate } = parameters;

  if (!isNumber(attempts)) throw 'Invalid parameters object passed. Parameters must contain the number of attempts';
  if (!isString(taskSid)) throw 'Invalid parameters object passed. Parameters must contain the taskSid string';
  if (!isString(attributesUpdate))
    throw 'Invalid parameters object passed. Parameters must contain attributesUpdate JSON string';

  try {
    const axios = require('axios');

    const taskContextURL = `https://taskrouter.twilio.com/v1/Workspaces/${process.env.TWILIO_FLEX_WORKSPACE_SID}/Tasks/${taskSid}`;
    let config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    // we need to fetch the task using a rest API because
    // we need to examine the headers to get the ETag
    const getResponse = await axios.get(taskContextURL, config);
    let task = getResponse.data;

    task.attributes = JSON.parse(getResponse.data.attributes);
    task.revision = JSON.parse(getResponse.headers.etag);

    // merge the objects
    let updatedTaskAttributes = merge({}, task.attributes, JSON.parse(attributesUpdate));

    // if-match the revision number to ensure
    // no update collisions
    config.headers = {
      'If-Match': task.revision,
      'content-type': 'application/x-www-form-urlencoded',
    };

    const data = new URLSearchParams({
      Attributes: JSON.stringify(updatedTaskAttributes),
    });

    task = (await axios.post(taskContextURL, data, config)).data;

    return {
      success: true,
      status: 200,
      task: {
        ...task,
        attributes: JSON.parse(task.attributes),
      },
    };
  } catch (error) {
    return retryHandler(error, parameters, arguments.callee);
  }
};
