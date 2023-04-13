## Details

#### Prerequisites
Flex Dialpad should be enabled in voice configuration for this plugin to work. Please refer to the screenshot below. Visit [Twilio Console](https://console.stage.twilio.com/us1/develop/flex/manage/voice) to set up voice.

![Dialpad configuration](https://raw.githubusercontent.com/twilio/flex-plugin-library-internal-call/main/screenshots/dialpad.png)

#### How it works
Plugin is ready to use once it is installed and the browser window is refreshed.
- A search and select component is added to the Flex Dialpad on the right.
- Another agent needs to be in "Available" status, in order to be selectable.
- Once they are selected, the call is connected with that agent.

#### Installation
During installation, 2 fields are required:

1. *TaskRouter Workspace SID*: This is the SID of the "Flex Task Assignment" workspace that you see in [Twilio Console > TaskRouter > Workspaces](https://console.stage.twilio.com/us1/develop/taskrouter/workspaces). Please refer screenshot below:

![Workspace SID configuration](https://raw.githubusercontent.com/twilio/flex-plugin-library-internal-call/main/screenshots/taskrouter.png)

2. *TaskRouter Internal Call Workflow SID*: You may want to create a new TaskRouter workflow for internal call or use the default workflow in [Twilio Console > TaskRouter > Workspaces > Flex Task Assignment](https://console.stage.twilio.com/us1/develop/taskrouter/workspaces) > Workflows > Assign to Anyone and get its SID after adding the following filter to it (refer screenshot below):
-   ensure the following matching worker expression:  _task.targetWorker==worker.contact_uri_
-   ensure the priority of the filter is set to 1000 (or at least the highest in the system)
-   make sure the filter matches a queue with Everyone on it. The default Everyone queue will work but if you want to separate real time reporting for outbound calls, you should make a dedicated queue for it with a queue expression  _1==1_
![Outbound Filter Configuration](https://github.com/twilio/flex-plugin-library-internal-call/raw/main/screenshots/outbound-filter.png)
