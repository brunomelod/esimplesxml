import axios from 'axios';

const API_BASE_URL = 'https://xmls-api.esimplesauditor.com.br';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
});

export const createClient = async (clientData) => {
  try {
    const response = await api.post('/create_client', clientData);
    return { success: true, data: response.data };
  } catch (error) {
    let errorMessage = 'Erro ao criar cliente';
    
    // Tratamento específico para erro 500
    if (error.response?.status === 500) {
      errorMessage = 'Erro interno do servidor. Tente novamente em alguns instantes.';
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      status: error.response?.status
    };
  }
};

export const viewClient = async (cnpj) => {
  try {
    const response = await api.get(`/view_client/${cnpj}`);
    return { success: true, data: response.data };
  } catch (error) {
    // Se for 404, trata como cliente não encontrado
    if (error.response?.status === 404) {
      return { 
        success: true, 
        data: null,
        message: 'Cliente não localizado na base de dados'
      };
    }
    
    // Para outros erros, retorna mensagem de erro
    let errorMessage = 'Erro ao consultar cliente';
    
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
};
