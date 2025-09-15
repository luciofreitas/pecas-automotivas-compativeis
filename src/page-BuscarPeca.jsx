import React, { useState, useContext, useEffect } from 'react';
import Menu from './components/Menu';
import { AuthContext } from './App';
import CompatibilityModal from './CompatibilityModal';
import SearchForm from './components/SearchForm';
import PecasGrid from './components/PecasGrid';
import CompatibilityGrid from './components/CompatibilityGrid';
import './page-BuscarPeca.css';

export default function BuscarPeca() {
  const { usuarioLogado } = useContext(AuthContext) || {};
  
  // filters and data
  const [selectedGrupo, setSelectedGrupo] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedModelo, setSelectedModelo] = useState('');
  const [selectedAno, setSelectedAno] = useState('');
  const [selectedFabricante, setSelectedFabricante] = useState('');

  const [grupos, setGrupos] = useState([]);
  const [todasPecas, setTodasPecas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [anos, setAnos] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch('/api/pecas/meta');
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        setGrupos(data.grupos || []);
        setTodasPecas(data.pecas || []);
        setMarcas(data.marcas || []);
        setModelos(data.modelos || []);
        setAnos(data.anos || []);
        setFabricantes(data.fabricantes || []);
      } catch (err) {
        console.warn('Failed to load /api/pecas/meta:', err && err.message ? err.message : err);
        setError('Não foi possível carregar os dados iniciais. Tente recarregar a página.');
      }
    };

    loadMeta();

    const onRefresh = () => loadMeta();
    window.addEventListener('app-refresh', onRefresh);
    return () => window.removeEventListener('app-refresh', onRefresh);
  }, []);

  const renderPecasModal = (lista) => (
    <div className="buscarpeca-modal-pecas">
      <div className="compat-results-grid">
        <PecasGrid pecas={lista} onViewCompatibility={openModal} />
      </div>
    </div>
  );

  const openModal = (pecaOrId) => {
    const peca = typeof pecaOrId === 'object' && pecaOrId ? pecaOrId : pecas.find(p => p.id === pecaOrId);
    console.debug('[BuscarPeca] openModal called for', pecaOrId, 'resolved=', !!peca);
    setModalTitle('Compatibilidade');
    if (!peca || !peca.applications) {
      console.debug('[BuscarPeca] no applications for peca', peca);
      setModalContent(<div>Nenhuma aplicação encontrada.</div>);
      setShowModal(true);
      return;
    }

    const compatContent = (
      <div className="buscarpeca-compat-wrapper">
        <CompatibilityGrid applications={peca.applications} usuarioLogado={usuarioLogado} />
      </div>
    );

    setModalContent(compatContent);
    setShowModal(true);
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');
    const filtros = { 
      grupo: selectedGrupo, 
      categoria: selectedCategoria, 
      marca: selectedMarca, 
      modelo: selectedModelo, 
      ano: selectedAno, 
      fabricante: selectedFabricante 
    };
    try {
      const res = await fetch('/api/pecas/filtrar', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(filtros) 
      });
      const data = await res.json();
      const pecasFiltradas = data.pecas || [];
  console.debug('[BuscarPeca] search result count=', pecasFiltradas.length, 'sample=', pecasFiltradas.slice(0,5));
      setPecas(pecasFiltradas);
      if (pecasFiltradas.length === 0) {
        setError(data.mensagem || 'Nenhuma peça encontrada para os filtros selecionados.');
      } else {
        setModalTitle(`Encontradas ${pecasFiltradas.length} peça(s)`);
        setModalContent(renderPecasModal(pecasFiltradas));
        setShowModal(true);
      }
    } catch (err) {
      setError(err.message || 'Erro ao buscar peças');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedGrupo('');
    setSelectedCategoria('');
    setSelectedMarca('');
    setSelectedModelo('');
    setSelectedAno('');
    setSelectedFabricante('');
    setPecas([]);
    setError('');
  };

  return (
    <>
      <Menu />
      <div className="page-wrapper menu-page">
  <div className="page-content buscarpeca-section">
              <h2 className="page-title">Catálogo de Peças</h2>
            <SearchForm
              selectedGrupo={selectedGrupo}
              setSelectedGrupo={setSelectedGrupo}
              selectedCategoria={selectedCategoria}
              setSelectedCategoria={setSelectedCategoria}
              selectedMarca={selectedMarca}
              setSelectedMarca={setSelectedMarca}
              selectedModelo={selectedModelo}
              setSelectedModelo={setSelectedModelo}
              selectedAno={selectedAno}
              setSelectedAno={setSelectedAno}
              selectedFabricante={selectedFabricante}
              setSelectedFabricante={setSelectedFabricante}
              grupos={grupos}
              todasPecas={todasPecas}
              marcas={marcas}
              modelos={modelos}
              anos={anos}
              fabricantes={fabricantes}
              onSearch={handleSearch}
              onClear={handleClear}
              loading={loading}
              error={error}
            />
        </div>
      </div>

      <CompatibilityModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        title={modalTitle}
        titleIcon={modalTitle === 'Compatibilidade' ? '/check.png' : null}
      >
        {modalContent}
      </CompatibilityModal>
    </>
  );
}
