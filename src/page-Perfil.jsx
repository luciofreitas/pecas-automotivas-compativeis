import React, { useContext, useState } from 'react';
import { AuthContext } from './App';
import Menu from './components/Menu';
import './page-Perfil.css';

function PagePerfil() {
  const { usuarioLogado, setUsuarioLogado } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
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
    // Se o usuário preencheu qualquer campo de senha, validar e incluir na atualização
    if (passwordData.senhaAtual || passwordData.novaSenha || passwordData.confirmNovaSenha) {
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
    }

    const updatedUser = { ...usuarioLogado, ...formData };

    if (passwordData.novaSenha) {
      updatedUser.senha = passwordData.novaSenha;
    }

    setUsuarioLogado(updatedUser);
    localStorage.setItem('usuarioLogado', JSON.stringify(updatedUser));

    // Atualizar também na lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const updatedUsuarios = usuarios.map(user => 
      user.id === usuarioLogado.id ? updatedUser : user
    );
    localStorage.setItem('usuarios', JSON.stringify(updatedUsuarios));

    // limpar estado de senha e fechar edição
    setPasswordData({ senhaAtual: '', novaSenha: '', confirmNovaSenha: '' });
    setEditMode(false);
    console.log('Dados salvos:', updatedUser);
  };

  const handlePasswordSave = () => {
  // function removed - password handling now integrated in handleSave
  };

  const handleCancel = () => {
    setFormData({
      nome: usuarioLogado?.nome || '',
      email: usuarioLogado?.email || '',
      celular: usuarioLogado?.celular || ''
    });
  // reset password inputs as well
  setPasswordData({ senhaAtual: '', novaSenha: '', confirmNovaSenha: '' });
  setEditMode(false);
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
        <div className="perfil-content">
          <div className="perfil-cards-row">
            <div className="perfil-card">
              <div className="perfil-card-header">
                <h2>Dados da Conta</h2>
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
                
                {editMode && (
                  <>
                    <hr />
                    <h3 className="subsection-title">Alterar Senha</h3>
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
                  </>
                )}
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

          {/* password card removed - password fields integrated into Dados da Conta */}
        </div>
      </div>
    </div>
  );
}

export default PagePerfil;