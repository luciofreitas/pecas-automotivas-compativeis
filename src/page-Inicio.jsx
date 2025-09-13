import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuLogin from './components/MenuLogin';
import './page-Inicio.css';

export default function PageInicio() {
  const navigate = useNavigate();

  return (
  <div className="page-wrapper">
      <MenuLogin />
      <div className="page-content inicio-main">
  <div className="inicio-hero">
          <div className="inicio-hero-inner">
                    <h2 className="inicio-title">Bem Vindo ao Peça Fácil</h2>
            <p className="inicio-subtitle">Encontre peças compatíveis com economia e confiança.</p>

            <div className="inicio-actions">
              <button className="btn-primary" onClick={() => navigate('/login')}>Entrar / Registrar</button>
              <button className="btn-secondary" onClick={() => navigate('/nosso-projeto')}>Nosso Projeto</button>
            </div>
          </div>
  </div>

  <div className="inicio-cards">
          <div className="card">Pesquisar peças por veículo</div>
          <div className="card">Ver parceiros credenciados</div>
          <div className="card">Seja Pro — descubra vantagens</div>
  </div>
      </div>
    </div>
  );
}
