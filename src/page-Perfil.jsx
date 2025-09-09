import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './App';
import Menu from './components/Menu';
import './page-Perfil.css';

function PagePerfil() {
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  const [formData, setFormData] = useState({ nome: '', email: '', celular: '' });
  const [passwordData, setPasswordData] = useState({ senhaAtual: '', novaSenha: '', confirmNovaSenha: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (usuarioLogado) {
      setFormData({
        nome: usuarioLogado.nome || '',
        email: usuarioLogado.email || '',
        celular: usuarioLogado.celular || ''
      });
    }
  }, [usuarioLogado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // se o usuário tentou alterar senha, validar
    if (passwordData.senhaAtual || passwordData.novaSenha || passwordData.confirmNovaSenha) {
      if (passwordData.senhaAtual !== usuarioLogado.senha) {
        alert('Senha atual incorreta!');
        return;
      }
      if (passwordData.novaSenha !== passwordData.confirmNovaSenha) {
        alert('Confirmação de senha não confere!');
        return;
      }
      if (passwordData.novaSenha && passwordData.novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres!');
        return;
      }
    }

    const updatedUser = { ...usuarioLogado, ...formData };
    if (passwordData.novaSenha) updatedUser.senha = passwordData.novaSenha;

    setUsuarioLogado(updatedUser);
    localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const updatedUsuarios = usuarios.map(u => u.id === usuarioLogado.id ? updatedUser : u);
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));

    setPasswordData({ senhaAtual: '', novaSenha: '', confirmNovaSenha: '' });
    alert('Dados salvos!');
  };

  const handleCancel = () => {
    setFormData({ nome: usuarioLogado.nome || '', email: usuarioLogado.email || '', celular: usuarioLogado.celular || '' });
    setPasswordData({ senhaAtual: '', novaSenha: '', confirmNovaSenha: '' });
  };

  if (!usuarioLogado) {
    return (
      <div className="page-perfil">
        <Menu />
        <div className="perfil-container">
          <div className="perfil-error">
            <h2>Acesso Negado</h2>
            <p>Você precisa estar logado para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-perfil">
      <Menu />
      <div className="page-offset menu-page">
        <h3 className="page-heading">Meu Perfil</h3>
        <div className="perfil-card single-card">
            
          <div className="perfil-card-header">
            <h2>Informações Pessoais</h2>
          </div>

          <div className="perfil-form">
            <div className="form-group">
              <label htmlFor="nome">Nome completo</label>
              <input id="nome" name="nome" value={formData.nome} onChange={handleInputChange} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="celular">Celular</label>
              <input id="celular" name="celular" value={formData.celular} onChange={handleInputChange} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="senhaAtual">Senha atual</label>
              <input id="senhaAtual" name="senhaAtual" type="password" value={passwordData.senhaAtual} onChange={handlePasswordChange} className="form-input" placeholder="Digite sua senha atual" />
            </div>

            <div className="form-group">
              <label htmlFor="novaSenha">Nova senha</label>
              <div className="password-field">
                <input id="novaSenha" name="novaSenha" type={showPassword ? 'text' : 'password'} value={passwordData.novaSenha} onChange={handlePasswordChange} className="form-input password-input" placeholder="Digite a nova senha" />
                <span className={`car-toggle ${showPassword ? 'headlight-on' : 'headlight-off'}`} role="button" tabIndex={0} onClick={()=> setShowPassword(s => !s)} onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') setShowPassword(s => !s); }} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Car main body */}
                    <path d="M28 8c0-1.1-.9-2-2-2h-2l-1-2c-.5-.9-1.4-1.5-2.4-1.5H11.4c-1 0-1.9.6-2.4 1.5l-1 2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1h1c1.1 0 2-.9 2-2V8z" fill={showPassword ? '#3B82F6' : '#4A5568'} className="car-body"/>
                    
                    {/* Car roof/windows */}
                    <path d="M24 6H8l1.5-1.5c.3-.3.7-.5 1.1-.5h9.8c.4 0 .8.2 1.1.5L24 6z" fill={showPassword ? '#1E40AF' : '#2D3748'} className="car-roof"/>
                    
                    {/* Front windshield */}
                    <path d="M10.5 4.5L9 6h3l1-1.5h-2.5z" fill="#63B3ED" opacity="0.3"/>
                    
                    {/* Wheels with rims */}
                    <circle cx="9" cy="16" r="2.5" fill="#2D3748"/>
                    <circle cx="9" cy="16" r="1.5" fill={showPassword ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                    <circle cx="23" cy="16" r="2.5" fill="#2D3748"/>
                    <circle cx="23" cy="16" r="1.5" fill={showPassword ? '#60A5FA' : '#718096'} className="wheel-rim"/>
                    
                    {/* Front grille */}
                    <rect x="4" y="9" width="2" height="4" fill={showPassword ? '#1E40AF' : '#2D3748'} className="car-grille"/>
                    
                    {/* Headlights */}
                    <circle cx="5" cy="10" r="2" fill={showPassword ? '#FED7AA' : '#E2E8F0'} className="headlight-main"/>
                    
                    {/* Headlight beam effect when on */}
                    {showPassword && (
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
                    <circle cx="5" cy="13.5" r="0.8" fill={showPassword ? '#FEF3C7' : '#CBD5E0'}/>
                    
                    {/* Car details - door handle */}
                    <rect x="15" y="11" width="1" height="0.5" fill={showPassword ? '#1E40AF' : '#2D3748'} className="door-handle"/>
                    
                    {/* Side mirror */}
                    <ellipse cx="7.5" cy="8.5" rx="0.8" ry="0.5" fill={showPassword ? '#3B82F6' : '#4A5568'} className="side-mirror"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmNovaSenha">Confirme a nova senha</label>
              <input id="confirmNovaSenha" name="confirmNovaSenha" type="password" value={passwordData.confirmNovaSenha} onChange={handlePasswordChange} className="form-input" placeholder="Confirme a nova senha" />
            </div>

            <div className="form-actions">
              <button className="btn-save" onClick={handleSave}>Salvar</button>
              <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagePerfil;