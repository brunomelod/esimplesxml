import React, { useState } from 'react';
import { createClient } from '../services/api';

const CreateClient = () => {
  const [formData, setFormData] = useState({
    cnpj: '',
    company_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCNPJ = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CNPJ
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({
      ...prev,
      cnpj: formatted
    }));
  };

  const validateForm = () => {
    if (!formData.cnpj || formData.cnpj.length < 18) {
      setResult({
        type: 'error',
        message: 'Por favor, insira um CNPJ válido (14 dígitos)'
      });
      return false;
    }
    
    if (!formData.company_name.trim()) {
      setResult({
        type: 'error',
        message: 'Por favor, insira o nome da empresa'
      });
      return false;
    }
    
    return true;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCNPJDisplay = (cnpj) => {
    if (!cnpj) return 'N/A';
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Remove formatação do CNPJ para envio
    const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
    
    const clientData = {
      cnpj: cnpjNumbers,
      company_name: formData.company_name.trim()
    };

    const response = await createClient(clientData);
    
    setLoading(false);
    
    if (response.success) {
      // Verificar se é um cliente já cadastrado (baseado na estrutura da resposta)
      const isExistingClient = response.data && response.data.id && response.data.created_at;
      
      if (isExistingClient) {
        setResult({
          type: 'info',
          message: 'Cliente já cadastrado em nossa base',
          data: response.data,
          isExistingClient: true
        });
      } else {
        setResult({
          type: 'success',
          message: '🎉 Cliente criado com sucesso!',
          data: response.data
        });
        // Limpar formulário após sucesso
        setFormData({
          cnpj: '',
          company_name: ''
        });
      }
    } else {
      const isServerError = response.status === 500;
      setResult({
        type: 'error',
        message: `❌ ${response.error}`,
        showRetry: true,
        isServerError: isServerError
      });
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '25px', color: '#333', fontSize: '1.8rem' }}>
        Cadastrar Novo Cliente
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cnpj">CNPJ *</label>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleCNPJChange}
            placeholder="00.000.000/0000-00"
            maxLength="18"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company_name">Nome da Empresa *</label>
          <input
            type="text"
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleInputChange}
            placeholder="Digite o nome da empresa"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Cadastrando...
            </div>
          ) : (
            'Cadastrar Cliente'
          )}
        </button>
      </form>

      {result && (
        <div className={`result ${result.type}`}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
            {result.isExistingClient ? 'ℹ️ ' : ''}{result.message}
            {result.isServerError && (
              <span style={{ 
                display: 'inline-block', 
                marginLeft: '10px', 
                padding: '4px 8px', 
                background: '#ff6b6b', 
                color: 'white', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                fontWeight: '500'
              }}>
                ERRO 500
              </span>
            )}
          </p>
          
          {result.data && (
            <div className="client-info">
              <h3>📋 {result.isExistingClient ? 'Dados do Cliente:' : 'Dados do Cliente Cadastrado:'}</h3>
              <p><strong>Empresa:</strong> {result.data.company_name || 'N/A'}</p>
              <p><strong>CNPJ:</strong> {formatCNPJDisplay(result.data.cnpj)}</p>
              {result.isExistingClient && (
                <p><strong>Data de Cadastro:</strong> {formatDate(result.data.created_at)}</p>
              )}
            </div>
          )}
          
          {result.showRetry && (
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '1.1rem' }}>
                {result.isServerError ? '🚨 Erro do Servidor:' : '🔧 Possíveis soluções:'}
              </h4>
              <ul style={{ margin: '0 0 15px 0', paddingLeft: '20px', color: '#666' }}>
                {result.isServerError ? (
                  <>
                    <li>O servidor está temporariamente indisponível</li>
                    <li>Aguarde alguns minutos e tente novamente</li>
                    <li>Se o problema persistir, entre em contato com o suporte</li>
                    <li>Verifique se o CNPJ está no formato correto</li>
                  </>
                ) : (
                  <>
                    <li>Verifique sua conexão com a internet</li>
                    <li>Tente novamente em alguns instantes</li>
                    <li>Confirme se o CNPJ já não está cadastrado</li>
                    <li>Verifique se todos os campos estão preenchidos corretamente</li>
                  </>
                )}
              </ul>
              <button 
                onClick={() => {
                  setResult(null);
                  handleSubmit({ preventDefault: () => {} });
                }}
                style={{
                  background: 'linear-gradient(135deg, #2f9a45 0%, #2a8a3f 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                🔄 Tentar Novamente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateClient;
