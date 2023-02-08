import * as Flex from '@twilio/flex-ui';
import suppressConferenceErrorNotification from '../InternalCall';

describe('InternalCall notification', () => {
  let flex: typeof Flex = Flex;
  let manager: Flex.Manager = Flex.Manager.getInstance();
  (manager.store.getState as unknown as jest.Mock).mockReturnValue({
    flex: {
      worker: {
        tasks: [
          {
            attributes: {
              client_call: true,
            },
          },
        ],
      },
    },
  });
  let listener = Function;
  const notification: Flex.Notification = {
    id: 'FailedToFetchParticipants',
  };
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  beforeAll(() => {
    jest.spyOn(Flex.Notifications, 'addListener').mockImplementation((event, cb) => {
      if (event === 'beforeAddNotification') {
        listener = cb;
      }

      return Flex.Notifications;
    });
  });

  it('adds beforeAddNotification listener', () => {
    const listenerSpy = jest.spyOn(Flex.Notifications, 'addListener');
    suppressConferenceErrorNotification(flex, manager);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should call beforeAddNotification listener', async () => {
    const cancelCb = jest.fn();
    suppressConferenceErrorNotification(flex, manager);
    const clonedNotification = { ...notification };
    listener(clonedNotification, cancelCb);
    expect(cancelCb).toHaveBeenCalled();
  });
});
