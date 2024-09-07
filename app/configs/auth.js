import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../service/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const userToken = await AsyncStorage.getItem('@user');
      if (userToken) {
        setUser(JSON.parse(userToken));
      } else {
        navigation.navigate('Login'); // Navega para a tela de login se não houver token
      }
    };

    loadUserFromStorage();
  }, []);

  const signIn = async (email, senha) => {
    try {
      const { data } = await api.post('/login', { email, senha });
      await AsyncStorage.setItem('@user', JSON.stringify(data));
      setUser(data);

      navigation.navigate('Projeto'); // Navega para a tela 'Projeto' após login
    } catch (error) {
      console.error('Erro no login:', error?.response?.data ?? 'Algo deu errado.');
    }
  };

  const signup = async (name, email, password) => {
    try {
      const usersStorage = JSON.parse(await AsyncStorage.getItem('users_bd'));
      const hasUser = usersStorage?.filter((user) => user.email === email);

      if (hasUser?.length) {
        return 'Já tem uma conta com esse E-mail';
      }

      let newUser;

      if (usersStorage) {
        newUser = [...usersStorage, { name, email, password }];
      } else {
        newUser = [{ name, email, password }];
      }

      await AsyncStorage.setItem('users_bd', JSON.stringify(newUser));
    } catch (error) {
      console.error('Erro no cadastro:', error);
    }
  };

  const signout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
    navigation.navigate('Login'); // Navega para a tela de login após logout
  };

  const getLoginUser = async () => {
    const userToken = await AsyncStorage.getItem('@user');
    if (userToken) {
      try {
        const tokenPayload = JSON.parse(atob(userToken.split('.')[1])); // Decodifica o payload do token JWT
        return tokenPayload;
      } catch (error) {
        console.error('Erro ao decodificar o token JWT:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn, signup, signout, getLoginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
