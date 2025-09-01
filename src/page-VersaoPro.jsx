import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';
import './page-VersaoPro.css';

export default function VersaoPro() {
  const navigate = useNavigate();
  return (
    <>
  <Menu />
      <div className="page-offset">
      <section id="versao-pro">
        <div className="page-section">
          <h2 className="page-heading">Versão Pro</h2>
          <p className="VersaoPro-intro">
            Tenha acesso a todos os recursos avançados, suporte prioritário e integrações para otimizar sua busca por peças.
          </p>
          <div className="VersaoPro-cards">
            <div className="VersaoPro-features">
              <h3 className="VersaoPro-features-title">Recursos incluídos</h3>
              <ul className="VersaoPro-list">
                <li>✓ Acesso completo ao buscador de peças</li>
                <li>✓ Endereços e contatos das lojas que vendem as peças</li>
                <li>✓ Suporte prioritário por e-mail e WhatsApp</li>
                <li>✓ Acesso à comunidade e materiais exclusivos</li>
                <li>✓ Atualizações e novos recursos em primeira mão</li>
              </ul>
            </div>

            <div className="VersaoPro-pricecard">
              <div className="VersaoPro-price">R$ 9,90/mês</div>
              <div className="VersaoPro-price-note">Cancelamento a qualquer momento</div>
              <button className="VersaoPro-cta" onClick={() => navigate('/checkin')}>Assinar Pro</button>
            </div>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
