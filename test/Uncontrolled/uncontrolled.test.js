/* global describe, it, expect */
import React from 'react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
} from 'react-dom/test-utils';
import NumberInput from '../../src';
import StatefulParent from '../StatefulParent';

const noop = () => {};

describe('Uncontrolled NumberInput', () => {
  it("Doesn't update when new props are received", () => {
    const root = renderIntoDocument(
      <StatefulParent
        render={({ state }) => (
          <NumberInput defaultValue={state.value} onChange={noop} />
        )}
      />,
    );
    const input = findRenderedDOMComponentWithTag(root, 'input');

    /* component was not yet updated */
    expect(root.state.value).toBe('');
    expect(input.value).toBe('');

    /* pass new props to NumberInput */
    root.setState({ value: '123' });
    expect(input.value).toBe('');
  });
});
