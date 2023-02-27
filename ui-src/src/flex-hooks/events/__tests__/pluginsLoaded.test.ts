import { FlexEvent } from '../../../types/FlexEvent';
import pluginsLoadedHandler from '../pluginsLoaded';

describe('plugins loaded', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  it('check plugins loaded', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    pluginsLoadedHandler({} as unknown as FlexEvent);
    expect(consoleLogSpy).toHaveBeenCalledWith('Feature enabled: conference');
  });
});
