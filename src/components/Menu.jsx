import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import './MenuLogin.css';
import Logo from './Logo';
import MenuUsuario from './MenuUsuario';

function Menu() {
  const [hideMenu, setHideMenu] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuPosition, setMobileMenuPosition] = useState({ top: 0, left: 0 });
  const mobileMenuButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
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

  // Função para calcular a posição do menu mobile EXATAMENTE como MenuUsuario
  const calculateMobileMenuPosition = () => {
    if (mobileMenuButtonRef.current) {
      const rect = mobileMenuButtonRef.current.getBoundingClientRect();
      // alinhar exatamente sob o botão com um pequeno offset para não colar
      const top = Math.round(rect.bottom + 6);
      const left = Math.round(rect.left);
      setMobileMenuPosition({ top, left });
    }
  };

  // Previously this effect synchronized the header height to a CSS variable.
  // That runtime synchronization was removed per request; header sizing is now
  // controlled by static CSS rules to avoid runtime style manipulation.

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    if (newState) {
      calculateMobileMenuPosition();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavigation = (callback) => {
    return (e) => {
      // Suporta ser chamado com ou sem evento (ex.: MenuUsuario chama sem evento)
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      closeMobileMenu();
      callback();
    };
  };

  // Fecha menu mobile ao clicar fora (similar ao MenuUsuario)
  useEffect(() => {
    function handleOutside(e) {
      if (mobileMenuOpen && 
          mobileMenuButtonRef.current && !mobileMenuButtonRef.current.contains(e.target) && 
          mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', calculateMobileMenuPosition);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', calculateMobileMenuPosition);
    };
  }, [mobileMenuOpen]);

  return (
    <header ref={headerRef} className="site-header menu-login">
      <div className="menu-login-root menu-responsive">
        <Logo />

        {/* Mobile hamburger button */}
        <button 
          ref={mobileMenuButtonRef}
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation menu */}
        <div 
          ref={mobileMenuRef}
          className={`menu-login-center ${mobileMenuOpen ? 'mobile-open' : ''}`}
          style={mobileMenuOpen ? {
            top: `${mobileMenuPosition.top}px`,
            left: `${mobileMenuPosition.left}px`
          } : {}}
        >
          <nav className="menu-nav">
            <ul className="menu-list">
              <li>
                <a href="#buscar" className="menu-login-item" onClick={handleNavigation(() => { 
                  if (window.location.pathname === '/') { 
                    window.location.reload(); 
                  } else { 
                    navigate('/'); 
                  } 
                })}>Buscar Peças</a>
              </li>
              <li>
                <a href="#parceiros" className="menu-login-item" onClick={handleNavigation(() => navigate('/parceiros'))}>Parceiros</a>
              </li>
              <li>
                <a href="#contato-logado" className="menu-login-item" onClick={handleNavigation(() => navigate('/contato-logado'))}>Contato</a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="menu-login-right">
        {!usuarioLogado ? (
            <a href="#entrar/registrar" className="menu-login-item text-lg md:text-xl" onClick={handleNavigation(() => navigate('/login'))}>Entrar/Registrar</a>
          ) : (
            <MenuUsuario
              nome={usuarioLogado.nome}
              isPro={proActive}
              onPerfil={handleNavigation(() => navigate('/perfil'))}
              onPro={handleNavigation(() => navigate(proActive ? '/versao-pro-assinado' : '/versao-pro'))}
              onConfiguracoes={handleNavigation(() => navigate('/configuracoes'))}
              onLogout={handleNavigation(() => {
                // limpa estado/localStorage e redireciona para a tela de login
                setUsuarioLogado(null);
                localStorage.removeItem('usuarioLogado');
                navigate('/login');
              })}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Menu;
