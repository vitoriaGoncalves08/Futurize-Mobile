import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { useAuth } from './configs/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Obter as dimensões da tela
const { width } = Dimensions.get('window');

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [secureText, setSecureText] = useState(true);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await signIn(email, senha);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao realizar login. Verifique suas credenciais.');
      console.log('Erro no login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/img/logoProjeto.png')} />
      <Text style={styles.loginTitle}>Login</Text>
      <Text style={styles.description}>
        Vamos começar preenchendo o formulário abaixo.
      </Text>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.txtinput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={[styles.txtinput, { flex: 1 }]}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={secureText}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)} style={styles.iconButton}>
          <Icon name={secureText ? 'eye-off' : 'eye'} size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',

  },
  logo: {
    width: width * 0.7,
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
    marginTop:-150,
    marginBottom:-50,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputArea: {
    width: '100%',
    marginBottom: 15,
  },
  inputWithIcon: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  txtinput: {
    backgroundColor: '#E3E3E3',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#4F4F4F',
  },
  iconButton: {
    padding: 10,
    position: 'absolute',
    right: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#4F4FFF',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Login;
