import React from 'react';
import './SearchForm.css';

function SearchForm({
  selectedGrupo,
  setSelectedGrupo,
  selectedCategoria,
  setSelectedCategoria,
  selectedMarca,
  setSelectedMarca,
  selectedModelo,
  setSelectedModelo,
  selectedAno,
  setSelectedAno,
  selectedFabricante,
  setSelectedFabricante,
  grupos,
  todasPecas,
  marcas,
  modelos,
  anos,
  fabricantes,
  onSearch,
  onClear,
  loading,
  error
}) {
  return (
    <form className="search-form" onSubmit={onSearch} aria-label="Formulário de busca de peças">
      <div className="search-form-row">
        <div className="search-form-field">
          <label htmlFor="grupo">Grupo</label>
          <select id="grupo" value={selectedGrupo} onChange={e => setSelectedGrupo(e.target.value)}>
            <option value="">Todos os grupos</option>
            {grupos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="search-form-field">
          <label htmlFor="categoria">Peça</label>
          <select id="categoria" value={selectedCategoria} onChange={e => setSelectedCategoria(e.target.value)}>
            <option value="">Todas as peças</option>
            {Array.from(new Set(todasPecas.map(p => p.name))).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="search-form-row">
        <div className="search-form-field">
          <label htmlFor="marca">Marca</label>
          <select id="marca" value={selectedMarca} onChange={e => setSelectedMarca(e.target.value)}>
            <option value="">Todas as marcas</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="search-form-field">
          <label htmlFor="modelo">Modelo</label>
          <select id="modelo" value={selectedModelo} onChange={e => setSelectedModelo(e.target.value)}>
            <option value="">Todos os modelos</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="search-form-row">
        <div className="search-form-field">
          <label htmlFor="ano">Ano</label>
          <select id="ano" value={selectedAno} onChange={e => setSelectedAno(e.target.value)}>
            <option value="">Todos os anos</option>
            {anos.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="search-form-field">
          <label htmlFor="fabricante">Fabricante</label>
          <select id="fabricante" value={selectedFabricante} onChange={e => setSelectedFabricante(e.target.value)}>
            <option value="">Todos os fabricantes</option>
            {fabricantes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="search-form-actions">
        <button className="search-form-btn search-form-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
        <button type="button" className="search-form-btn search-form-btn-secondary" onClick={onClear}>
          Limpar
        </button>
        {error && <div className="search-form-error" role="status" aria-live="polite">{error}</div>}
      </div>
    </form>
  );
}

export default SearchForm;
