import React, { useContext, useState } from 'react';
import { AuthContext } from './App';
import Menu from './components/Menu';
import './page-Perfil.css';

function PagePerfil() {
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: usuarioLogado?.nome || '',
    email: usuarioLogado?.email || '',
    celular: usuarioLogado?.celular || ''
  });
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmNovaSenha: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Atualizar os dados do usuário
    const updatedUser = { ...usuarioLogado, ...formData };
    setUsuarioLogado(updatedUser);
    localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
    
    // Atualizar também na lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const updatedUsuarios = usuarios.map(user => 
      user.id === usuarioLogado.id ? updatedUser : user
    );
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));
    
    setEditMode(false);
    console.log('Dados salvos:', updatedUser);
  };

  const handlePasswordSave = () => {
    if (passwordData.senhaAtual !== usuarioLogado.senha) {
      alert('Senha atual incorreta!');
      return;
    }
    
    if (passwordData.novaSenha !== passwordData.confirmNovaSenha) {
      alert('Confirmação de senha não confere!');
      return;
    }
    
    if (passwordData.novaSenha.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres!');
      return;
    }

    // Atualizar a senha
    const updatedUser = { ...usuarioLogado, senha: passwordData.novaSenha };
    setUsuarioLogado(updatedUser);
    localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));
    
    // Atualizar também na lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const updatedUsuarios = usuarios.map(user => 
      user.id === usuarioLogado.id ? updatedUser : user
    );
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));
    
    setPasswordData({
      senhaAtual: '',
      novaSenha: '',
      confirmNovaSenha: ''
    });
    setPasswordMode(false);
    alert('Senha alterada com sucesso!');
  };

  const handleCancel = () => {
    setFormData({
      nome: usuarioLogado?.nome || '',
      email: usuarioLogado?.email || '',
      celular: usuarioLogado?.celular || ''
    });
    setEditMode(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      senhaAtual: '',
      novaSenha: '',
      confirmNovaSenha: ''
    });
    setPasswordMode(false);
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
        <div className="perfil-header">
          <h1 className="page-heading">Meu Perfil</h1>
          <p className="perfil-subtitle">Gerencie suas informações pessoais</p>
        </div>

        <div className="perfil-content">
          <div className="perfil-cards-row">
            <div className="perfil-card">
              <div className="perfil-card-header">
                <h2>Informações Pessoais</h2>
                {!editMode ? (
                  <button className="btn-edit" onClick={() => setEditMode(true)}>
                    Editar
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="btn-save" onClick={handleSave}>
                      Salvar
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="perfil-form">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  {editMode ? (
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{usuarioLogado.nome}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  {editMode ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-value">{usuarioLogado.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="celular">Celular</label>
                  {editMode ? (
                    <input
                      type="tel"
                      id="celular"
                      name="celular"
                      value={formData.celular}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="(11) 99999-9999"
                    />
                  ) : (
                    <div className="form-value">{usuarioLogado.celular || 'Não informado'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="perfil-card">
              <div className="perfil-card-header">
                <h2>Status da Conta</h2>
              </div>
              <div className="perfil-status">
                <div className="status-item">
                  <span className="status-label">Tipo de Conta:</span>
                  <span className={`status-value ${usuarioLogado.isPro ? 'pro' : 'free'}`}>
                    {usuarioLogado.isPro ? 'PRO' : 'Gratuita'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="status-label">Data de Cadastro:</span>
                  <span className="status-value">
                    {usuarioLogado.dataCadastro || 'Não disponível'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="perfil-card">
            <div className="perfil-card-header">
              <h2>Alterar Senha</h2>
              {!passwordMode ? (
                <button className="btn-edit" onClick={() => setPasswordMode(true)}>
                  Alterar
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-save" onClick={handlePasswordSave}>
                    Salvar
                  </button>
                  <button className="btn-cancel" onClick={handlePasswordCancel}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {passwordMode && (
              <div className="perfil-form">
                <div className="form-group">
                  <label htmlFor="senhaAtual">Senha Atual</label>
                  <input
                    type="password"
                    id="senhaAtual"
                    name="senhaAtual"
                    value={passwordData.senhaAtual}
                    onChange={handlePasswordChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novaSenha">Nova Senha</label>
                  <input
                    type="password"
                    id="novaSenha"
                    name="novaSenha"
                    value={passwordData.novaSenha}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmNovaSenha">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    id="confirmNovaSenha"
                    name="confirmNovaSenha"
                    value={passwordData.confirmNovaSenha}
                    onChange={handlePasswordChange}
                    className="form-input"
                    placeholder="Digite a nova senha novamente"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagePerfil;