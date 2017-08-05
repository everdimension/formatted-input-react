import React from 'react';
import NumberInput from '../../src';

class Controlled extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      exampleValue: '7888',
    };

    this.handleChange = this.handleChange.bind(this);
    this.setValue = this.setValue.bind(this);
    this.setExampleValue = this.setExampleValue.bind(this);
  }

  handleChange(name, value) {
    console.log('setting state');
    this.setState({
      [name]: value,
    }, () => console.log('handleChange in "Controlled" done'));
  }

  setExampleValue(event) {
    this.setState({ exampleValue: event.target.value });
  }

  setValue() {
    this.setState({ value: this.state.exampleValue });
  }

  render() {
    const { value, exampleValue } = this.state;
    return (
      <div>
        <p>Current value: {value}, {typeof value}</p>
        <p>
          <button onClick={this.setValue}>set value to</button>
          <input
            type="text"
            onChange={this.setExampleValue}
            value={exampleValue}
          />
        </p>
        <NumberInput
          name="value"
          value={value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Controlled;
