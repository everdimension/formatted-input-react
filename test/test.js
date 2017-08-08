import React from 'react';
import {
  Simulate,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
} from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import NumberInput from '../src';

describe('Rendering', () => {
  it('Renders a component of type "input"', () => {
    const component = renderer.create(
      <NumberInput
        name="test-input"
        value=""
      />
    );
    const tree = component.toJSON();
    expect(tree.type).toBe('input');
  });

  it('Renders a component with correct props', () => {
    const component = renderer.create(
      <NumberInput
        name="test-input"
        value=""
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree.props).toMatchSnapshot();
  });
});

describe('Behavior', () => {
  class TestingParentControlled extends React.Component {
    constructor() {
      super();
      this.state = { value: '' };
    }

    render() {
      return (
        <NumberInput
          value={this.state.value}
          onChange={() => {}}
        />
      );
    }
  }

  class TestingParentUncontrolled extends React.Component {
    constructor() {
      super();
      this.state = { value: '' };
    }

    render() {
      return (
        <NumberInput
          defaultValue={this.state.value}
          onChange={() => {}}
        />
      );
    }
  }

  describe('Passes updated value via onChange callback', () => {
    const recorder = {};
    const inputName = 'test-input';
    const expectedValue = '23';

    const root = renderIntoDocument(
      <NumberInput
        name={inputName}
        value=""
        onChange={(name, value) => (recorder[name] = value)}
      />
    );

    const input = findRenderedDOMComponentWithTag(root, 'input');
    input.value = String(expectedValue);
    Simulate.change(input, {
      target: input,
    });

    it('passes name as the first argument value', () => {
      expect(inputName in recorder).toBe(true);
    });

    it('passes correct value as the second argument', () => {
      expect(typeof recorder[inputName]).toBe('string');
      expect(recorder[inputName]).toBe(expectedValue);
    });
  });

  describe('Controlled input', () => {
    it('Updates when new props are received', () => {
      const root = renderIntoDocument(
        <TestingParentControlled />
      );
      const input = findRenderedDOMComponentWithTag(root, 'input');

      /* component was not yet updated */
      expect(root.state.value).toBe('');
      expect(input.value).toBe('');

      /* pass new props to NumberInput */
      root.setState({ value: '123' });
      expect(input.value).toBe('123');
    });
  });

  describe('Uncontrolled NumberInput', () => {
    it('Doesn\'t update when new props are received', () => {
      const root = renderIntoDocument(
        <TestingParentUncontrolled />
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
});
