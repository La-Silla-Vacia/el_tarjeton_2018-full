import React, { Component } from 'react';
import cn from 'classnames';

import getData from '../../elections_2018/shared/data/getData';
import LoadScreen from '../../elections_2018/shared/Components/LoadScreen';
import Graphic from './Components/Graphic';

import s from './base.css';

export default class Base extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      loading: true,
      width: 0
    };

    this.setData = this.setData.bind(this);
  }

  setData(data) {
    this.setState({ data: data, loading: false });
  }

  componentDidMount() {

  }

  componentWillMount() {
    getData(this.setData);
    this.setState({ width: this.props.width() });
  }

  render() {
    const { loading, width, data } = this.state;

    // If it's still downloading the data, show the loadscreen
    let content = (loading) ? (<LoadScreen />) : (
      <div className={s.inner}>
        <Graphic width={width} data={data} />
      </div>
    );

    return (
      <div className={cn(s.container, { [s.loading]: loading })}>
        {content}
      </div>
    )
  }
}