# Your custom Twilio Flex Plugin

Twilio Flex Plugins allow you to customize the appearance and behavior of [Twilio Flex](https://www.twilio.com/flex). If you want to learn more about the capabilities and how to use the API, check out our [Flex documentation](https://www.twilio.com/docs/flex).

## Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com). We support Node >= 10.12 (and recommend the _even_ versions of Node). Afterwards, install the dependencies by running `npm install`:

```bash
cd

# If you use npm
npm install
```

Next, please install the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) by running:

```bash
brew tap twilio/brew && brew install twilio
```

Finally, install the [Flex Plugin extension](https://github.com/twilio-labs/plugin-flex/tree/v1-beta) for the Twilio CLI:

```bash
twilio plugins:install @twilio-labs/plugin-flex
```

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

# conference

When in a call, a "plus" icon is added to the call canvas where you can add an external number to the call.

This feature is based on [the dialpad addon plugin](https://github.com/twilio-professional-services/flex-dialpad-addon-plugin).

# flex-user-experience

![Conference demo](screenshots/conference.gif)

# setup and dependencies

## Outbound Call Configuration

When conferencing in an external party, the default outbound call settings are used for caller ID. If this has not yet been configured, you will encounter errors. This can be updated in the Twilio Console > Flex > Manage > Voice, or by using the Flex Configuration API:

```
POST https://flex-api.twilio.com/v1/Configuration
Authorization: Basic {base64-encoded Twilio Account SID : Auth Token}
Content-Type: application/json

{
  "account_sid": "Enter your Twilio Account SID here",
  "outbound_call_flows": {
    "default": {
      "workflow_sid": "WWxxxc",
      "enabled": true,
      "queue_sid": "WQxxx",
      "caller_id": "+1xxx",
      "location": "US"
    }
  },
}
```

## TaskRouter

In the `serverless-functions/.env` file, be sure to set `TWILIO_FLEX_WORKSPACE_SID` if it has not been already.

# how does it work?

This action executes a Twilio Function that uses the Twilio API to make a call and add this call to the current conference. In the Flex UI side, the participant is added manually and both hold/unhold and hangup buttons are available.

An invisible component is mounted to track participant state and set `endConferenceOnExit` appropriately to allow for external transfer functionality -- the agent can leave the call while the remaining conference participants continue to communicate. If there are two parties remaining, the call will automatically end when one of them hangs up.
