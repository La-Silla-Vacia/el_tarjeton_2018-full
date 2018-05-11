import React, { Component } from 'react'
import cN from 'classnames'

import s from './Row.css'

export default class Row extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false
    }

    this.color = ''
    this.transitionDelay = Math.random() / 4

    this.enterTimeout = null
  }

  shouldComponentUpdate (newProps, newState) {
    if (this.props.hidden !== newProps.hidden) {
      const realHidden = (typeof newProps.hidden === 'boolean')
      // console.log(realHidden);
      if (realHidden && newProps.hidden) {
        this.$el.classList.add(s.inActive)
      } else if (newProps.hidden) {
        this.$el.classList.add(s.halfActive)
      } else {
        this.$el.classList.remove(s.inActive)
      }
    }

    if (this.props.x !== newProps.x || this.props.y !== newProps.y) {
      return true
    }

    return false
  }

  componentWillMount () {
    const { posicionIz_der1A100 } = this.props
    const scale = (posicionIz_der1A100 && typeof posicionIz_der1A100 !== 'string') ? posicionIz_der1A100 : 50
    const grey = 255 - Math.round(scale * 2.55)
    this.color = `rgb(${grey},${grey},${grey})`
  }

  handleClick = () => {
    this.setState({ open: !this.state.open })
  }

  showName = () => {
    this.props.showName()
  }

  handleMouseEnter = () => {
    clearTimeout(this.enterTimeout)
    this.enterTimeout = setTimeout(this.showName, 200)
  }

  handleMouseLeave = () => {
    clearTimeout(this.enterTimeout)
    this.props.hideName()
  }

  render () {
    const { name, partido, foto, hidden, x, y, onClick } = this.props
    return (
      <g
        className={s.root}
        ref={(el) => this.$el = el}
        transform={`translate(${x}, ${y})`}
        style={{ transitionDelay: `${this.transitionDelay}s` }}
        xlinkTitle={name}
        onClick={onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {(foto) ?
          <image xlinkHref={`${foto}`} x={0} y={0} height={20} width={20} />
          : false}
        <rect className={s.color} width={20} height={20} x={0} y={0} data-partido={partido} />
      </g>
    )
  }
}
