import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from './api';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [userLogadoId, setUserLogadoId] = useState(null);

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@user');
        if (userToken) {
          const userData = JSON.parse(userToken);
          setUser(userData); 
          setUserLogadoId(userData.id);
          console.log("Usuário id carregado do AsyncStorage:", userData.id);
        } else {
          console.log("Nenhum token de usuário encontrado, redirecionando para login");
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Erro ao obter token:', error);
      }
    };
    getUserToken();
  }, [navigation]);

  const signIn = async (email, senha) => {
    try {
      // Faz o login e obtém o token JWT
      const response = await api.post('/login', { email, senha });
      const token = response.data.tokenJWT;

      if (!token) {
        throw new Error('Token não retornado pela API.');
      }

      // Salva o token no AsyncStorage
      await AsyncStorage.setItem('@tokenJWT', token);

      // Faz a requisição para buscar o usuário, incluindo o token no cabeçalho
      const userResponse = await api.get(`/Usuario/buscar/${email}`);
      const userData = userResponse.data;

      // Salva os dados do usuário no AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(userData));

      // Define o novo usuário logado no estado
      setUser(userData);
      setUserLogadoId(userData.id);
      console.log("Novo usuário logado:", userData);

      // Navega para a Home após o login
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
    }
  };

  const signout = async () => {
    try {
      setUser(null);
      setUserLogadoId(null);
      await AsyncStorage.removeItem('@tokenJWT');
      await AsyncStorage.removeItem('@user');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn, signout, userLogadoId }}>
      {children}
    </AuthContext.Provider>
  );
};
