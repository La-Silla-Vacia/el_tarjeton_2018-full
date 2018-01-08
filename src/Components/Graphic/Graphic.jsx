import React, { Component } from 'react';
import Filters from '../Filters';
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
      items: []
    }
  }

  componentDidMount() {
    this.filterItems(this.state.filter);
  }

  getPeople() {
    // Get the data from the attribute
    const { items } = this.state;

    // Loop through the data
    return items.map((item, key) => {
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

    this.setState({ items: items.clean(undefined), availableItems: items.clean(undefined).length });
  }

  handleFilterUpdate = newFilters => {
    this.filterItems(newFilters);
  };

  handleNameUpdate = newName => {
    this.setState({ nameFilter: newName });
  };

  render() {
    const { data } = this.props;
    const people = this.getPeople();
    return (
      <div className={s.root}>
        <Filters
          data={data}
          onFilterUpdate={this.handleFilterUpdate}
          onNameUpdate={this.handleNameUpdate}
        />

        <div className={s.items}>
          {people}
        </div>
      </div>
    )
  }
}