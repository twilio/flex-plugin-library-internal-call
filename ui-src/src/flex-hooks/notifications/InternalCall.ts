import * as Flex from '@twilio/flex-ui';
import { StringTemplates } from '../strings/InternalCall';

// Export the notification IDs an enum for better maintainability when accessing them elsewhere
export enum InternalCallNotification {
  FailedToFetchParticipants = 'FailedToFetchParticipants',
  ErrorInternalCall = 'ErrorInternalCall',
}

export default (flex: typeof Flex, manager: Flex.Manager) => {
  suppressConferenceErrorNotification(flex, manager);
  errorNotification(flex, manager);
};

function errorNotification(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.registerNotification({
    id: InternalCallNotification.ErrorInternalCall,
    type: Flex.NotificationType.error,
    content: StringTemplates.ErrorInternalCall,
  });
}

function suppressConferenceErrorNotification(flex: typeof Flex, manager: Flex.Manager) {
  flex.Notifications.addListener('beforeAddNotification', (notification, cancel) => {
    // When on an internal call, Flex is not aware of the conference state, and will throw an error saying such.
    // Here we suppress the error only when on an internal call, to improve user experience.

    if (notification.id === InternalCallNotification.FailedToFetchParticipants) {
      let onInternalCall = false;
      manager.store.getState().flex.worker.tasks.forEach((task) => {
        if (task.attributes && (task.attributes as any).client_call === true) {
          onInternalCall = true;
        }
      });

      if (onInternalCall) {
        console.log('Suppressing conference error notification for internal call');
        cancel();
      }
    }
  });
}
