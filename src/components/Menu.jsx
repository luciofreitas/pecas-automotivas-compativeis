import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './MenuLogin.css';
import Logo from './Logo';

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
      </div>
    </header>
  );
}

export default Menu;

function UserMenu({ nome, isPro = false, onPerfil, onPro, onConfiguracoes, onLogout }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Função para calcular a posição do dropdown
  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom, // Posiciona abaixo do botão
        right: window.innerWidth - rect.right // Alinha à direita do botão
      });
    }
  };

  // Atualiza posição quando abre
  useEffect(() => {
    if (open) {
      calculatePosition();
    }
  }, [open]);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleOutside(e) {
      if (open && 
          buttonRef.current && !buttonRef.current.contains(e.target) && 
          dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [open]);

  return (
    <div className="user-menu-root">
      <button
        ref={buttonRef}
        className="user-button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>Olá, {nome}</span>
        {isPro && (
          <span className="pro-badge">PRO</span>
        )}
      </button>

      {open && (
        <div 
          ref={dropdownRef}
          className="user-dropdown"
          style={{ 
            top: `${dropdownPosition.top}px`, 
            right: `${dropdownPosition.right}px` 
          }}
        >
          <button className="dropdown-item" onClick={() => { setOpen(false); onPerfil(); }}>Perfil</button>
          <button className="dropdown-item" onClick={() => { setOpen(false); onPro(); }}>Versão Pro</button>
          <button className="dropdown-item" onClick={() => { setOpen(false); onConfiguracoes(); }}>Configurações</button>
          <button className="dropdown-item dropdown-item-logout" onClick={() => { setOpen(false); onLogout(); }}>Sair</button>
        </div>
      )}
    </div>
  );
}

// styles moved to App.css under the Menu namespace
