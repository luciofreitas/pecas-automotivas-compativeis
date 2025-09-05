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
      <div className="page-offset">
        <div className="login-page-wrapper">
          <div className="login-content-container">
            <h2 className="page-heading login-heading">Faça o Login ou Cadastro</h2>
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
                    <input
                      type="password"
                      placeholder="Senha"
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="current-password"
                    />
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
                    <input
                      type="password"
                      placeholder="Senha"
                      value={regSenha}
                      onChange={e => setRegSenha(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="form-control w-full Login-form-control">
                    <input
                      type="password"
                      placeholder="Confirmar Senha"
                      value={regConfirmSenha}
                      onChange={e => setRegConfirmSenha(e.target.value)}
                      className="input input-bordered w-full bg-white text-black"
                      autoComplete="new-password"
                    />
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