import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import MenuLogin from './components/MenuLogin';
import './components/Menu.css';
import './page-Login.css';
import usuariosData from './usuarios.json';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';
function Login() {
  // Estados para login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estados para registro
  const [regNome, setRegNome] = useState('');
  const [regCelular, setRegCelular] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSenha, setRegSenha] = useState('');
  const [regConfirmSenha, setRegConfirmSenha] = useState('');
  const [regError, setRegError] = useState('');
  // Estados para controlar o foco dos inputs
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusSenha, setFocusSenha] = useState(false);
  const [focusRegNome, setFocusRegNome] = useState(false);
  const [focusRegCelular, setFocusRegCelular] = useState(false);
  const [focusRegEmail, setFocusRegEmail] = useState(false);
  const [focusRegSenha, setFocusRegSenha] = useState(false);
  const [focusRegConfirmSenha, setFocusRegConfirmSenha] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);
  const [showPasswordConfirmRegister, setShowPasswordConfirmRegister] = useState(false);
  const navigate = useNavigate();
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  

  // Função para obter usuários
  function getUsuarios() {
    const usuarios = localStorage.getItem('usuarios');
    if (usuarios) {
      try { return JSON.parse(usuarios); } catch(e) { return []; }
    }
    // seed initial users from usuarios.json (normalize email and celular)
    try{
      const seeded = (usuariosData || []).map(u => ({
        id: u.id,
        nome: u.nome || '',
        celular: String(u.celular || '').replace(/\D/g, ''),
        email: String(u.email || '').trim().toLowerCase(),
        senha: String(u.senha || '')
      }));
      localStorage.setItem('usuarios', JSON.stringify(seeded));
      return seeded;
    }catch(e){
      return [];
    }
  }

  // Salvar novo usuário no localStorage
  function saveUsuario(novoUsuario) {
    const usuarios = getUsuarios();
    const normalized = {
      ...novoUsuario,
      email: String(novoUsuario.email || '').trim().toLowerCase(),
      celular: String(novoUsuario.celular || '').replace(/\D/g, '')
    };
  const updated = [...usuarios, normalized];
  localStorage.setItem('usuarios', JSON.stringify(updated));
  return normalized;
  }

  // Handler de login
  function handleLogin(e) {
    e.preventDefault();
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedSenha = String(senha || '');
    const users = getUsuarios();
    console.log('[Login] attempt', { normalizedEmail, normalizedSenha, users });
    const usuario = users.find(u => String(u.email || '').trim().toLowerCase() === normalizedEmail && String(u.senha || '') === normalizedSenha);
    if (!usuario) {
      // find close matches for debugging
      const userByEmail = users.find(u => String(u.email || '').trim().toLowerCase() === normalizedEmail);
      console.warn('[Login] no match; userByEmail=', userByEmail);
      setError('E-mail ou senha incorretos.');
      return;
    }
  setError('');
  setIsLoggedIn(true);
  setUsuarioLogado(usuario);
  try { localStorage.setItem('usuarioLogado', JSON.stringify(usuario)); } catch (e) { console.warn('Failed to persist usuarioLogado to localStorage', e); }
  navigate('/'); // Redireciona para a página principal após login
  }

  // Handler de registro
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
    const saved = saveUsuario(novoUsuario);
    setRegError('');
    // Limpar os campos do registro
    setRegNome(''); 
    setRegCelular(''); 
    setRegEmail(''); 
    setRegSenha(''); 
    setRegConfirmSenha('');
    // Mostrar mensagem de sucesso sem fazer login automático
    alert('Registro realizado com sucesso! Agora faça login com suas credenciais.');
    // Não redirecionar - usuario fica na mesma página para fazer login manual
  }

  // Função para formatar celular (ex: (11) 99999-9999)
  function formatCelular(value) {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    if (digits.length > 0) {
      formatted += '(' + digits.substring(0, 2);
      if (digits.length >= 2) {
        formatted += ') ';
        formatted += digits.substring(2, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 11);
      }
    }
    return formatted;
  }

  // Formulário de login/registro
  return (
    <>
      <MenuLogin />
      <div className="">
        <div className="login-page-wrapper">
          <div className="login-content-container">
            <h2 className="page-heading login-heading page-title">Faça o Login ou Cadastro</h2>
            <div className="form-containers">
              {/* Entrar Container */}
              <div className="login-form-card">
                <div>
                  <h2 className="login-section-title">Entrar</h2>
                </div>
                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-control w-full login-form-control">
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <div className="password-field">
                      <input
                        id="senha"
                        name="senha"
                        type={showPasswordLogin ? 'text' : 'password'}
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        className="form-input password-input"
                        placeholder="Senha"
                        autoComplete="current-password"
                      />
                      <span className={`car-toggle ${showPasswordLogin ? 'headlight-on' : 'headlight-off'}`} role="button" tabIndex={0} onClick={()=> setShowPasswordLogin(s => !s)} onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') setShowPasswordLogin(s => !s); }} aria-label={showPasswordLogin ? 'Ocultar senha' : 'Mostrar senha'}>
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Car main body */}
                          <path d="M28 8c0-1.1-.9-2-2-2h-2l-1-2c-.5-.9-1.4-1.5-2.4-1.5H11.4c-1 0-1.9.6-2.4 1.5l-1 2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8z" fill={showPasswordLogin ? '#3B82F6' : '#4A5568'} className="car-body"/>
                          
                          {/* Car roof/windows */}
                          <path d="M24 6H8l1.5-1.5c.3-.3.7-.5 1.1-.5h9.8c.4 0 .8.2 1.1.5L24 6z" fill={showPasswordLogin ? '#1E40AF' : '#2D3748'} className="car-roof"/>
                          
                          {/* Front windshield */}
                          <path d="M10.5 4.5L9 6h3l1-1.5h-2.5z" fill="#63B3ED" opacity="0.3"/>
                          
                          {/* Wheels with rims */}
                          <circle cx="9" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="9" cy="16" r="1.5" fill={showPasswordLogin ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          <circle cx="23" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="23" cy="16" r="1.5" fill={showPasswordLogin ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          
                          {/* Front grille */}
                          <rect x="4" y="9" width="2" height="4" fill={showPasswordLogin ? '#1E40AF' : '#2D3748'} className="car-grille"/>
                          
                          {/* Headlights */}
                          <circle cx="5" cy="10" r="2" fill={showPasswordLogin ? '#FED7AA' : '#E2E8F0'} className="headlight-main"/>
                          
                          {/* Headlight beam effect when on */}
                          {showPasswordLogin && (
                            <>
                              {/* Main beam */}
                              <ellipse cx="2" cy="10" rx="4" ry="6" fill="#FED7AA" opacity="0.15" className="headlight-beam"/>
                              {/* Inner glow */}
                              <circle cx="5" cy="10" r="2.8" fill="#FBBF24" opacity="0.25" className="headlight-glow-1"/>
                              <circle cx="5" cy="10" r="2.2" fill="#F59E0B" opacity="0.4" className="headlight-glow-2"/>
                              {/* Bright center */}
                              <circle cx="5" cy="10" r="1.3" fill="#FCD34D" className="headlight-bright"/>

                              {/* Short radial strokes (rays) coming out of the headlight to emphasize light */}
                              <g className="headlight-rays" stroke="#FDE68A" strokeWidth="0.8" strokeLinecap="round" opacity="0.95">
                                <line x1="7" y1="9" x2="11" y2="7" className="ray ray-1" />
                                <line x1="7" y1="10" x2="12" y2="10" className="ray ray-2" />
                                <line x1="7" y1="11" x2="11" y2="13" className="ray ray-3" />
                                <line x1="6" y1="8.2" x2="9" y2="6" className="ray ray-4" />
                                <line x1="6" y1="11.8" x2="9" y2="14" className="ray ray-5" />
                              </g>
                            </>
                          )}
                          
                          {/* Secondary headlight/indicator */}
                          <circle cx="5" cy="13.5" r="0.8" fill={showPasswordLogin ? '#FEF3C7' : '#CBD5E0'}/>
                          
                          {/* Car details - door handle */}
                          <rect x="15" y="11" width="1" height="0.5" fill={showPasswordLogin ? '#1E40AF' : '#2D3748'} className="door-handle"/>
                          
                          {/* Side mirror */}
                          <ellipse cx="7.5" cy="8.5" rx="0.8" ry="0.5" fill={showPasswordLogin ? '#3B82F6' : '#4A5568'} className="side-mirror"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  {/* Link de recuperação de senha */}
                  <div className="login-forgot-wrapper">
                    <a href="#" className="login-forgot-link" onClick={e => { e.preventDefault(); /* implementar recuperação se necessário */ }}>
                      Esqueci minha senha
                    </a>
                  </div>
                  {error && <div className="text-red-600 text-center text-sm">{error}</div>}
                  <button type="submit" className="btn w-full login-submit">Entrar</button>
                </form>
              </div>

              {/* Registrar Container */}
              <div className="login-form-card">
                <div>
                  <h2 className="login-section-title">Registrar</h2>
                </div>
                <form onSubmit={handleRegister} className="login-form">
                  <div className="form-control w-full login-form-control">
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      value={regNome}
                      onChange={e => setRegNome(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="name"
                    />
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <input
                      type="tel"
                      placeholder="Celular"
                      value={regCelular}
                      onChange={e => setRegCelular(formatCelular(e.target.value))}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="email"
                    />
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <div className="password-field">
                      <input
                        type={showPasswordRegister ? 'text' : 'password'}
                        placeholder="Senha"
                        value={regSenha}
                        onChange={e => setRegSenha(e.target.value)}
                        className="form-input password-input"
                        autoComplete="new-password"
                      />
                      <span className={`car-toggle ${showPasswordRegister ? 'headlight-on' : 'headlight-off'}`} role="button" tabIndex={0} onClick={()=> setShowPasswordRegister(s => !s)} onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') setShowPasswordRegister(s => !s); }} aria-label={showPasswordRegister ? 'Ocultar senha' : 'Mostrar senha'}>
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Car main body */}
                          <path d="M28 8c0-1.1-.9-2-2-2h-2l-1-2c-.5-.9-1.4-1.5-2.4-1.5H11.4c-1 0-1.9.6-2.4 1.5l-1 2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8z" fill={showPasswordRegister ? '#3B82F6' : '#4A5568'} className="car-body"/>
                          
                          {/* Car roof/windows */}
                          <path d="M24 6H8l1.5-1.5c.3-.3.7-.5 1.1-.5h9.8c.4 0 .8.2 1.1.5L24 6z" fill={showPasswordRegister ? '#1E40AF' : '#2D3748'} className="car-roof"/>
                          
                          {/* Front windshield */}
                          <path d="M10.5 4.5L9 6h3l1-1.5h-2.5z" fill="#63B3ED" opacity="0.3"/>
                          
                          {/* Wheels with rims */}
                          <circle cx="9" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="9" cy="16" r="1.5" fill={showPasswordRegister ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          <circle cx="23" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="23" cy="16" r="1.5" fill={showPasswordRegister ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          
                          {/* Front grille */}
                          <rect x="4" y="9" width="2" height="4" fill={showPasswordRegister ? '#1E40AF' : '#2D3748'} className="car-grille"/>
                          
                          {/* Headlights */}
                          <circle cx="5" cy="10" r="2" fill={showPasswordRegister ? '#FED7AA' : '#E2E8F0'} className="headlight-main"/>
                          
                          {/* Headlight beam effect when on */}
                          {showPasswordRegister && (
                            <>
                              {/* Main beam */}
                              <ellipse cx="2" cy="10" rx="4" ry="6" fill="#FED7AA" opacity="0.15" className="headlight-beam"/>
                              {/* Inner glow */}
                              <circle cx="5" cy="10" r="2.8" fill="#FBBF24" opacity="0.25" className="headlight-glow-1"/>
                              <circle cx="5" cy="10" r="2.2" fill="#F59E0B" opacity="0.4" className="headlight-glow-2"/>
                              {/* Bright center */}
                              <circle cx="5" cy="10" r="1.3" fill="#FCD34D" className="headlight-bright"/>

                              {/* Short radial strokes (rays) coming out of the headlight to emphasize light */}
                              <g className="headlight-rays" stroke="#FDE68A" strokeWidth="0.8" strokeLinecap="round" opacity="0.95">
                                <line x1="7" y1="9" x2="11" y2="7" className="ray ray-1" />
                                <line x1="7" y1="10" x2="12" y2="10" className="ray ray-2" />
                                <line x1="7" y1="11" x2="11" y2="13" className="ray ray-3" />
                                <line x1="6" y1="8.2" x2="9" y2="6" className="ray ray-4" />
                                <line x1="6" y1="11.8" x2="9" y2="14" className="ray ray-5" />
                              </g>
                            </>
                          )}
                          
                          {/* Secondary headlight/indicator */}
                          <circle cx="5" cy="13.5" r="0.8" fill={showPasswordRegister ? '#FEF3C7' : '#CBD5E0'}/>
                          
                          {/* Car details - door handle */}
                          <rect x="15" y="11" width="1" height="0.5" fill={showPasswordRegister ? '#1E40AF' : '#2D3748'} className="door-handle"/>
                          
                          {/* Side mirror */}
                          <ellipse cx="7.5" cy="8.5" rx="0.8" ry="0.5" fill={showPasswordRegister ? '#3B82F6' : '#4A5568'} className="side-mirror"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <div className="password-field">
                      <input
                        type={showPasswordConfirmRegister ? 'text' : 'password'}
                        placeholder="Confirmar Senha"
                        value={regConfirmSenha}
                        onChange={e => setRegConfirmSenha(e.target.value)}
                        className="form-input password-input"
                        autoComplete="new-password"
                      />
                      <span className={`car-toggle ${showPasswordConfirmRegister ? 'headlight-on' : 'headlight-off'}`} role="button" tabIndex={0} onClick={()=> setShowPasswordConfirmRegister(s => !s)} onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') setShowPasswordConfirmRegister(s => !s); }} aria-label={showPasswordConfirmRegister ? 'Ocultar senha' : 'Mostrar senha'}>
                        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Car main body */}
                          <path d="M28 8c0-1.1-.9-2-2-2h-2l-1-2c-.5-.9-1.4-1.5-2.4-1.5H11.4c-1 0-1.9.6-2.4 1.5l-1 2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8z" fill={showPasswordConfirmRegister ? '#3B82F6' : '#4A5568'} className="car-body"/>
                          
                          {/* Car roof/windows */}
                          <path d="M24 6H8l1.5-1.5c.3-.3.7-.5 1.1-.5h9.8c.4 0 .8.2 1.1.5L24 6z" fill={showPasswordConfirmRegister ? '#1E40AF' : '#2D3748'} className="car-roof"/>
                          
                          {/* Front windshield */}
                          <path d="M10.5 4.5L9 6h3l1-1.5h-2.5z" fill="#63B3ED" opacity="0.3"/>
                          
                          {/* Wheels with rims */}
                          <circle cx="9" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="9" cy="16" r="1.5" fill={showPasswordConfirmRegister ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          <circle cx="23" cy="16" r="2.5" fill="#2D3748"/>
                          <circle cx="23" cy="16" r="1.5" fill={showPasswordConfirmRegister ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                          
                          {/* Front grille */}
                          <rect x="4" y="9" width="2" height="4" fill={showPasswordConfirmRegister ? '#1E40AF' : '#2D3748'} className="car-grille"/>
                          
                          {/* Headlights */}
                          <circle cx="5" cy="10" r="2" fill={showPasswordConfirmRegister ? '#FED7AA' : '#E2E8F0'} className="headlight-main"/>
                          
                          {/* Headlight beam effect when on */}
                          {showPasswordConfirmRegister && (
                            <>
                              {/* Main beam */}
                              <ellipse cx="2" cy="10" rx="4" ry="6" fill="#FED7AA" opacity="0.15" className="headlight-beam"/>
                              {/* Inner glow */}
                              <circle cx="5" cy="10" r="2.8" fill="#FBBF24" opacity="0.25" className="headlight-glow-1"/>
                              <circle cx="5" cy="10" r="2.2" fill="#F59E0B" opacity="0.4" className="headlight-glow-2"/>
                              {/* Bright center */}
                              <circle cx="5" cy="10" r="1.3" fill="#FCD34D" className="headlight-bright"/>

                              {/* Short radial strokes (rays) coming out of the headlight to emphasize light */}
                              <g className="headlight-rays" stroke="#FDE68A" strokeWidth="0.8" strokeLinecap="round" opacity="0.95">
                                <line x1="7" y1="9" x2="11" y2="7" className="ray ray-1" />
                                <line x1="7" y1="10" x2="12" y2="10" className="ray ray-2" />
                                <line x1="7" y1="11" x2="11" y2="13" className="ray ray-3" />
                                <line x1="6" y1="8.2" x2="9" y2="6" className="ray ray-4" />
                                <line x1="6" y1="11.8" x2="9" y2="14" className="ray ray-5" />
                              </g>
                            </>
                          )}
                          
                          {/* Secondary headlight/indicator */}
                          <circle cx="5" cy="13.5" r="0.8" fill={showPasswordConfirmRegister ? '#FEF3C7' : '#CBD5E0'}/>
                          
                          {/* Car details - door handle */}
                          <rect x="15" y="11" width="1" height="0.5" fill={showPasswordConfirmRegister ? '#1E40AF' : '#2D3748'} className="door-handle"/>
                          
                          {/* Side mirror */}
                          <ellipse cx="7.5" cy="8.5" rx="0.8" ry="0.5" fill={showPasswordConfirmRegister ? '#3B82F6' : '#4A5568'} className="side-mirror"/>
                        </svg>
                      </span>
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
    </>
  );
}

export default Login;