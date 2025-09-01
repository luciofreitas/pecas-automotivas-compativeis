import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './Menu.css';

function Menu() {
  const [hideMenu, setHideMenu] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const navigate = useNavigate();
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  const proActive = Boolean(usuarioLogado && usuarioLogado.isPro) || localStorage.getItem('versaoProAtiva') === 'true';

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

  return (
    <header className="site-header">
      <div className="menu-root-left">
        <img src="/logo.svg" alt="Logo" className="menu-logo-image" onClick={() => navigate('/')} />
      </div>

      <nav className="menu-nav">
        <ul className="menu-list">
          <li>
            <a href="#buscar" className="menu-login-item menu-link" onClick={e => { e.preventDefault(); if (window.location.pathname === '/') { window.location.reload(); } else { navigate('/'); } }}>Buscar Peças</a>
          </li>
          <li>
            <a href="#parceiros" className="menu-login-item menu-link" onClick={e => { e.preventDefault(); navigate('/parceiros'); }}>Parceiros</a>
          </li>
          <li>
            <a href="#contato-logado" className="menu-login-item menu-link" onClick={e => { e.preventDefault(); navigate('/contato-logado'); }}>Contato</a>
          </li>
        </ul>
      </nav>

      <div className="menu-root-right">
        {!usuarioLogado ? (
          <a href="#entrar/registrar" className="menu-login-item menu-link" onClick={e => { e.preventDefault(); navigate('/login'); }}>Entrar/Registrar</a>
        ) : (
          <UserMenu
            nome={usuarioLogado.nome}
            isPro={proActive}
            onPerfil={() => navigate('/perfil')}
            onPro={() => navigate(proActive ? '/versao-pro-assinado' : '/versao-pro')}
            onConfiguracoes={() => navigate('/configuracoes')}
            onLogout={() => {
              setUsuarioLogado(null);
              localStorage.removeItem('usuarioLogado');
            }}
          />
        )}
      </div>
    </header>
  );
}

export default Menu;

function UserMenu({ nome, isPro = false, onPerfil, onPro, onConfiguracoes, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div ref={ref} className="user-menu-root">
      <button
        className="user-button user-button-inline"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>Olá, {nome}</span>
        {isPro && (
          <span className="pro-badge">PRO</span>
        )}
      </button>

      <button className="user-logout-button">Sair</button>

      {open && (
        <div className="user-dropdown">
          <button className="menu-login-item dropdown-item" onClick={() => { setOpen(false); onPerfil(); }}>Perfil</button>
          <button className="menu-login-item dropdown-item" onClick={() => { setOpen(false); onPro(); }}>Versão Pro</button>
          <button className="menu-login-item dropdown-item" onClick={() => { setOpen(false); onConfiguracoes(); }}>Configurações</button>
        </div>
      )}
    </div>
  );
}
