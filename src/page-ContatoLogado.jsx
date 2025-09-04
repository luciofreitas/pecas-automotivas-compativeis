import React, { useContext } from 'react';
import Menu from './components/Menu';
import ContatoForm from './components/ContatoForm';
import { AuthContext } from './page-App';
import './page-ContatoLogado.css';

export default function ContatoLogado() {
  const { usuarioLogado } = useContext(AuthContext) || {};

  const handleSubmit = async (data) => {
    // aqui você pode enviar para a sua API
    console.log('[ContatoLogado] enviado:', data);
    alert('Mensagem enviada com sucesso (usuário logado)!');
  };

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

            <ContatoForm requireAuth={true} user={usuarioLogado} onSubmit={handleSubmit} />

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
