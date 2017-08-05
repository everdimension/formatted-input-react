import React from 'react';
import NumberInput from '../../src';

function Uncontrolled() {
  return (
    <NumberInput
      name="uncontrolled"
      defaultValue={123456}
    />
  );
}

export default Uncontrolled;
