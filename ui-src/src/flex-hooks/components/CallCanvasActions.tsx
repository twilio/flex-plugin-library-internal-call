import * as Flex from '@twilio/flex-ui';

export function removeDirectoryFromInternalCalls(flex: typeof Flex) {
  const isInternalCall = (props: any) => props.task.attributes.client_call === true;
  flex.CallCanvasActions.Content.remove('directory', { if: isInternalCall });
}
