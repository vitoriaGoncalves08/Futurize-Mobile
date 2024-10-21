import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // Certifique-se de que o caminho está correto
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

// Criação do contexto de autenticação
export const AuthContext = createContext({});

// Hook para facilitar o acesso ao contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@user');
        if (userToken) {
          setUser(JSON.parse(userToken)); // Define o usuário logado
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Erro ao obter token:', error);
      }
    };
    getUserToken();
  }, [navigation]);

  // Função de login
  const signIn = async (email, senha) => {
    try {
      // Realiza a requisição de login
      const response = await api.post('/login', { email, senha });
      const token = response.data.tokenJWT;
  
      if (!token) {
        throw new Error('Token não retornado pela API.');
      }
  
      // Busca o usuário completo pelo email
      const userResponse = await api.get(`/Usuario/buscar/${email}`);
      const userData = userResponse.data;
  
      // Armazena o token e os dados completos do usuário no AsyncStorage
      await AsyncStorage.setItem('@tokenJWT', token);
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
  
      // Define o usuário no estado
      setUser(userData);
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      console.log("Usuário logado:", userData);
  
      // Redireciona para a Home após login
      navigation.navigate('Home'); 
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
    }
  };
  


  const signout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@tokenJWT');
      await AsyncStorage.removeItem('@user');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
