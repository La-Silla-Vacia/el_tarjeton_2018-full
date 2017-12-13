import React, { Component } from 'react';
import cN from 'classnames';
import Filters from '../Filters';
import r from '../Row/Row.css';
import s from './Graphic.css';
import Row from "../Row";

export default class Graphic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: []
    }
  }

  getPeople() {
    // Get the data from the attribute
    const { filter } = this.state;
    const { data } = this.props;

    // Loop through the data
    return data.map((item, key) => {
        for (let i = 0; i < filter.length; i += 1) {
          const filterItem = filter[i];
          if (filterItem.which === null) continue;
          if (item[filterItem.column] !== filterItem.which) return;
        }

        // Return the element. If you click on it run the handleClick function
        return (
          <Row key={key} {...item} />
        )
      }
    );
  }

  handleFilterUpdate = newFilters => {
    this.setState({ filter: newFilters });
  };

  render() {
    const { data } = this.props;
    const people = this.getPeople();
    return (
      <div className={s.root}>

        <Filters
          data={data}
          items={[
            {
              title: "Género",
              column: 'genero'
            },
            {
              title: 'Profesión u oficio',
              column: 'profesionUOficio'
            },
            {
              title: 'Nivel de estudios',
              column: 'nivelDeEstudios'
            },
            {
              title: 'Sector del que viene',
              column: 'sectorDelQueViene'
            },
            {
              title: 'Experto en',
              column: 'expertoEn'
            },
            {
              title: 'Ha sido congresista',
              column: 'haSidoCongresista'
            }
          ]}
          onFilterUpdate={this.handleFilterUpdate}
        />

        <header className={cN(r.root, s.heading)}>
          <div className={s.extraIndent}><span>Nombre</span></div>
          <div><span>Cámara</span></div>
          <div><span>Partido</span></div>
        </header>
        {people}
      </div>
    )
  }
}