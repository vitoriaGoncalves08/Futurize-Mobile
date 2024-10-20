import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './app/configs/AuthContext';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from 'expo-notifications';
import axios from 'axios';

import Splash from './app/Splash';
import Login from './app/Login';
import RecuperarSenha from './app/RecuperarSenha';
import Home from './app/Home';
import Dashboard from './app/Dashboard';
import Dashboard_User from './app/Dashboard_User';
import Tarefas from './app/Tarefas';

import api from './app/configs/api';

const Stack = createNativeStackNavigator();

// Configuração para lidar com notificações no Android e iOS
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mostra o alerta na tela
    shouldPlaySound: true, // Reproduz o som da notificação
    shouldSetBadge: true, // Exibe o ícone na barra de status
  }),
});

// Função para solicitar permissões de notificação
const solicitarPermissaoNotificacao = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('As permissões para notificações não foram concedidas.');
    return false;
  }

  return true;
};

// Função para verificar notificações
const verificarNotificacao = async (atividadeId) => {
  try {
    const response = await api.get(`/Atividade/notificacao/${atividadeId}`);
    const mensagem = response.data.mensagem;

    if (mensagem) {
      // Exibe a notificação na barra de notificações
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notificação de Atividade",
          body: mensagem,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH, // Prioridade alta para Android
        },
        trigger: null, // Imediata
      });
    }
  } catch (error) {
    console.error("Erro ao verificar notificação:", error);
  }
};

// Função para limpar a notificação no backend
const limparNotificacao = async (atividadeId) => {
  try {
    await api.put(`/Atividade/notificacao/limpar/${atividadeId}`);
    console.log("Notificação limpa com sucesso no backend");
  } catch (error) {
    console.error("Erro ao limpar a notificação:", error);
  }
};


const App = () => {
  useEffect(() => {
    const initNotificacoes = async () => {
      const permissaoConcedida = await solicitarPermissaoNotificacao();
      if (permissaoConcedida) {
        // Substitua pelo ID da atividade para verificar notificações
        const atividadeId = 1;

        // Verifica notificações a cada 15 segundos
        const interval = setInterval(() => {
          verificarNotificacao(atividadeId);
        }, 15000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(interval);
      }
    };

    initNotificacoes();
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Dashboard_User" component={Dashboard_User} />
          <Stack.Screen name="Tarefas" component={Tarefas} />
          <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
          <Stack.Screen name="Splash" component={Splash} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
