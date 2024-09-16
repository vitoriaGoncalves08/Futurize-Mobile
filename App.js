import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importe do pacote correto
import { AuthProvider } from './app/configs/AuthContext'; // Certifique-se de que o caminho está correto
import Loginf from './app/Loginf'; // Certifique-se de que o caminho está correto
import Home from './app/Home'; // Sua tela principal após login
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Splash from './app/Splash';
import Loginf from './app/Login';
import RecuperarSenha from './app/RecuperarSenha';
import Home from './app/Home';
import Dashboard from './app/Dashboard';
import Dashboard_User from './app/Dashboard_User';
import Tarefas from './app/Tarefas';


const Stack = createNativeStackNavigator(); // Use createNativeStackNavigator

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Loginf} />
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
