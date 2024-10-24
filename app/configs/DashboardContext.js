import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Certifique-se de que o caminho está correto
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

// Criação do contexto de autenticação
export const DashboardContext = createContext({});

// Hook para facilitar o acesso ao contexto
export const useAuth = () => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

    // solicitando informações de projeto e alocações

    const listaProjetos = async (id) => {
        try {
          // Realiza a requisição de login
          const response = await api.post('Alocacao_projeto/porUser', {id});
          const token = response.data.tokenJWT;
      
          if (!token) {
            throw new Error('Token não retornado pela API.');
          }
      
          // Redireciona para a Home após login
          navigation.navigate('Home'); 
          
        } catch (error) {
          console.error('Erro na busca de projetos:', error.response?.data || error.message);
        }
      };

}
