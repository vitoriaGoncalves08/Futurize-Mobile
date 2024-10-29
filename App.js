import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Inicial from './app/Inicial';
import Splash from './app/Splash';
import Loginf from './app/Loginf';
import RecuperarSenha from './app/RecuperarSenha';
import Home from './app/Home';
import Dashboard from './app/Dashboard';
import CriarConta from './app/CriarConta';
import PerfilSettings from './app/PerfilSettings';
import Notificacoes from './app/Notificacoes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="CriarConta"
          component={CriarConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Loginf"
          component={Loginf}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenha}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="PerfilSettings"
          component={PerfilSettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inicial"
          component={Inicial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="Notificacoes"
          component={Notificacoes}
          options={{ headerShown: false }}
        />


     
      </Stack.Navigator>
    </NavigationContainer>
  );
}
