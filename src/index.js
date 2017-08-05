import React from 'react';
import PropTypes from 'prop-types';
import { createTextMaskInputElement } from 'text-mask-core';

function omit(obj, keys) {
  const newObj = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

function isNumeric(n) {
  return !isNaN(Number(n) - parseFloat(n));
}

function unformat(numberString) {
  return numberString.replace(/([^\d.-]|\.(?=.*\.)|^\.|(?!^)-)/g, '');
}

function parse(numberString) {
  const unformatted = unformat(numberString);
  if (isNumeric(unformatted)) {
    return Number(unformatted);
  }
  return null;
}

const propTypes = {};

class NumberInput extends React.Component {
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

  constructor() {
    super();
    this.mount = this.mount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  mount(n) {
    this.node = n;
  }

  componentDidMount() {
    this.textMaskInputElement = createTextMaskInputElement({
      inputElement: this.node,
      mask: NumberInput.mask,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.textMaskInputElement.update(nextProps.value);
    }
  }

  handleChange(event) {
    const currentValue = event.target.value;
    this.textMaskInputElement.update();

    const modelValue = parse(event.target.value);
    if (modelValue !== this.props.value) {
      this.props.onChange(event.target.name, );
    }
  }

  render() {
    const htmlProps = omit(this.props, ['value']);
    return (
      <input
        {...htmlProps}
        ref={this.mount}
        type="text"
        defaultValue={this.props.value}
        onChange={this.handleChange}
      />
    );
  }
}

NumberInput.propTypes = propTypes;

export default NumberInput;
