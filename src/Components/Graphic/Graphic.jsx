import React, { Component } from 'react';
import cN from 'classnames';
import Filters from '../../../../elections_2018/shared/Components/Filters';
import s from './Graphic.css';
import Row from "../Row";

export default class Graphic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: [],
      nameFilter: '',
      show: 9,
      availableItems: 0,
      items: [],
      camara: null
    }
  }

  componentDidMount() {
    this.filterItems(this.state.filter);
  }

  getPeople() {
    // Get the data from the attribute
    const { items } = this.state;

    // Loop through the data
    return items
      .sort(function (a, b) {
        let keyA = a.posicionIz_der1A100 || 50,
          keyB = b.posicionIz_der1A100 || 50;
        // Compare the 2 dates
        keyA = (typeof keyA === 'string' || !keyA) ? 50 : keyA;
        keyB = (typeof keyB === 'string' || !keyB) ? 50 : keyB;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      })
      .map((item, key) => {
          // Return the element. If you click on it run the handleClick function
          return (
            <Row key={key} {...item} />
          )
        }
      );
  }

  filterItems(filter) {
    const { data } = this.props;

    const items = data.map((item) => {
      item.hidden = false;

      for (let j = 0; j < filter.length; j += 1) {
        const filterItem = filter[j];
        if (!filterItem) continue;
        if (filterItem.which === null) continue;
        if (item[filterItem.column] !== filterItem.which) {
          item.hidden = true;
        }
      }

      const customFilters = tarjetones_2018_data.filters;
      if (typeof customFilters) {
        for (let j = 0; j < customFilters.length; j += 1) {
          const filterItem = customFilters[j];
          if (!filterItem) continue;
          if (!filterItem.hasOwnProperty("only")) continue;

          if (typeof filterItem.only === 'object') {
            if (filterItem.only.indexOf(item[filterItem.column]) === -1) return;
          } else {
            if (item[filterItem.column] !== filterItem.only) return;
          }
        }
      }
      return item;
    });

    this.setState({ items: items.clean(undefined), filter, availableItems: items.clean(undefined).length });
  }

  handleFilterUpdate = newFilters => {
    this.filterItems(newFilters);
  };

  handleNameUpdate = newName => {
    this.setState({ nameFilter: newName });
  };

  handleCameraChange = camara => {
    const filter = this.state.filter;
    let found = false;

    for (let i = 0; i < filter.length; i += 1) {
      const filterItem = filter[i];
      if (filterItem.column === 'camara') {
        found = true;
        filterItem.which = camara;
      }
    }

    if (!found) {
      filter.push({
        column: "camara",
        which: camara
      });
    }
    this.setState({ camara });
    this.filterItems(filter);
  };

  render() {
    const { camara } = this.state;
    const { data } = this.props;
    const people = this.getPeople();
    return (
      <div className={s.root}>
        <div className={s.column}>
          <header className={s.buttons}>
            <button className={cN(s.btn, { [s.btnActive]: camara === 'Cámara' })}
                    onClick={this.handleCameraChange.bind(false, 'Cámara')}>
              Congreso
            </button>
            <button className={cN(s.btn, { [s.btnActive]: camara === 'Senado' })}
                    onClick={this.handleCameraChange.bind(false, 'Senado')}>
              Senado
            </button>
            <button className={cN(s.btn, { [s.btnActive]: !camara })}
                    onClick={this.handleCameraChange.bind(false, null)}>
              Ambos
            </button>
          </header>
          <Filters
            data={data}
            filter={this.state.filter}
            onFilterUpdate={this.handleFilterUpdate}
            onNameUpdate={this.handleNameUpdate}
          />

          <div className={s.items}>
            {people}
          </div>
        </div>
      </div>
    )
  }
}