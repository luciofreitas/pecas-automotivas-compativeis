import React from 'react';
import MenuLogin from './components/MenuLogin';
import './page-QuemSomos.css';

export default function QuemSomos() {
  return (
    <>
    <MenuLogin />
    <div className="page-offset">
  <section id="quem-somos">
        <div className="page-section">
          <h2 className="quem-somos__title page-heading">Quem Somos</h2>

          <div className="quem-somos__content">
            <p className="quem-somos__lead">
              Somos uma empresa fundada por três amigos que, cansados de depender de terceiros, decidiram transformar iniciativa em soluções concretas.
            </p>

            <p className="quem-somos__body">
              Com recursos iniciais modestos, unimos curiosidade técnica, colaboração e disciplina para resolver problemas reais do setor automotivo.
              Atuamos com foco em eficiência, acessibilidade e resultados mensuráveis. Nosso compromisso é entregar produtos úteis e confiáveis,
              sustentados por ética, transparência e aprendizado contínuo. Não buscamos ser apenas mais uma empresa no mercado global —
              trabalhamos com serenidade e consistência para, um dia, nos tornar referência em tecnologia.
            </p>
          </div>
        </div>
  </section>
  </div>
    </>
  );
}
