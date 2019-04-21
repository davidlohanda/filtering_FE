import React from 'react'
import {Tooltip} from 'reactstrap'

export default class Example extends React.Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        tooltipOpen: false
      };
    }
  
    toggle() {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      });
    }
  
    render() {
      return (
        <div>
          <Tooltip placement="top" isOpen={this.state.tooltipOpen} autohide={false} target={this.props.id} toggle={this.toggle}>
            {this.props.value}
          </Tooltip>
        </div>
      );
    }
  }