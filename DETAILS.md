## Details

### Overview

This feature adds a new "Call Agent" section to the outbound dialpad allowing an agent to directly call another agent. In this section, there is an autocomplete dropdown where you can select the agent you want to call.

### TaskRouter

Before using this plugin you must first create a dedicated TaskRouter workflow or just add the following filter to your current workflow. Make sure it is part of your Flex Task Assignment workspace.

- ensure the following matching worker expression: _task.targetWorker==worker.contact_uri_
- ensure the priority of the filter is set to 1000 (or at least the highest in the system)
- make sure the filter matches to a queue with Everyone on it. The default Everyone queue will work but if you want to seperate real time reporting for outbound calls, you should make a dedicated queue for it with a queue expression _1==1_

![Workflow filter configuration](screenshots/outbound-filter.png)

During installation, be sure to set `TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID` to the SID of the workflow configured above (and set `TWILIO_FLEX_WORKSPACE_SID` if it has not been already).
