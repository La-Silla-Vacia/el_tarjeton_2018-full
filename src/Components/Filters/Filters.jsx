import React, { Component } from 'react';
import cN from 'classnames';
import s from './Filters.css';

export default class Filters extends Component {
  constructor (props) {
    super(props);
    this.state = {
      filter: [],
      nameValue: '',
      open: false
    };

    this.options = [];
  }

  handleFilterChange = (item, option) => {
    const { onFilterUpdate, filter } = this.props;
    const column = item.column;
    const niceName = item.title
    const choice = option.value;
    let found = false;

    for (let i = 0; i < filter.length; i += 1) {
      const filterItem = filter[i];
      if (filterItem.column === column) {
        found = true;
        filterItem.which = choice;
      }
    }

    if (item.activeChild) {
      for (let i = 0; i < item.options.length; i += 1) {
        item.options[i].active = false;
      }
    }
    if (choice) {
      item.activeChild = true;
    }
    option.active = choice;

    if (!found) {
      filter.push({
        column: column,
        columnNiceName: niceName,
        which: choice
      });
    }

    if (onFilterUpdate) onFilterUpdate(filter);
  };

  componentWillMount () {
    const items = tarjetones_2018_data.filters;
    if (!items) return;
    this.options = items.map((item) => {
      if (item.hasOwnProperty("only")) return;
      let options;

      if (item.hasOwnProperty("options")) {
        options = item.options.map((option) => {
          return {
            label: option,
            value: option
          };
        });
      } else {
        options = this.generateOptions(item.column);
      }

      options.sort(function (a, b) {
        return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0);
      });

      options.unshift({ label: "Todos", value: null });

      return {
        column: item.column,
        title: item.title,
        options: options
      }
    });
    this.options.clean(undefined);
  }

  isFilterWorthIt (column, value) {
    // Get the data from the attribute
    const { data, filter } = this.props;

    const items = tarjetones_2018_data.filters;

    for (let i = 0; i < filter.length; i += 1) {
      if (filter[i].column === column) return data.filter((item) => {
        if (items) {
          for (let i = 0; i < items.length; i += 1) {
            if (items[i].hasOwnProperty("only")) {
              if (item[items[i].column] === items[i].only) return true;
            }
          }
        }
      });
    }

    // Loop through the data
    const people = data.map((item) => {
        const { nombres } = item;

        if (items) {
          for (let i = 0; i < items.length; i += 1) {
            if (items[i].hasOwnProperty("only")) {
              if (item[items[i].column] !== items[i].only) return;
            }
          }
        }

        for (let i = 0; i < filter.length; i += 1) {
          const filterItem = filter[i];
          if (filterItem.which === null) continue;
          if (item[filterItem.column] !== filterItem.which) return;
        }

        if (item[column] !== value) return;
        return nombres;
      }
    );

    return people.clean(undefined).length;
  }

  generateOptions (column) {
    const { data } = this.props;
    const array = [];
    const items = data.map((item) => {
      if (item[column] === '') return;

      for (let i = 0; i < array.length; i += 1) {
        if (array[i] === item[column]) return;
      }

      if (!this.isFilterWorthIt(column, item[column])) return;

      array.push(item[column]);
      return {
        label: item[column],
        value: item[column]
      };
    });

    return items.clean(undefined);
  }

  handleFormInput = event => {
    const val = event.target.value;
    this.setState({ nameValue: val });
    if (this.props.onNameUpdate) this.props.onNameUpdate(val);
  };

  togglePopup = () => {
    const currentState = this.state.open;
    if (currentState) {
      this.$popup.classList.remove(s.mounted);
      setTimeout(() => {
        this.setState({ open: !currentState })
      }, 220)
    } else {
      this.setState({ open: !currentState });
      setTimeout(() => {
        this.$popup.classList.add(s.mounted);
      }, 30)
    }
  };

  render () {
    const { open } = this.state;
    return (
      <div className={s.root}>
        <header className={s.header}>
          FILTRAR POR: <button onClick={this.togglePopup} className={s.filterBtn}>Seleccionar Filtros</button>
        </header>

        {open ?
          <div onClick={this.togglePopup} className={s.overlay} />
          : undefined}

        {open ?
          <div className={s.grid} ref={el => {
            this.$popup = el
          }}>
            <div className={s.row}>
              {this.options.map((item) => {
                return (
                  <div key={item.column} className={s.item}>
                    <h3 className={s.item__title} key={item.column}>{item.title}</h3>
                    <ul className={s.list}>
                      {item.options.map((option) => {
                        return (
                          <li key={option.label}>
                            <button onClick={this.handleFilterChange.bind(this, item, option)}
                                    className={cN(s.button, { [s.buttonActive]: option.active })}>{option.label}</button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
            <button onClick={this.togglePopup} className={cN(s.filterBtn, s.blue)}>
              APLICAR
            </button>
          </div>
          : undefined}
      </div>
    )
  }
}