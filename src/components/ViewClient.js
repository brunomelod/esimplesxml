import React, { useState } from 'react';
import { viewClient } from '../services/api';

const ViewClient = () => {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    setCnpj(formatted);
  };

  const validateCNPJ = () => {
    if (!cnpj || cnpj.length < 18) {
      setResult({
        type: 'error',
        message: 'Por favor, insira um CNPJ válido (14 dígitos)'
      });
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!validateCNPJ()) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Remove formatação do CNPJ para consulta
    const cnpjNumbers = cnpj.replace(/\D/g, '');
    
    const response = await viewClient(cnpjNumbers);
    
    setLoading(false);
    
    if (response.success) {
      if (response.data) {
        setResult({
          type: 'success',
          message: '🎉 Cliente encontrado com sucesso!',
          data: response.data
        });
      } else {
        // Cliente não encontrado (404)
        setResult({
          type: 'info',
          message: '🔍 Cliente não localizado na base de dados',
          showTip: true
        });
      }
    } else {
      setResult({
        type: 'error',
        message: `❌ ${response.error}`,
        showRetry: true
      });
    }
  };

  const handleClear = () => {
    setCnpj('');
    setResult(null);
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '25px', color: '#333', fontSize: '1.8rem' }}>
        Consultar Cliente
      </h2>
      
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label htmlFor="cnpj-search">CNPJ *</label>
          <input
            type="text"
            id="cnpj-search"
            value={cnpj}
            onChange={handleCNPJChange}
            placeholder="00.000.000/0000-00"
            maxLength="18"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            className="btn"
            disabled={loading}
            style={{ flex: 1 }}
          >
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                Consultando...
              </div>
            ) : (
              'Consultar Cliente'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleClear}
            className="btn btn-clear"
            disabled={loading}
            style={{ flex: 1 }}
          >
            Limpar
          </button>
        </div>
      </form>

      {result && (
        <div className={`result ${result.type}`}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px' }}>
            {result.message}
          </p>
          
          {result.data && (
            <div className="client-info">
              <h3>📋 Informações do Cliente:</h3>
              {typeof result.data === 'object' ? (
                Object.entries(result.data).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                  </p>
                ))
              ) : (
                <p><strong>Dados:</strong> {JSON.stringify(result.data)}</p>
              )}
            </div>
          )}
          
          {result.showTip && (
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '1.1rem' }}>
                💡 O que você pode fazer:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
                <li>Verifique se o CNPJ está correto</li>
                <li>Confirme se o cliente já foi cadastrado</li>
                <li>Use a aba "Cadastrar Cliente" para criar um novo registro</li>
              </ul>
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
                🔧 Possíveis soluções:
              </h4>
              <ul style={{ margin: '0 0 15px 0', paddingLeft: '20px', color: '#666' }}>
                <li>Verifique sua conexão com a internet</li>
                <li>Tente novamente em alguns instantes</li>
                <li>Confirme se o CNPJ está no formato correto</li>
              </ul>
              <button 
                onClick={() => {
                  setResult(null);
                  handleSearch({ preventDefault: () => {} });
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

      {!result && !loading && (
        <div className="result info">
          <p>
            <strong>Como usar:</strong> Digite o CNPJ do cliente que deseja consultar 
            e clique em "Consultar Cliente". O sistema verificará se o cliente está 
            cadastrado na base de dados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewClient;
