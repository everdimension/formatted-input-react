FormattingInput example:

### Controlled
```js
initialState = { value: '123ss4' };
const handleChange = (name, value) => (console.log(value), setState({ value }));
<FormattingInput
  name="name"
  value={state.value}
  onChange={handleChange}
  mask={require('../test/createMask').createMask}
/>
```

```js
initialState = { value: '789' };
<FormattingInput
  value={state.value}
  onChange={(name, value) => setState({ value })}
  mask={require('../test/createMask').createMask}
/>
```

Inside isolated TestComponent:
```js
class TestComponent extends React.Component {
  constructor() {
    super();
    this.state = { value: '9999' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(name, value) {
    console.log(value);
    this.setState({ value });
  }

  render() {
    return (
      <FormattingInput
        name="name"
        value={this.state.value}
        onChange={this.handleChange}
        mask={require('../test/createMask').createMask}
      />
    );
  }
}
<TestComponent />
```


### Uncontrolled
```js
<FormattingInput
  defaultValue="1234"
  mask={require('../test/createMask').createMask}
/>
```
