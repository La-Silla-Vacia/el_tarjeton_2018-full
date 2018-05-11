import React, { Component } from 'react';
import cN from 'classnames';
import Filters from '../Filters';
import Popup from "../Popup";
import s from './Graphic.css';
import Row from "../Row";

export default class Graphic extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filter: [],
      nameFilter: '',
      show: 9,
      availableItems: 0,
      items: [],
      camara: null,
      popupItem: 10,
      popupOpen: false,
      nameItem: 0,
      nameOpen: false,
      nameMounted: false
    };

    this.numberOfRows = 20;
    this.numberOfColumns = 20;

    this.items = [];
  }

  partidos = ['Afros', 'Indígenas', 'Farc', 'Opción Ciudadana', 'Polo', 'Coalición Colombia', 'Alianza Verde', 'Lista De La Decencia', 'Liberal', 'La U', 'Cambio Radical', 'Mira', 'Conservador', 'Centro Democrático', 'Otros'];

  componentWillMount () {
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

    this.setPositions();

    window.addEventListener('resize', this.setPositions);
  }

  setPositions = () => {
    const { width } = this.props;
    const items = this.items
    this.numberOfColumns = Math.round(width / 25);
    this.numberOfRows = Math.round(items.length / (this.numberOfColumns - 1));
    this.size = 25;
    let x = 0, y = -this.size;
    let rowIndex = -1;

    let currentStage = 0;
    this.stageSizes = [];
    console.log(items)
    this.itemsWithPosition = items.map((item) => {
      if ((item.posicionIz_der1A100 >= 33 && currentStage < 33) || item.posicionIz_der1A100 >= 66 && currentStage < 66) {
        y = -this.size;
        x += this.size + (this.size / 2);
        rowIndex = -1;
        currentStage = item.posicionIz_der1A100;
        if (item.posicionIz_der1A100 >= 33 && item.posicionIz_der1A100 < 66) {
          this.stageSizes[0] = { start: 0, width: x, text: "IZQUIERDA" };
        } else {
          this.stageSizes[1] = { start: this.stageSizes[0].width, width: x - this.stageSizes[0].width, text: "CENTRO" };
        }
      }

      if (rowIndex >= this.numberOfRows) {
        y = 0;
        x += this.size;
        rowIndex = 0;
      } else {
        y += this.size;
        rowIndex += 1;
      }
      item.x = x;
      item.y = y;

      if (this.stageSizes[1]) {
        this.stageSizes[2] = {
          start: this.stageSizes[0].width + this.stageSizes[1].width,
          width: x - this.stageSizes[0].width - this.stageSizes[1].width + (this.size + this.size / 2),
          text: "DERECHA"
        };
      }
      return item;
    });
  };

  componentDidMount () {
    this.filterItems(this.state.filter);
  }

  getPeople () {
    // Get the data from the attribute
    const { items } = this.state;
    // Loop through the data
    return items
      .map((item, index) => {

        return (
          <Row
            key={item.id}
            {...item}
            showName={this.handleNameShow.bind(false, index)}
            hideName={this.handleHideName}
            onClick={this.handlePersonClick.bind(false, index)}
          />
        )
      });
  }

  filterItems (filter, nameFilter) {
    const elected = window.tarjetones_2018_data.elected;
    let name_filter = nameFilter || this.state.nameFilter;

    if (name_filter === 999) name_filter = null;
    const items = this.itemsWithPosition.map((item) => {
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

      if (name_filter) {
        if (item.name.toLowerCase().indexOf(name_filter) === -1) item.hidden = true;
      }

      if (elected && this.electo) {
        if (item.electo === 'Elegido') {
          item.hidden = false;
        } else if (item.electo === 'Purgatorio') {
          item.hidden = 1
        } else {
          item.hidden = true;
        }
      }
      return item;
    });

    this.setState({
      items: items.clean(undefined),
      filter,
      availableItems:
      items.clean(undefined).length,
      nameFilter
    });
  }

  handleFilterUpdate = newFilters => {
    this.filterItems(newFilters);
  };

  handleNameUpdate = newName => {
    const val = newName || 999;
    this.filterItems(this.state.filter, val);
  };

  handleCameraChange = (column, which) => {
    const filter = this.state.filter;
    let found = false;

    if (which === 'Elegido') {
      this.electo = true;
    } else {
      this.electo = false;

      for (let i = 0; i < filter.length; i += 1) {
        const filterItem = filter[i];
        if (filterItem.column === column) {
          found = true;
          filterItem.which = which;
        }
      }

      if (!found) {
        filter.push({
          column: column,
          which: which
        });
      }
    }
    this.setPositions();
    if (column === "camara") this.setState({ camara: which });
    this.filterItems(filter);
  };

  handlePersonClick = index => {
    if (this.state.popupOpen) return;
    document.querySelector('body').style.overflow = 'hidden';
    this.setState({ popupOpen: true, popupItem: index });
  };

  handleClosePopup = () => {
    document.querySelector('body').style.overflow = 'auto';
    this.setState({ popupOpen: false });
  };

  handleNameShow = index => {
    if (this.state.nameOpen && this.state.nameItem === index) return;
    this.setState({ nameOpen: true, nameItem: index });
    setTimeout(() => {
      this.$namePopup.classList.add(s.mounted);
    }, 30)
  };

  handleHideName = () => {
    if (!this.state.nameOpen) return;
    this.$namePopup.classList.remove(s.mounted);
    setTimeout(() => {
      this.setState({ nameOpen: false });
    }, 200)
  };

  handleReset = () => {
    this.filterItems([]);
  };

  render () {
    const { camara, popupOpen, popupItem, nameOpen, nameItem } = this.state;
    const people = this.getPeople();
    return (
      <div className={s.root}>
        <Filters
          data={this.itemsWithPosition}
          filter={this.state.filter}
          onFilterUpdate={this.handleFilterUpdate}
          onNameUpdate={this.handleNameUpdate}
          onReset={this.handleReset}
        >
          <div>
            <button className={cN(s.btn, { [s.btnActive]: !camara })}
                    onClick={this.handleCameraChange.bind(false, 'camara', null)}>
              Congreso
            </button>
            <button className={cN(s.btn, { [s.btnActive]: camara === 'Senado' })}
                    onClick={this.handleCameraChange.bind(false, 'camara', 'Senado')}>
              Senado
            </button>
            <button className={cN(s.btn, { [s.btnActive]: camara === 'Cámara' })}
                    onClick={this.handleCameraChange.bind(false, 'camara', 'Cámara')}>
              Cámara
            </button>
          </div>
        </Filters>

        <div className={s.inner}>
          <svg className={s.items} width={this.numberOfColumns * this.size}
               height={(this.numberOfRows + 1) * this.size}>
            {people}
          </svg>

          {nameOpen ?
            <div
              ref={el => this.$namePopup = el}
              className={s.name}
              style={{ top: `${this.itemsWithPosition[nameItem].y}px`, left: `${this.itemsWithPosition[nameItem].x}px` }}
            >
              <div className={s.photo} style={{ backgroundImage: `url(${this.itemsWithPosition[nameItem].foto})` }} />
              <div className={s.nameBox}>
                <h4>{this.itemsWithPosition[nameItem].name}</h4>
                <span>{this.itemsWithPosition[nameItem].partido}</span>
                {window.tarjetones_2018_data.elected ?
                  <span className={s.label}> - {this.itemsWithPosition[nameItem].electo}</span>
                  : undefined}
              </div>
            </div>

            : undefined}
        </div>

        {popupOpen ?
          <Popup {...this.itemsWithPosition[popupItem]} close={this.handleClosePopup} />
          : undefined}

        <div className={s.izqDer} style={{ width: `${(this.numberOfColumns - 1) * this.size}px` }}>
          {this.stageSizes.map((size, i) => {
            return (
              <div className={s.izqDer__line} key={i}
                   style={{ width: size.width - (this.size / 2), left: size.start }}>{size.text}</div>
            )
          })}
        </div>

        <div className={s.legenda}>
          <ul className={s.list}>
            {this.partidos.map((partido) => {
              return (
                <li className={s.item} key={partido}>
                  <div className={s.circle} data-partido={partido} />
                  {partido}
                </li>
              );
            })}
          </ul>

          <div className={s.credits}>
            <div>
              <span>Diseño</span>
              <img src="http://bestiario.org/themes/default/bestiario_logo.svg" alt="Bestiario" />
            </div>
            <div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Logo_Bancolombia.svg" alt="Bancolombia" />
              <p>apoyó esta herramienta educativa para que los ciudadanos voten informados. Ésta no representa una
                posición institucional
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}