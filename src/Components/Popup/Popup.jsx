import React, { Component } from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter();
import s from './Popup.css';

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  render() {
    const { open } = this.state;
    const { nombres, apellido1, apellido2, camara, partido, foto, twitter, perfilDeQuienEsQuien, perfilito, departamento, posicionIz_der1A100, hidden } = this.props;
    const photo = (foto) ? foto : 'http://archivo.lasillavacia.com/archivos/historias/odebrecht/15.jpg';
    return (
      <div className={s.root}>
        <div className={s.inner}>
          <header className={s.header}>
            <span>{partido}</span>
            <span>{camara}</span>
          </header>

          <div className={s.intro}>
            <div className={s.photo} style={{ backgroundImage: `url(${photo})` }} />
            <div className={s.name}>
              <h4>{nombres} {apellido1} {apellido2}</h4>
              <div className={s.departamento}>
                <h5>DEPARTAMENTO</h5>
                {departamento}
              </div>
            </div>
          </div>

          <button className={s.button} onClick={(e) => {
            this.setState({ open: !open })
          }}>
            LEER BIOGRAFÍA
          </button>

          {open ?
            <article className={s.content} dangerouslySetInnerHTML={{ __html: converter.makeHtml(perfilito) }} />
            : undefined}

          <div className={s.section}>
            <h4>Espectro ideológico de partido</h4>
            <div className={s.espectro}>
              <div className={s.espectro__line} />
              <div className={s.espectro__marker} style={{ left: `${posicionIz_der1A100}%` }} />
            </div>
            <footer className={s.espectro__footer}>
              <span>IZQUIERDA</span>
              <span>CENTRO</span>
              <span>DERECHA</span>
            </footer>
          </div>

          <div className={s.social}>
            {(twitter) ?
              <a href={`https://twitter.com/${twitter}`} target='_blank' rel={'noreferer'}>{twitter}</a>
              : false}
            {(twitter && perfilDeQuienEsQuien) ? ' - ' : false}
            {(perfilDeQuienEsQuien) ?
              <a href={perfilDeQuienEsQuien}>Quien es quien</a>
              : false}
          </div>

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

          <button className={s.button} onClick={this.props.close}> Cerca</button>
        </div>
      </div>
    );
  }
}