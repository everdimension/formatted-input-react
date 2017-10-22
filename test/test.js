/* global jest, describe, it, expect */
import React from 'react';
import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import NumberInput from '../src';

const noop = () => {};

describe('Rendering', () => {
  it('Renders a component of type "input"', () => {
    const component = renderer.create(
      <NumberInput name="test-input" value="" onChange={noop} />,
    );
    const tree = component.toJSON();
    expect(tree.type).toBe('input');
  });

  it('Renders a component with correct props', () => {
    const component = renderer.create(
      <NumberInput name="test-input" value="" onChange={noop} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree.props).toMatchSnapshot();
  });

  it('Passses arbitrary html props to rendered input', () => {
    const component = renderer.create(
      <NumberInput
        name="test-input"
        value=""
        data-attr="42"
        autocomplete="false"
        onChange={noop}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect('data-attr' in tree.props).toBe(true);
    expect('autocomplete' in tree.props).toBe(true);
  });
});

describe('Basic behavior', () => {
  describe('Passes updated value via onChange callback', () => {
    const spy = jest.fn();
    const fieldName = 'test-input';
    const expectedValue = '23';

    const root = renderIntoDocument(
      <NumberInput
        name={fieldName}
        value=""
        onChange={spy}
      />,
    );

    const input = findRenderedDOMComponentWithTag(root, 'input');
    input.value = String(expectedValue);
    Simulate.change(input, {
      target: input,
    });

    /**
     * spy.mock.calls represents all calls that have been made
     * into this mock function. Each call is represented by an array
     * of arguments that were passed during the call.
     * http://facebook.github.io/jest/docs/en/mock-function-api.html#mockfnmockcalls
     */
    it('passes name as the first argument value', () => {
      const firstCall = spy.mock.calls[0];
      expect(firstCall[0]).toBe(fieldName);
    });

    it('passes correct value as the second argument', () => {
      const firstCall = spy.mock.calls[0];
      expect(typeof firstCall[1]).toBe('string');
      expect(firstCall[1]).toBe(expectedValue);
    });
  });
});

describe('Process of initial data', () => {
  it('Parses initial props when possible', () => {
    const passedValue = '1234';
    const expectedValue = new Intl.NumberFormat('en').format(passedValue);

    const root = renderIntoDocument(
      <NumberInput
        value={passedValue}
        onChange={noop}
      />,
    );

    const input = findRenderedDOMComponentWithTag(root, 'input');

    expect(input.value).toBe(expectedValue);
  });
});
