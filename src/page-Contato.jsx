import React from 'react';
import MenuLogin from './components/MenuLogin';
import './page-Contato.css';

export default function Contato() {
  return (
    <>
  <MenuLogin />
  <div className="page-offset">
  <section id="contato">
        <div className="page-section contato">
          <h2 className="contato contato-title">Contato</h2>
          <p className="contato-intro">
            Entre em contato conosco pelo formulário abaixo ou pelos canais oficiais.
          </p>

          <div className="Contato-form-wrapper">
            <input className="Contato-input" placeholder="Seu nome" />
            <input className="Contato-input" placeholder="Seu e-mail" />
            <textarea className="Contato-textarea" placeholder="Mensagem" rows={6} />
            <button className="search-btn Contato-submit">Enviar Mensagem</button>
          </div>

          <div className="Contato-info">
            <p>Telefone: (00) 0000-0000</p>
            <p>E-mail: suporte@pecafacil.com.br</p>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
