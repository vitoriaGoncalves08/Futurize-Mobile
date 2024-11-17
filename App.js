import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './app/configs/AuthContext';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from 'expo-notifications';

import Splash from './app/Splash';
import Login from './app/Login';
import RecuperarSenha from './app/RecuperarSenha';
import Home from './app/Home';
import Dashboard from './app/Dashboard';
import Dashboard_User from './app/Dashboard_User';
import Tarefas from './app/Tarefas';

import api from './app/configs/api';

// Create stack navigator
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

  console.log("Permissões de notificação concedidas");
  return true;
};

const verificarNotificacao = async (userId) => {
  if (!userId) {
    console.warn("ID de usuário está indefinido, não é possível verificar notificações.");
    return;
  }

  try {
    const response = await api.get(`/Atividade/notificacao/${userId}`);
    console.log("Resposta da verificação de notificação:", response.data);
    const mensagem = response.data.mensagem;

    if (mensagem) {
      console.log("Mensagem recebida do servidor:", mensagem);

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Futurize🌐 - Notificação",
            body: mensagem,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { seconds: 1 },
        });
      } catch (error) {
        console.error("Erro ao agendar a notificação:", error);
      }
    }
  } catch (error) {
    console.error("Erro ao verificar notificação:", error);
  }
};

const AppContent = () => {
  const { userLogadoId } = useAuth(); // Obtém o userLogadoId do contexto de autenticação

  useEffect(() => {
    const initNotificacoes = async () => {
      const permissaoConcedida = await solicitarPermissaoNotificacao();

      if (permissaoConcedida && userLogadoId) {
        const interval = setInterval(() => {
          console.log("Chamando verificarNotificacao para userLogadoId:", userLogadoId);
          verificarNotificacao(userLogadoId);
        }, 15000);

        // Limpa o intervalo quando o componente é desmontado
        return () => clearInterval(interval);
      } else {
        console.log("userLogadoId ainda está indefinido ou permissões não concedidas.");
      }
    };

    initNotificacoes();
  }, [userLogadoId]);

  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      animationEnabled: false,
      animation: 'none',
    }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Dashboard_User" component={Dashboard_User} />
      <Stack.Screen name="Tarefas" component={Tarefas} />
      <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
