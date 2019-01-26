import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Counter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }

  render() {
    return <div>
      <div id='counter'>{this.state.count}</div>
      <div>
        <button id='button' onClick={() => {
          this.setState({count: this.state.count + 1})
        }}>Click Me
        </button>
      </div>
    </div>;
  }
}
