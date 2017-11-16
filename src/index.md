NumberInput example:

### Controlled
```js
initialState = { value: '123ss4' };
const handleChange = (name, value) => (console.log(value), setState({ value }));
<NumberInput
  name="name"
  value={state.value}
  onChange={handleChange}
/>
```

```js
initialState = { value: '789' };
<NumberInput value={state.value} onChange={(name, value) => setState({ value })} />
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
      <NumberInput
        name="name"
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}
<TestComponent />
```


### Uncontrolled
```js
<NumberInput
  defaultValue="1234"
/>
```
