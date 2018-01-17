import React, { Component } from 'react';
import cN from 'classnames';
import showdown from 'showdown';

const converter = new showdown.Converter();
import s from './Popup.css';

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      mounted: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true});
    }, 30);

    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = ({key}) => {
    if (key === 'Escape') this.handleClose();
  };

  handleClose = () => {
    this.setState({mounted: false});
    setTimeout(() => {
      this.props.close();
    }, 430);
  };

  render() {
    const { open, mounted } = this.state;
    const { name, camara, partido, foto, twitter, perfilDeQuienEsQuien, perfilito, departamento, posicionIz_der1A100 } = this.props;
    return (
      <div className={cN(s.root, {[s.mounted]: mounted})}>
        <div className={s.overlay} onClick={this.handleClose} />
        <div className={s.inner}>
          <header className={s.header}>
            <span>{partido}</span>
            <span>{camara}</span>
          </header>

          <div className={s.intro}>
            <div className={s.photo} style={{ backgroundImage: `url(${foto})` }} />
            <div className={s.name}>
              <h4>{name}</h4>
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

          <footer className={s.footer}>
            <div className={s.camara}>
              {camara}
            </div>
            <div className={s.partido}>
              {partido}
            </div>
          </footer>

          <button className={s.button} onClick={this.handleClose}> Cerca</button>
        </div>
      </div>
    );
  }
}