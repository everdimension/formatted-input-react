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

function unformat(numberString) {
  return numberString.replace(/([^\d.-]|\.(?=.*\.)|^\.|(?!^)-)/g, '');
}

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

    const isControlled = props.value != null;
    this.state = {
      isControlled,
      isUncontrolled: props.defaultValue != null,
      defaultValue: props.defaultValue,
      cursorPosition: 0,
      rawValue: isControlled ? props.value : props.defaultValue,
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

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    const { rawValue, cursorPosition } = this.state;
    if (
      this.state.isControlled &&
      (prevProps.value !== value || prevState.rawValue !== rawValue)
    ) {
      const newCaretPosition = adjustCaretPosition({
        previousConformedValue: prevProps.value,
        previousPlaceholder: toPlaceholder(NumberInput.mask(prevProps.value)),
        currentCaretPosition: cursorPosition,
        conformedValue: value,
        rawValue,
        placeholderChar: '_',
        placeholder: toPlaceholder(NumberInput.mask(value)),
      });
      setCursorPosition(this.node, newCaretPosition);
    }
  }

  mount(n) {
    this.node = n;
  }

  handleChange(event) {
    // this.textMaskInputElement.update(event.target.value);
    const { name, value } = event.target;
    const { conformedValue } = conformToMask(value, NumberInput.mask(value), {
      guide: false,
    });
    this.setState({
      rawValue: value,
      cursorPosition: getCursorPosition(event.target),
    });
    this.props.onChange(name, conformedValue);
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
