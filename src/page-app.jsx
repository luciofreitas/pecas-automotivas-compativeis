import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Login from './page-Login';
import QuemSomos from './page-QuemSomos';
import NossoProjeto from './page-NossoProjeto';
import SejaPro from './page-SejaPro';
import VersaoPro from './page-VersaoPro';
import Checkin from './page-Checkin';
import VersaoPro_Assinado from './page-VersaoPro_Assinado';
import Contato from './page-Contato';
import Parceiros from './page-Parceiros';
import ContatoLogado from './page-ContatoLogado';
import CompatibilityModal from './CompatibilityModal';
import SearchForm from './components/SearchForm';
import PecasGrid from './components/PecasGrid';
import CompatibilityGrid from './components/CompatibilityGrid';
import './page-App.css';
import './CustomDropdown.css';
import './Responsive.css';

export const AuthContext = createContext(null);

function ProtectedRoute({ children }) {
  const { usuarioLogado, authLoaded } = useContext(AuthContext) || {};
  if (!authLoaded) return null;
  if (!usuarioLogado) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

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

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('usuarioLogado');
      if (stored) {
        setUsuarioLogado(JSON.parse(stored));
        console.log('[App] hydrated usuarioLogado from localStorage');
      }
    } catch (e) {
      console.warn('Failed to parse usuarioLogado from localStorage', e);
    }
    setAuthLoaded(true);
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
    <div className="App-modal-pecas">
      <PecasGrid pecas={lista} onViewCompatibility={openModal} />
    </div>
  );

  const openModal = (pecaOrId) => {
    const peca = typeof pecaOrId === 'object' && pecaOrId ? pecaOrId : pecas.find(p => p.id === pecaOrId);
    setModalTitle('Compatibilidade');
    if (!peca || !peca.applications) {
      setModalContent(<div>Nenhuma aplicação encontrada.</div>);
      setShowModal(true);
      return;
    }

    const compatContent = (
      <div className="App-compat-wrapper">
        <div className="App-compat-header">
          <img src="/check.png" alt="Compatível" className="App-compat-checkimg" />
          <span className="App-compat-title">Compatibilidade</span>
        </div>
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
    const filtros = { grupo: selectedGrupo, categoria: selectedCategoria, marca: selectedMarca, modelo: selectedModelo, ano: selectedAno, fabricante: selectedFabricante };
    try {
      const res = await fetch('/api/pecas/filtrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filtros) });
      const data = await res.json();
      const pecasFiltradas = data.pecas || [];
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
  <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado, authLoaded, setAuthLoaded }}>
      <BrowserRouter>
        <div className="App page-offset">
          <header className="site-root-header">
            <div className="site-header-inner">
              <Menu />
            </div>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <section className="home-section">
                    <h2 className="catalog-heading">Bem-vindo ao catálogo de peças</h2>
                    <p className="App-subtext">Use o menu para navegar pelo site.</p>

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
                  </section>
                </ProtectedRoute>
              } />

              <Route path="/login" element={<Login />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/seja-pro" element={<SejaPro />} />
              <Route path="/versao-pro" element={<VersaoPro />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/versao-pro-assinado" element={<VersaoPro_Assinado />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/contato-logado" element={<ContatoLogado />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/nosso-projeto" element={<NossoProjeto />} />
            </Routes>
          </main>

          <CompatibilityModal show={showModal} onClose={() => setShowModal(false)} title={modalTitle}>
            {modalContent}
          </CompatibilityModal>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Login from './page-Login';
import QuemSomos from './page-QuemSomos';
import NossoProjeto from './page-NossoProjeto';
import SejaPro from './page-SejaPro';
import VersaoPro from './page-VersaoPro';
import Checkin from './page-Checkin';
import VersaoPro_Assinado from './page-VersaoPro_Assinado';
import Contato from './page-Contato';
import Parceiros from './page-Parceiros';
import ContatoLogado from './page-ContatoLogado';
import CompatibilityModal from './CompatibilityModal';
import SearchForm from './components/SearchForm';
import PecasGrid from './components/PecasGrid';
import CompatibilityGrid from './components/CompatibilityGrid';
import './page-app.css';
import './CustomDropdown.css';
import './Responsive.css';

export const AuthContext = createContext(null);

function ProtectedRoute({ children }) {
  const { usuarioLogado, authLoaded } = useContext(AuthContext) || {};
  if (!authLoaded) return null;
  if (!usuarioLogado) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);

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

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('usuarioLogado');
      if (stored) {
        setUsuarioLogado(JSON.parse(stored));
        console.log('[App] hydrated usuarioLogado from localStorage');
      }
    } catch (e) {
      console.warn('Failed to parse usuarioLogado from localStorage', e);
    }
    setAuthLoaded(true);
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
    <div className="App-modal-pecas">
      <PecasGrid pecas={lista} onViewCompatibility={openModal} />
    </div>
  );

  const openModal = (pecaOrId) => {
    const peca = typeof pecaOrId === 'object' && pecaOrId ? pecaOrId : pecas.find(p => p.id === pecaOrId);
    setModalTitle('Compatibilidade');
    if (!peca || !peca.applications) {
      setModalContent(<div>Nenhuma aplicação encontrada.</div>);
      setShowModal(true);
      return;
    }

    const compatContent = (
      <div className="App-compat-wrapper">
        <div className="App-compat-header">
          <img src="/check.png" alt="Compatível" className="App-compat-checkimg" />
          <span className="App-compat-title">Compatibilidade</span>
        </div>
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
    const filtros = { grupo: selectedGrupo, categoria: selectedCategoria, marca: selectedMarca, modelo: selectedModelo, ano: selectedAno, fabricante: selectedFabricante };
    try {
      const res = await fetch('/api/pecas/filtrar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(filtros) });
      const data = await res.json();
      const pecasFiltradas = data.pecas || [];
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
  <AuthContext.Provider value={{ usuarioLogado, setUsuarioLogado, authLoaded, setAuthLoaded }}>
      <BrowserRouter>
        <div className="App page-offset">
          <header className="site-root-header">
            <div className="site-header-inner">
              <Menu />
            </div>
          </header>

          <main className="app-main">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <section className="home-section">
                    <h2 className="catalog-heading">Bem-vindo ao catálogo de peças</h2>
                    <p className="App-subtext">Use o menu para navegar pelo site.</p>

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
                  </section>
                </ProtectedRoute>
              } />

              <Route path="/login" element={<Login />} />
              <Route path="/quem-somos" element={<QuemSomos />} />
              <Route path="/seja-pro" element={<SejaPro />} />
              <Route path="/versao-pro" element={<VersaoPro />} />
              <Route path="/checkin" element={<Checkin />} />
              <Route path="/versao-pro-assinado" element={<VersaoPro_Assinado />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/contato-logado" element={<ContatoLogado />} />
              <Route path="/parceiros" element={<Parceiros />} />
              <Route path="/nosso-projeto" element={<NossoProjeto />} />
            </Routes>
          </main>

          <CompatibilityModal show={showModal} onClose={() => setShowModal(false)} title={modalTitle}>
            {modalContent}
          </CompatibilityModal>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
