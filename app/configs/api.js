import axios from 'axios';

// Obtém o token do localStorage
const token = JSON.parse(localStorage.getItem('@user'))?.tokenJWT;

// Cria a instância do Axios com configuração
const api = axios.create({
  baseURL: 'http://localhost:8080', // URL da API
  headers: {
    Authorization: `Bearer ${token}`, // Corrigido para interpolar o valor do token
    'Content-Type': 'application/json',
  },
});

export default api;
