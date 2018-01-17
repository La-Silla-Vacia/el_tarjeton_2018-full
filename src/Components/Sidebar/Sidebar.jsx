import React, { Component } from 'react';
import s from './Sidebar.css';


const Option = ({ data }) => (
  <aside className={s.column}>
    <h2 className={s.title}>Aspirantes al senado</h2>
    <div className={s.thumbs}>
      {data.filter(({ camara }) => {
        if (camara === 'Senado') return true;
      }).map((item, index) => {
        return (
          <div key={item.nombres + String(index)} className={s.person}>
            <div className={s.avatar} style={{ backgroundImage: `url(${item.foto})` }} />
            <div>
              <h4>{item.nombres}</h4>
              <small>{item.partido}</small>
            </div>
          </div>
        )
      })}
    </div>

    <hr />

    <h2 className={s.title}>Aspirantes al congreso</h2>
    <div className={s.thumbs}>
      {data.filter(({ camara }) => {
        if (camara === 'Cámara') return true;
      }).map((item, index) => {
        return (
          <div key={item.nombres + String(index)} className={s.person}>
            <div className={s.avatar} style={{ backgroundImage: `url(${item.foto})` }} />
            <div>
              <h4>{item.nombres}</h4>
              <small>{item.partido}</small>
            </div>
          </div>
        )
      })}
    </div>
  </aside>
);

export default Option;