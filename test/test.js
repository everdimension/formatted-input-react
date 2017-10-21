/* global describe, it, expect */
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
    const recorder = {};
    const fieldName = 'test-input';
    const expectedValue = '23';

    const root = renderIntoDocument(
      <NumberInput
        name={fieldName}
        value=""
        onChange={(name, value) => {
          recorder[name] = value;
        }}
      />,
    );

    const input = findRenderedDOMComponentWithTag(root, 'input');
    input.value = String(expectedValue);
    Simulate.change(input, {
      target: input,
    });

    it('passes name as the first argument value', () => {
      expect(fieldName in recorder).toBe(true);
    });

    it('passes correct value as the second argument', () => {
      expect(typeof recorder[fieldName]).toBe('string');
      expect(recorder[fieldName]).toBe(expectedValue);
    });
  });
});
