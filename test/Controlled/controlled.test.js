/* global jest, describe, it, expect */
import React from 'react';
import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
} from 'react-dom/test-utils';
import NumberInput from '../../src';
import StatefulParent from '../StatefulParent';

const noop = () => {};

describe('Controlled input', () => {
  it('Updates when new props are received', () => {
    const root = renderIntoDocument(
      <StatefulParent
        render={({ state }) => (
          <NumberInput value={state.value} onChange={noop} />
        )}
      />,
    );
    const input = findRenderedDOMComponentWithTag(root, 'input');

    /* component was not yet updated */
    expect(root.state.value).toBe('');
    expect(input.value).toBe('');

    /* pass new props to NumberInput */
    root.setState({ value: '123' });
    expect(input.value).toBe('123');
  });

  describe('Uses the onChange callback', () => {
    const spy = jest.fn();
    const fieldName = 'fieldName';
    const root = renderIntoDocument(
      <StatefulParent
        onChange={spy}
        render={({ props, state }) => (
          <NumberInput
            name={fieldName}
            value={state.value}
            onChange={props.onChange}
          />
        )}
      />,
    );

    const input = findRenderedDOMComponentWithTag(root, 'input');
    input.value = String('1');
    Simulate.change(input, {
      target: input,
    });

    it('Invokes the onChange callback on change event', () => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('Passes the input name and value as arguments', () => {
      expect(spy).toHaveBeenLastCalledWith(fieldName, '1');
    });
  });

  it("Doesn't update when props do not change", () => {
    const root = renderIntoDocument(
      <StatefulParent
        onChange={noop}
        render={({ props, state }) => (
          <NumberInput value={state.value} onChange={props.onChange} />
        )}
      />,
    );
    const input = findRenderedDOMComponentWithTag(root, 'input');
    input.value = '123';
    Simulate.change(input, {
      target: input,
    });

    expect(input.value).toBe('');
  });
});
