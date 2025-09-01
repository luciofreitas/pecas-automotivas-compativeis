import React from 'react';
import Menu from './Menu';
import './page-ContatoLogado.css';

export default function ContatoLogado() {
  return (
    <>
  <Menu />
  <div className="page-offset">
  <section id="contato">
        <div className="page-section">
          <h2 className="page-heading">Contato</h2>
          <p className="ContatoLogado-intro">
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
