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
      <div className="perfil-container">
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
              <label htmlFor="senha">Senha (deixe em branco para manter)</label>
              <div className="password-field">
                <input id="senha" name="senha" type={showPassword ? 'text' : 'password'} value={passwordData.novaSenha} onChange={(e)=> setPasswordData(prev => ({ ...prev, novaSenha: e.target.value }))} className="form-input" placeholder="" />
                <span className={`car-toggle ${showPassword ? 'on' : 'off'}`} role="button" tabIndex={0} onClick={()=> setShowPassword(s => !s)} onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') setShowPassword(s => !s); }} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
                  <span className="car-body">🚗</span>
                  <span className="car-light" />
                </span>
              </div>
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