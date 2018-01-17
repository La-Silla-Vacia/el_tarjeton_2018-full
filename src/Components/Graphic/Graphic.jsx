import React, { Component } from 'react';
import cN from 'classnames';
import Filters from '../../../../elections_2018/shared/Components/Filters';
import Popup from "../Popup";
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
      camara: null,
      popupItem: 0,
      popupOpen: false,
    };

    this.numberOfRows = 20;
    this.numberOfColumns = 20;

    this.items = [];
  }

  componentWillMount() {
    const { data } = this.props;

    this.items = data.sort(function (a, b) {
      let keyA = a.posicionIz_der1A100 || 50,
        keyB = b.posicionIz_der1A100 || 50;
      // Compare the 2 dates
      keyA = (typeof keyA === 'string' || !keyA) ? 50 : keyA;
      keyB = (typeof keyB === 'string' || !keyB) ? 50 : keyB;
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  }

  componentDidMount() {
    this.filterItems(this.state.filter);
  }

  getPeople() {
    // Get the data from the attribute
    const { items } = this.state;
    const { width } = this.props;

    this.numberOfColumns = Math.round(width / 25);
    this.numberOfRows = Math.round(items.length / this.numberOfColumns);
    this.size = 25;
    let x = 0, y = -this.size;
    let rowIndex = 0;

    // Loop through the data
    return items
      .map((item, index) => {
        if (rowIndex >= this.numberOfRows) {
          y = 0;
          x += this.size;
          rowIndex = 0;
        } else {
          y += this.size;
          rowIndex += 1;
        }
        return (
          <Row
            x={x}
            y={y}
            key={item.id}
            {...item}
            onClick={this.handlePersonClick.bind(false, index)}
          />
        )
      });
  }

  filterItems(filter) {
    const items = this.items.map((item) => {
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

  handlePersonClick = index => {
    if (this.state.popupOpen) return;
    this.setState({ popupOpen: true, popupItem: index });
  };

  handleClosePopup = () => {
    this.setState({ popupOpen: false });
  };

  render() {
    const { camara, popupOpen, popupItem } = this.state;
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

          <svg className={s.items} width={this.numberOfColumns * this.size} height={this.numberOfRows * this.size}>
            {people}
          </svg>

          {popupOpen ?
            <Popup {...data[popupItem]} close={this.handleClosePopup} />
            : undefined}
        </div>
      </div>
    )
  }
}