import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para criar instância do Axios com o token JWT
const createApi = async () => {
  try {
    // Obtém o token do AsyncStorage
    const user = await AsyncStorage.getItem('@user');
    const token = user ? JSON.parse(user)?.tokenJWT : null;

    // Cria a instância do Axios com a configuração
    const api = axios.create({
      baseURL: 'http://10.0.2.2:8080', // URL da API
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    return api;
  } catch (error) {
    console.error('Erro ao obter o token JWT:', error);
    return axios.create({ baseURL: 'http://localhost:8080' });
  }
};

export default createApi;
