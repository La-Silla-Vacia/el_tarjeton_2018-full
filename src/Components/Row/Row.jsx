import React, { Component } from 'react';
import cN from 'classnames';

import s from './Row.css';
import Popup from "../Popup";

export default class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { open } = this.state;
    const { nombres, apellido1, apellido2, posicionIz_der1A100, hidden } = this.props;
    const scale = (posicionIz_der1A100 && typeof posicionIz_der1A100 !== 'string') ? posicionIz_der1A100 : 50;
    const grey = 255 - Math.round(scale * 2.55);
    return (
      <div
        tabIndex={(hidden) ? undefined : 0}
        className={cN(
          s.root,
          { [s.open]: open },
          { [s.inActive]: hidden })
        }
        style={{
          backgroundColor: `rgb(${grey},${grey},${grey})`
        }}
        title={`${nombres} ${apellido1} ${apellido2}`}
      >
        <div className={s.inner}
             onClick={!hidden ? this.handleClick : undefined}>
        </div>
        {(open) ?
          <Popup close={this.handleClick} {...this.props} />
          : false}
      </div>
    );
  }
}