import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
          console.log("Nenhum token de usuário encontrado.");
        }
      } catch (error) {
        console.error('Erro ao obter token:', error);
      }
    };
    getUserToken();
  }, []);

  const signIn = async (email, senha, navigation) => {
    try {
      const response = await api.post('/login', { email, senha });
      const token = response.data.tokenJWT;

      if (!token) {
        throw new Error('Token não retornado pela API.');
      }

      await AsyncStorage.setItem('@tokenJWT', token);

      const userResponse = await api.get(`/Usuario/buscar/${email}`);
      const userData = userResponse.data;

      await AsyncStorage.setItem('@user', JSON.stringify(userData));

      setUser(userData);
      setUserLogadoId(userData.id);
      console.log("Novo usuário logado:", userData);

      // Use a navegação passada por parâmetro para navegar após o login
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
    }
  };

  const signout = async (navigation) => {
    try {
      setUser(null);
      setUserLogadoId(null);
      await AsyncStorage.removeItem('@tokenJWT');
      await AsyncStorage.removeItem('@user');

      // Use a navegação passada por parâmetro para navegar após o logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userLogadoId, signIn, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
