import React from 'react';
import Menu from './components/Menu';
import './page-Parceiros.css';

export default function Parceiros() {
  return (
    <>
  <Menu />
      <div className="page-offset">
      <section id="parceiros">
        <div className="page-section">
          <h2 className="page-heading">Parceiros</h2>
          <p className="Parceiros-intro">
            Esta página apresenta informações sobre nossos parceiros e oportunidades de colaboração.
            Aqui você pode encontrar como se tornar um parceiro, benefícios e contatos.
          </p>

          <div className="Parceiros-cta">
            <button className="search-btn Parceiros-cta-btn">Entre em contato</button>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
