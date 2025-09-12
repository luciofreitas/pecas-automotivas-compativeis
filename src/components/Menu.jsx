import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './MenuLogin.css';
import Logo from './Logo';
import MenuUsuario from './MenuUsuario';

function Menu() {
  const [hideMenu, setHideMenu] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const navigate = useNavigate();
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  const proActive = Boolean(usuarioLogado && usuarioLogado.isPro) || localStorage.getItem('versaoProAtiva') === 'true';
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 60) {
        setHideMenu(true);
      } else {
        setHideMenu(false);
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  // Previously this effect synchronized the header height to a CSS variable.
  // That runtime synchronization was removed per request; header sizing is now
  // controlled by static CSS rules to avoid runtime style manipulation.

  return (
    <header ref={headerRef} className="site-header menu-login">
      <div className="menu-login-root menu-responsive">
        <Logo />

        <div className="menu-login-center">
          <nav className="menu-nav">
            <ul className="menu-list">
              <li>
                <a href="#buscar" className="menu-login-item" onClick={e => { e.preventDefault(); if (window.location.pathname === '/') { window.location.reload(); } else { navigate('/'); } }}>Buscar Peças</a>
              </li>
              <li>
                <a href="#parceiros" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/parceiros'); }}>Parceiros</a>
              </li>
              <li>
                <a href="#contato-logado" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/contato-logado'); }}>Contato</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="menu-login-right">
        {!usuarioLogado ? (
            <a href="#entrar/registrar" className="menu-login-item text-lg md:text-xl" onClick={e => { e.preventDefault(); navigate('/login'); }}>Entrar/Registrar</a>
          ) : (
            <MenuUsuario
              nome={usuarioLogado.nome}
              isPro={proActive}
          onPerfil={() => navigate('/perfil')}
              onPro={() => navigate(proActive ? '/versao-pro-assinado' : '/versao-pro')}
              onConfiguracoes={() => navigate('/configuracoes')}
              onLogout={() => {
                // limpa estado/localStorage e redireciona para a tela de login
                setUsuarioLogado(null);
                localStorage.removeItem('usuarioLogado');
                navigate('/login');
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Menu;
