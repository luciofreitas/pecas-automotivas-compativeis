import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuLogin.css';
import Logo from './Logo';

const MenuLogin = () => {
  const navigate = useNavigate();

  return (
    <>
      <header className="site-header">
        <div className="menu-login-root menu-responsive">
          <Logo />

          <div className="menu-login-center">
            <nav className="menu-nav">
              <ul className="menu-list">
                <li><a href="#inicio" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/inicio'); }}>Início</a></li>
                <li><a href="#quem-somos" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/quem-somos'); }}>Quem Somos</a></li>
                <li><a href="#nosso-projeto" className="menu-login-item nosso-projeto" onClick={e => { e.preventDefault(); navigate('/nosso-projeto'); }}>Nosso Projeto</a></li>
                <li><a href="#seja-pro" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/seja-pro'); }}>Seja Pro</a></li>
                <li><a href="#contato" className="menu-login-item" onClick={e => { e.preventDefault(); navigate('/contato'); }}>Contato</a></li>
                <li><a href="#entrar-registrar" className="menu-login-item entrar-registrar" onClick={e => { e.preventDefault(); navigate('/login'); }}>Entrar/Registrar</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default MenuLogin;
