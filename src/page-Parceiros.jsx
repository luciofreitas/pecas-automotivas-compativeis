import React from 'react';
import Menu from './components/Menu';
import './page-Parceiros.css';

export default function Parceiros() {
  return (
    <>
  <Menu />
      <div className="menu-page">
      <section id="parceiros">
        <div className="page-section">
          <h2 className="page-heading page-title">Parceiros</h2>
          <p className="parceiros-intro">
            Esta página apresenta informações sobre nossos parceiros e oportunidades de colaboração.
            Aqui você pode encontrar como se tornar um parceiro, benefícios e contatos.
          </p>

          <div className="parceiros-cta">
            <button className="search-btn parceiros-cta-btn">Entre em contato</button>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
