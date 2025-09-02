import React from 'react';
import MenuLogin from './components/MenuLogin';
import './page-SejaPro.css';

export default function SejaPro() {
  return (
    <>
  <MenuLogin />
  <div className="page-offset">
  <section id="seja-pro">
        <div className="page-section">
          <h2 className="page-heading">Seja Pro</h2>
          <p className="SejaPro-intro">
            Tenha acesso a benefícios exclusivos e suporte prioritário ao se tornar um membro Pro.
          </p>
          <div className="SejaPro-cards">
            <div className="SejaPro-card">
              <h3 className="SejaPro-card-title">Básico</h3>
              <p className="SejaPro-card-lead">Todos os benefícios da versão gratuita.</p>
              <div className="SejaPro-card-body">
                <ul className="SejaPro-features">
                  <li>Acesso ao buscador de peças.</li>
                  <li className="SejaPro-feature-unavailable">Acesso ao endereço das lojas que vendem as peças.</li>
                  <li>Suporte via email.</li>
                  <li className="SejaPro-feature-unavailable">Suporte via whatsapp.</li>
                  <li className="SejaPro-feature-unavailable">Comunidade no discord.</li>
                </ul>
              </div>
            </div>

            <div className="SejaPro-card">
              <h3 className="SejaPro-card-title">Pro</h3>
              <p className="SejaPro-card-lead">Todos os benefícios da versão Pro.</p>
              <div className="SejaPro-card-body">
                <ul className="SejaPro-features">
                  <li> Acesso ao buscador de peças.</li>
                  <li> Acesso ao endereço das lojas que vendem as peças.</li>
                  <li> Suporte via email.</li>
                  <li> Suporte via whatsapp.</li>
                  <li> Comunidade no discord.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
