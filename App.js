import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Importe do pacote correto
import { AuthProvider } from './app/configs/AuthContext'; // Certifique-se de que o caminho está correto
import Loginf from './app/Loginf'; // Certifique-se de que o caminho está correto
import Home from './app/Home'; // Sua tela principal após login

const Stack = createNativeStackNavigator(); // Use createNativeStackNavigator

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen name="Loginf" component={Loginf} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
