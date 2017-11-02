import React from 'react';
import PropTypes from 'prop-types';
import {
  createTextMaskInputElement,
  conformToMask,
  adjustCaretPosition,
} from 'text-mask-core';
import omit from './utils/omit';
import getCursorPosition from './utils/getCursorPosition';
import setCursorPosition from './utils/setCursorPosition';

function toPlaceholder(mask) {
  return mask.map(c => (c instanceof RegExp ? '_' : c)).join('');
}

function isNumeric(n) {
  return !isNaN(Number(n) - parseFloat(n));
}

function unformat(numberString) {
  return numberString.replace(/([^\d.-]|\.(?=.*\.)|^\.|(?!^)-)/g, '');
}

// function parse(numberString) {
//   const unformatted = unformat(numberString);
//   if (isNumeric(unformatted)) {
//     return Number(unformatted);
//   }
//   return null;
// }

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: (props, propName, componentName) => {
    const onChange = props[propName];
    if (onChange != null && typeof onChange !== 'function') {
      return new Error(
        `Invalid prop ${propName} supplied to ${componentName}. ` +
          'Validation failed',
      );
    }
    if (props.value != null && onChange == null) {
      return new Error(
        'You provided a `value` prop to a form field without an `onChange` ' +
          'handler. This will render a read-only field. If the field should ' +
          'be mutable use `defaultValue`. Otherwise, set either ' +
          '`onChange` or `readOnly`.',
      );
    }
    return undefined;
  },
};

const defaultProps = {
  value: null,
  defaultValue: null,
  onChange: null,
};

class NumberInput extends React.PureComponent {
  static clearValue(value) {
    const cleared = unformat(value);
    if (isNumeric(cleared)) {
      return cleared;
    }
    return '';
  }

  static mask(inputValue = '') {
    const cleared = unformat(inputValue);
    if (cleared === '-' || cleared === '-0' || cleared === '-0.') {
      return cleared.split('').map(l => (/\d/.test(l) ? /\d/ : l));
    }
    const number = Number(cleared);
    if (isNaN(number)) {
      return [/\d/];
    }
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 20,
    }).format(number);
    const mask = formatted.split('').map(l => (/\d/.test(l) ? /\d/ : l));
    if (cleared.endsWith('.')) {
      mask.push('.');
    }

    return mask;
  }

  constructor(props) {
    super(props);

    if (props.value != null && props.defaultValue != null) {
      console.error(
        'Both value and defaultValue props are provided to FormattedInput. ' +
          'Input elements must be either controlled or uncontrolled',
      );
    }

    Object.assign(window, {
      conformToMask,
      adjustCaretPosition,
      mask: NumberInput.mask,
    });

    this.state = {
      isControlled: props.value != null,
      isUncontrolled: props.defaultValue != null,
      defaultValue: props.defaultValue,
      cursorPosition: 0,
    };

    this.mount = this.mount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.textMaskInputElement = createTextMaskInputElement({
      inputElement: this.node,
      mask: NumberInput.mask,
    });
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;
    if (this.state.isControlled && prevProps.value !== value) {
      console.log('updating', this.props.value);
      // this.textMaskInputElement.update(this.props.value);
      const newCaretPosition = adjustCaretPosition({
        previousConformedValue: prevProps.value,
        previousPlaceholder: toPlaceholder(NumberInput.mask(prevProps.value)),
        currentCaretPosition: this.state.cursorPosition,
        conformedValue: value,
        rawValue: unformat(value),
        placeholderChar: '_',
        placeholder: toPlaceholder(NumberInput.mask(value)),
      });
      console.log({ newCaretPosition });
      setCursorPosition(this.node, newCaretPosition);
    }
  }

  mount(n) {
    this.node = n;
  }

  handleChange(event) {
    // this.textMaskInputElement.update(event.target.value);

    // const modelValue = event.target.value;
    const { name, value } = event.target;
    const { conformedValue } = conformToMask(value, NumberInput.mask(value), {
      guide: false,
    });
    console.log('handleChange', value, conformedValue);
    console.log('cursorpos', getCursorPosition(event.target));
    this.setState({
      cursorPosition: getCursorPosition(event.target),
    });
    // if (conformedValue !== value) {
    // }
    this.props.onChange(name, conformedValue);
    // if (!this.state.isControlled) {}
    // if (modelValue !== this.props.value) {
    //   this.props.onChange(event.target.name, modelValue);
    // }
  }

  render() {
    const { value } = this.props;
    const htmlProps = omit(this.props, ['value', 'defaultValue']);
    const valueProps = {};
    if (this.state.isControlled) {
      valueProps.value = value;
    } else {
      valueProps.defaultValue = this.state.defaultValue;
    }
    console.log('rendering', valueProps);
    return (
      <input
        {...htmlProps}
        {...valueProps}
        ref={this.mount}
        type="text"
        onChange={this.handleChange}
      />
    );
  }
}

NumberInput.propTypes = propTypes;
NumberInput.defaultProps = defaultProps;

export default NumberInput;
