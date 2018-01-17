import React, { Component } from 'react';
import cN from 'classnames';

import s from './Row.css';

export default class Row extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.color = '';
  }

  componentWillMount() {
    const { posicionIz_der1A100 } = this.props;
    const scale = (posicionIz_der1A100 && typeof posicionIz_der1A100 !== 'string') ? posicionIz_der1A100 : 50;
    const grey = 255 - Math.round(scale * 2.55);
    this.color = `rgb(${grey},${grey},${grey})`;
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { open } = this.state;
    const { name, partido, foto, hidden, x, y, onClick } = this.props;
    return (
      <g
        className={cN(s.root, { [s.inActive]: hidden })}
        transform={`translate(${x}, ${y})`}
        xlinkTitle={name}
        onClick={onClick}
      >
        {(foto) ?
          <image xlinkHref={foto} x={0} y={0} height={20} width={20} />
          : false}
        <rect className={s.color} width={20} height={20} x={0} y={0} data-partido={partido} />
      </g>
    );
  }
}

/*
 <div
        tabIndex={(hidden) ? undefined : 0}
        className={cN(
          s.root,
          { [s.open]: open },
          { [s.inActive]: hidden })
        }
        style={{
          backgroundColor: this.color,
          backgroundImage: `url(${foto})`
        }}
        title={name}
        data-partido={partido}
      >
        <div className={s.inner}
             onClick={!hidden ? this.handleClick : undefined}>
        </div>
        {(open) ?
          <Popup close={this.handleClick} {...this.props} />
          : false}
      </div>
 */