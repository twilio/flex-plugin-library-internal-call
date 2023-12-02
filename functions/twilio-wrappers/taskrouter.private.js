const { TaskRouterUtils } = require('@twilio/flex-plugins-library-utils');

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
  const { context, workflowSid, taskChannel, attributes, priority, timeout, attempts } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    workflowSid,
    taskChannel,
    attributes: JSON.stringify(attributes),
    flexWorkSpaceSid: context.TWILIO_FLEX_WORKSPACE_SID,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const taskRouterClient = new TaskRouterUtils(client, config);

  try {
    const task = await taskRouterClient.createTask(config);

    return {
      success: task.success,
      taskSid: task.task.sid,
      task: {
        ...task.task,
        attributes: JSON.parse(task.task.attributes),
      },
      status: task.status,
    };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
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
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    taskSid,
    flexWorkSpaceSid: context.TWILIO_FLEX_WORKSPACE_SID,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const taskRouterClient = new TaskRouterUtils(client, config);

  try {
    const task = await taskRouterClient.fetchTask(config);
    return {
      success: task.success,
      status: task.status,
      task: {
        ...task.task,
        attributes: JSON.parse(task.task.attributes),
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
    if (error.status === 20001 || error.status === 20404) {
      const { context } = parameters;
      console.warn(`${context.PATH}.${arguments.callee.name}(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return { success: false, status: error.status, message: error.message };
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
  const { context, attempts, taskSid, attributesUpdate } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    taskSid,
    attributesUpdate,
    flexWorkSpaceSid: context.TWILIO_FLEX_WORKSPACE_SID,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const taskRouterClient = new TaskRouterUtils(client, config);

  try {
    const task = await taskRouterClient.updateTaskAttributes(config);

    return {
      success: task.success,
      status: task.status,
      task: {
        ...task.task,
        attributes: JSON.parse(task.task.attributes),
      },
    };
  } catch (error) {
    return { success: false, status: error.status, message: error.message };
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task to update
 * @param {object} parameters.updateParams parameters to update on the task
 * @returns {object} an object containing the task if successful
 * @description updates the given task with the given params
 */
exports.updateTask = async function updateTask(parameters) {
  const { attempts, taskSid, updateParams, context } = parameters;
  const region = context.TWILIO_REGION ? context.TWILIO_REGION.split('-')[0] : '';
  const config = {
    attempts: attempts || 3,
    taskSid,
    updateParams,
    flexWorkSpaceSid: context.TWILIO_FLEX_WORKSPACE_SID,
    accountSid: context.ACCOUNT_SID,
    authToken: context.AUTH_TOKEN,
    region,
  };

  const client = context.getTwilioClient();
  const taskRouterClient = new TaskRouterUtils(client, config);

  try {
    const task = await taskRouterClient.updateTask(config);

    return {
      success: task.success,
      status: task.status,
      task: {
        ...task.task,
        attributes: JSON.parse(task.task.attributes),
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
    if (error.status === 20001 || error.status === 20404) {
      const { context } = parameters;
      console.warn(`${context.PATH}.${arguments.callee.name}(): ${error.message}`);
      return {
        success: true,
        status: 200,
        message: error.message,
      };
    }
    return { success: false, status: error.status, message: error.message };
  }
};
