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

describe('Basic behavior', () => {
  const inputName = 'behavior-input';
  class TestingParentControlled extends React.Component {
    constructor() {
      super();
      this.state = { value: '' };
    }

    render() {
      return (
        <NumberInput
          name={inputName}
          value={this.state.value}
          onChange={this.props.onChange}
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
          onChange={this.props.onChange}
        />
      );
    }
  }

  describe('Passes updated value via onChange callback', () => {
    const recorder = {};
    const name = 'test-input';
    const expectedValue = '23';

    const root = renderIntoDocument(
      <NumberInput
        name={name}
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
      expect(name in recorder).toBe(true);
    });

    it('passes correct value as the second argument', () => {
      expect(typeof recorder[name]).toBe('string');
      expect(recorder[name]).toBe(expectedValue);
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

    describe('Uses the onChange callback', () => {
      const spy = jest.fn();
      const root = renderIntoDocument(
        <TestingParentControlled
          onChange={spy}
        />
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
        expect(spy).toHaveBeenLastCalledWith(inputName, '1');
      });
    });

    it('Doesn\'t update when props do not change', () => {
      const root = renderIntoDocument(
        <TestingParentControlled
          onChange={() => {}}
        />
      );
      const input = findRenderedDOMComponentWithTag(root, 'input');
      input.value = '123';
      Simulate.change(input, {
        target: input,
      });

      expect(input.value).toBe('');
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
