import React from 'react';
import WhatsAppButton from './WhatsAppButton';
import './PecaCard.css';

function PecaCard({ peca, onViewCompatibility }) {
  return (
    <div className="peca-card">
      <h3 className="peca-card-title">{peca.name}</h3>
      <p className="peca-card-info"><strong>Categoria:</strong> {peca.category}</p>
      <p className="peca-card-info"><strong>Fabricante:</strong> {peca.manufacturer}</p>
      <p className="peca-card-info"><strong>Código:</strong> {peca.part_number}</p>
      <p className="peca-card-info"><strong>Descrição:</strong> {peca.description}</p>
      
      {peca.specifications && (
        <div className="peca-card-specs">
          <strong>Especificações:</strong>
          {Object.entries(peca.specifications).map(([key, value]) => (
            <div key={key} className="peca-card-spec-item">
              {key}: {value}
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="peca-card-compat-btn" 
        onClick={() => onViewCompatibility(peca)}
      >
        Ver compatibilidade
      </button>
    </div>
  );
}

export default PecaCard;
