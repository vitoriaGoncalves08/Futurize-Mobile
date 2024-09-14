import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { useNavigation } from '@react-navigation/native';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getUserToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@user');
        if (userToken) {
          setUser(JSON.parse(userToken));
        } else {
          navigation.navigate('Home'); // Redireciona para a tela inicial
        }
      } catch (error) {
        console.error('Erro ao obter o token do usuário:', error);
      }
    };
    getUserToken();
  }, []);

  const signIn = async (email, senha) => {
    try {
      const { data } = await api.post('/login', { email, senha });
      await AsyncStorage.setItem('@user', JSON.stringify(data));
      setUser(data);
      navigation.navigate('Project'); // Navega para a tela de projeto após login
    } catch (error) {
      console.log('Algo deu errado.');
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
      console.error('Erro ao criar conta:', error);
    }
  };

  const signout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  const getLoginUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@user');
      if (userToken) {
        const tokenPayload = JSON.parse(atob(userToken.split('.')[1])); // Decodifica o payload do token JWT
        return tokenPayload;
      }
      return null;
    } catch (error) {
      console.error('Erro ao decodificar o token JWT:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signed: !!user, signIn, signup, signout, getLoginUser }}>
      {children}
    </AuthContext.Provider>
  );
};
