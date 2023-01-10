import * as Flex from '@twilio/flex-ui';

// Export the template names as an enum for better maintainability when accessing them elsewhere
export enum StringTemplates {
  ExternalTransferFailedHangupNotification = 'PSConferenceFailedHangupNotification',
}

const customStrings = {
  [StringTemplates.ExternalTransferFailedHangupNotification]:
    'Hangup call abandoned: Failed to take all participants off hold while hanging up the call. If this issue persists, please try unholding participants manually before leaving the call',
};

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    ...customStrings,
    ...manager.strings,
  } as any;
};
