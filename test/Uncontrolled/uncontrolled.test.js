/* global describe, it, expect */
import React from 'react';
import {
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
} from 'react-dom/test-utils';
import FormattingInput from '../../src';
import { StatefulParent } from '../StatefulParent';
import { createMask } from '../createMask';

const noop = () => {};

describe('Uncontrolled FormattingInput', () => {
  it("Doesn't update when new props are received", () => {
    const root = renderIntoDocument(
      <StatefulParent
        render={({ state }) => (
          <FormattingInput
            defaultValue={state.value}
            onChange={noop}
            mask={createMask}
          />
        )}
      />,
    );
    const input = findRenderedDOMComponentWithTag(root, 'input');

    /* component was not yet updated */
    expect(root.state.value).toBe('');
    expect(input.value).toBe('');

    /* pass new props to FormattingInput */
    root.setState({ value: '123' });
    expect(input.value).toBe('');
  });
});
