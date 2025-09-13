import React, { useContext } from 'react';
import Menu from './components/Menu';
import PerfilForm from './components/PerfilForm';
import { AuthContext } from './App';
import './page-Perfil.css';

export default function PagePerfil() {
  const { usuarioLogado } = useContext(AuthContext);

  if (!usuarioLogado) {
    return (
      <>
        <Menu />
        <div className="menu-page">
          <div className="perfil-error">
            <h2 className="page-heading">Acesso Negado</h2>
            <p>Você precisa estar logado para acessar esta página.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Menu />
      <div className="site-header-spacer" aria-hidden="true"></div>
      <div className="page-wrapper menu-page">
  <div className="page-content" id="perfil">
          <div className="page-section">
            <h2 className="page-heading page-title">Meu Perfil</h2>
            <PerfilForm formData={usuarioLogado} />
          </div>
  </div>
      </div>
    </>
  );
}
