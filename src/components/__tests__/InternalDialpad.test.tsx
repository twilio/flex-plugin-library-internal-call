import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import * as Flex from '@twilio/flex-ui';

import InternalDialpad from '../InternalDialpad/InternalDialpad';

describe('InternalDialpad', () => {
  it('should render correct snapshot', () => {
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const wrapper = render(<InternalDialpad manager={manager} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correct snapshot', () => {
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    const { getByTestId } = render(<InternalDialpad manager={manager} />);
    fireEvent.change(getByTestId('internal-call-agent-combo'), { target: { value: 2 } }
    expect(wrapper).toMatchSnapshot();
  });
});
