NumberInput example:

```js
initialState = { value: '1234' };
<NumberInput
  name="name"
  value={state.value}
  onChange={(name, value) => (console.log(value), setState({ value }))}
/>
```

```js
initialState = { value: '789' };
<NumberInput value={state.value} onChange={(name, value) => setState({ value })} />
```
