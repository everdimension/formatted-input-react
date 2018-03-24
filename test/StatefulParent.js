import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  render: PropTypes.func.isRequired,
};

class StatefulParent extends React.Component {
  constructor() {
    super();
    this.state = { value: '' };
  }

  render() {
    const { props, state } = this;
    return this.props.render({ props, state });
  }
}

StatefulParent.propTypes = propTypes;

export { StatefulParent };
