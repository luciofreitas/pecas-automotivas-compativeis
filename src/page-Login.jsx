import React, { useState, useContext } from 'react';
import MenuLogin from './components/MenuLogin';
// Removido import './components/Menu.css' - não é necessário e causa conflito de cores
import './page-Login.css';
import usuariosData from './usuarios.json';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const [regNome, setRegNome] = useState('');
  const [regCelular, setRegCelular] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmSenha, setRegConfirmSenha] = useState('');
  const [regError, setRegError] = useState('');

  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordConfirmRegister, setShowPasswordConfirmRegister] = useState(false);

  const navigate = useNavigate();
  const { setUsuarioLogado } = useContext(AuthContext || {});

  function getUsuarios() {
    try {
      const raw = localStorage.getItem('usuarios');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    // Seed from usuarios.json if available
    try {
      return (usuariosData || []).map(u => ({
        id: u.id,
        nome: u.nome || '',
        celular: String(u.celular || '').replace(/\D/g, ''),
        email: String(u.email || '').trim().toLowerCase(),
        senha: String(u.senha || '')
      }));
    } catch (e) {
      return [];
    }
  }

  function saveUsuario(novoUsuario) {
    const usuarios = getUsuarios();
    const normalized = {
      ...novoUsuario,
      email: String(novoUsuario.email || '').trim().toLowerCase(),
      celular: String(novoUsuario.celular || '').replace(/\D/g, '')
    };
    const updated = [...usuarios, normalized];
    try { localStorage.setItem('usuarios', JSON.stringify(updated)); } catch (e) {}
    return normalized;
  }

  function handleLogin(e) {
    e.preventDefault();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedSenha = String(senha || '');
    const usuario = getUsuarios().find(u => String(u.email || '').trim().toLowerCase() === normalizedEmail && String(u.senha || '') === normalizedSenha);
    if (!usuario) {
      setError('E-mail ou senha incorretos.');
      return;
    }
    setError('');
    if (setUsuarioLogado) setUsuarioLogado(usuario);
    try { localStorage.setItem('usuarioLogado', JSON.stringify(usuario)); } catch (e) {}
    navigate('/');
  }

  function handleRegister(e) {
    e.preventDefault();
    if (!regNome || !regSenha || !regEmail || !regCelular || !regConfirmSenha) {
      setRegError('Preencha todos os campos.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(regEmail)) {
      setRegError('E-mail inválido.');
      return;
    }
    if (!/^\d{8,}$/.test(regCelular.replace(/\D/g, ''))) {
      setRegError('Celular inválido.');
      return;
    }
    if (regSenha !== regConfirmSenha) {
      setRegError('As senhas não coincidem.');
      return;
    }
    const normalizedRegEmail = String(regEmail || '').trim().toLowerCase();
    if (getUsuarios().some(u => String(u.email || '').trim().toLowerCase() === normalizedRegEmail)) {
      setRegError('Já existe um usuário com este e-mail.');
      return;
    }
    const id = Date.now();
    const novoUsuario = {
      id,
      nome: regNome,
      celular: regCelular.replace(/\D/g, ''),
      email: normalizedRegEmail,
      senha: regSenha
    };
    saveUsuario(novoUsuario);
    setRegError('');
    setRegNome(''); setRegCelular(''); setRegEmail(''); setRegSenha(''); setRegConfirmSenha('');
    alert('Registro realizado com sucesso! Agora faça login com suas credenciais.');
  }

  function formatCelular(value) {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) {
      formatted += '(' + digits.substring(0, 2);
      if (digits.length >= 2) {
        formatted += ') ' + digits.substring(2, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 11);
      }
    }
    return formatted;
  }

  const ToggleCar = ({ on, onClick }) => (
    <span
      className={`car-toggle ${on ? 'headlight-on' : 'headlight-off'}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      aria-label={on ? 'Ocultar senha' : 'Mostrar senha'}
    >
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 8c0-1.1-.9-2-2-2h-2l-1-2c-.5-.9-1.4-1.5-2.4-1.5H11.4c-1 0-1.9.6-2.4 1.5l-1 2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8z" fill={on ? '#3B82F6' : '#4A5568'} className="car-body"/>
        <path d="M24 6H8l1.5-1.5c.3-.3.7-.5 1.1-.5h9.8c.4 0 .8.2 1.1.5L24 6z" fill={on ? '#1E40AF' : '#2D3748'} className="car-roof"/>
        <path d="M10.5 4.5L9 6h3l1-1.5h-2.5z" fill="#63B3ED" opacity="0.3"/>
        <circle cx="9" cy="16" r="2.5" fill="#2D3748"/>
        <circle cx="9" cy="16" r="1.5" fill={on ? '#60A5FA' : '#718096'} className="wheel-rim"/>
        <circle cx="23" cy="16" r="2.5" fill="#2D3748"/>
        <circle cx="23" cy="16" r="1.5" fill={on ? '#60A5FA' : '#718096'} className="wheel-rim"/>
        <rect x="4" y="9" width="2" height="4" fill={on ? '#1E40AF' : '#2D3748'} className="car-grille"/>
        <circle cx="5" cy="10" r="2" fill={on ? '#FED7AA' : '#E2E8F0'} className="headlight-main"/>
        {on && (
          <>
            <ellipse cx="2" cy="10" rx="4" ry="6" fill="#FED7AA" opacity="0.15" className="headlight-beam"/>
            <circle cx="5" cy="10" r="2.8" fill="#FBBF24" opacity="0.25" className="headlight-glow-1"/>
            <circle cx="5" cy="10" r="2.2" fill="#F59E0B" opacity="0.4" className="headlight-glow-2"/>
            <circle cx="5" cy="10" r="1.3" fill="#FCD34D" className="headlight-bright"/>
            <g className="headlight-rays" stroke="#FDE68A" strokeWidth="0.8" strokeLinecap="round" opacity="0.95">
              <line x1="7" y1="9" x2="11" y2="7" className="ray ray-1" />
              <line x1="7" y1="10" x2="12" y2="10" className="ray ray-2" />
              <line x1="7" y1="11" x2="11" y2="13" className="ray ray-3" />
              <line x1="6" y1="8.2" x2="9" y2="6" className="ray ray-4" />
              <line x1="6" y1="11.8" x2="9" y2="14" className="ray ray-5" />
            </g>
          </>
        )}
        <circle cx="5" cy="13.5" r="0.8" fill={on ? '#FEF3C7' : '#CBD5E0'}/>
        <rect x="15" y="11" width="1" height="0.5" fill={on ? '#1E40AF' : '#2D3748'} className="door-handle"/>
        <ellipse cx="7.5" cy="8.5" rx="0.8" ry="0.5" fill={on ? '#3B82F6' : '#4A5568'} className="side-mirror"/>
      </svg>
    </span>
  );

  return (
    <div className="page-root">
      <MenuLogin />
      <div className="page-wrapper login-page-wrapper">
        <div className="page-content login-content-container">
          <h2 className="page-heading login-heading page-title">Faça o Login ou Cadastro</h2>
          <div className="login-forms-row">
            <div className="login-form-card">
              <div><h2 className="login-section-title">Entrar</h2></div>
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-control w-full login-form-control">
                  <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="input input-bordered w-full bg-white text-black" autoComplete="username" />
                </div>
                <div className="form-control w-full Login-form-control">
                  <div className="password-field">
                    <input id="senha" name="senha" type={showPasswordLogin ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} className="form-input password-input" placeholder="Senha" autoComplete="current-password" />
                    <ToggleCar on={showPasswordLogin} onClick={() => setShowPasswordLogin(s => !s)} />
                  </div>
                </div>
                <div className="login-forgot-wrapper"><a href="#" className="login-forgot-link" onClick={e => { e.preventDefault(); }}>Esqueci minha senha</a></div>
                {error && <div className="text-red-600 text-center text-sm">{error}</div>}
                <button type="submit" className="btn w-full login-submit">Entrar</button>
              </form>
            </div>

            <div className="login-form-card">
              <div><h2 className="login-section-title">Registrar</h2></div>
              <form onSubmit={handleRegister} className="login-form">
                <div className="form-control w-full login-form-control">
                  <input type="text" placeholder="Nome Completo" value={regNome} onChange={e => setRegNome(e.target.value)} className="input input-bordered w-full bg-white text-black" autoComplete="name" />
                </div>
                <div className="form-control w-full Login-form-control">
                  <input type="tel" placeholder="Celular" value={regCelular} onChange={e => setRegCelular(formatCelular(e.target.value))} className="input input-bordered w-full bg-white text-black" autoComplete="tel" />
                </div>
                <div className="form-control w-full Login-form-control">
                  <input type="email" placeholder="E-mail" value={regEmail} onChange={e => setRegEmail(e.target.value)} className="input input-bordered w-full bg-white text-black" autoComplete="email" />
                </div>
                <div className="form-control w-full Login-form-control">
                  <div className="password-field">
                    <input type={showPasswordRegister ? 'text' : 'password'} placeholder="Senha" value={regSenha} onChange={e => setRegSenha(e.target.value)} className="form-input password-input" autoComplete="new-password" />
                    <ToggleCar on={showPasswordRegister} onClick={() => setShowPasswordRegister(s => !s)} />
                  </div>
                </div>
                <div className="form-control w-full Login-form-control">
                  <div className="password-field">
                    <input type={showPasswordConfirmRegister ? 'text' : 'password'} placeholder="Confirmar Senha" value={regConfirmSenha} onChange={e => setRegConfirmSenha(e.target.value)} className="form-input password-input" autoComplete="new-password" />
                    <ToggleCar on={showPasswordConfirmRegister} onClick={() => setShowPasswordConfirmRegister(s => !s)} />
                  </div>
                </div>
                {regError && <div className="text-red-600 text-center text-sm">{regError}</div>}
                <button type="submit" className="btn w-full login-submit">Registrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
