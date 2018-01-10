import React, { Component } from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter();
import s from './Popup.css';

export default class Popup extends Component {
  render() {
    const { nombres, apellido1, apellido2, camara, partido, foto, twitter, perfilDeQuienEsQuien, perfilito, posicionIz_der1A100, hidden } = this.props;
    const photo = (foto) ? foto : 'http://archivo.lasillavacia.com/archivos/historias/odebrecht/15.jpg';
    return (
      <div className={s.popup}>
        <div className={s.popup__inner}>

          <button className={s.close_btn}>
            <svg width="41px" height="41px" viewBox="0 0 41 41">
              <rect transform="translate(21.500000, 21.500000) rotate(45.000000) translate(-21.500000, -21.500000) "
                    x="-6" y="20" width="55" height="3" />
              <rect
                transform="translate(21.500000, 21.500000) rotate(135.000000) translate(-21.500000, -21.500000) "
                x="-6" y="20" width="55" height="3" />
            </svg>
          </button>

          <header className={s.popup__header}>
            <img className={s.photo} src={photo} alt='' />
            <div className={s.name}>
              {nombres} {apellido1} {apellido2}
            </div>
          </header>

          <div className={s.social}>
            {(twitter) ?
              <a href={`https://twitter.com/${twitter}`} target='_blank' rel={'noreferer'}>{twitter}</a>
              : false}
            {(twitter && perfilDeQuienEsQuien) ? ' - ' : false}
            {(perfilDeQuienEsQuien) ?
              <a href={perfilDeQuienEsQuien}>Quien es quien</a>
              : false}
          </div>

          <article className={s.content} dangerouslySetInnerHTML={{ __html: converter.makeHtml(perfilito) }} />
          <footer className={s.footer}>
            <div className={s.camara}>
              <div className={s.headline}>Cámara</div>
              {camara}
            </div>
            <div className={s.partido}>
              <div className={s.headline}>Partido</div>
              {partido}
            </div>
          </footer>
        </div>
      </div>
    );
  }
}