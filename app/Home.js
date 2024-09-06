import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import useAuth from "./configs/useAuth";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Adicionado para substituir localStorage

const Home = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const navigation = useNavigation();

  const { getLoginUser } = useAuth();
  const usuarioLogado = getLoginUser();
  const usuarioLogadoId = usuarioLogado?.id;
  const usuarioLogadoName = usuarioLogado?.sub;
  const [allocatedUsers, setAllocatedUsers] = useState([]);

  const [token, setToken] = useState('');

  // Use Effect to retrieve the token from AsyncStorage
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@user');
        if (storedToken) {
          const parsedToken = JSON.parse(storedToken);
          setToken(parsedToken.tokenJWT);
        }
      } catch (error) {
        console.error('Erro ao recuperar token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleCheck2 = () => {
    setIsChecked2(!isChecked2);
  };

  const handleCheck3 = () => {
    setIsChecked3(!isChecked3);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem Vindo, Maverick</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate("PerfilSettings")}>
          <Text>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dashboard}>
        <Text>
          {token}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Para Fazer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Últimos Projetos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.taskList}>
        <View style={styles.task}>
          <CheckBox
            value={isChecked}
            onChange={handleCheck}
            style={styles.checkbox}
          />
          <Text style={styles.taskText}>Este é um ótimo item. Fazer Agora</Text>
        </View>
        <View style={styles.task}>
          <CheckBox
            value={isChecked2}
            onChange={handleCheck2}
            style={styles.checkbox}
          />
          <Text style={styles.taskText}>Este é um ótimo item. Fazer Agora</Text>
        </View>
        <View style={styles.task}>
          <CheckBox
            value={isChecked3}
            onChange={handleCheck3}
            style={styles.checkbox}
          />
          <Text style={styles.taskText}>Este é um ótimo item. Fazer Agora</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonDash} onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.buttonText}>Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#fff',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 40
  },
  profileIcon: {
    padding: 10,
    borderRadius: 50,
  },
  dashboard: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskList: {
    padding: 20,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkbox: {
    marginLeft: 10,
  },
  buttonDash: {
    width: '65%',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
});
