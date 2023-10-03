import FlexTelemetry from '@twilio/flex-ui-telemetry';
import packageJSON from '../../package.json';

const flexManager = window?.Twilio?.Flex?.Manager?.getInstance();

export enum Event {
  INTERNAL_CALL_STARTED = 'Internal Call Start',
}

export const Analytics = new FlexTelemetry({
  source: 'flexui',
  role: packageJSON.name,
  plugin: packageJSON.name,
  pluginVersion: packageJSON.version,
  originalPluginName: packageJSON.id,
});
