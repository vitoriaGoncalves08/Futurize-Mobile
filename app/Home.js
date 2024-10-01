import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import api from './configs/api';
import { FontAwesome } from '@expo/vector-icons';

const Atividades = ({ navigation }) => {
  const [atividades, setAtividades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Função para buscar atividades da API
  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await api.get('/Atividade/1'); // Substitua o ID conforme necessário
        setAtividades(response.data); // Salvando dados no estado
      } catch (error) {
        console.error("Erro ao buscar atividades:", error.message); // Log do erro
      }
    };

    fetchAtividades(); // Chamando a função ao carregar o componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>
      <ScrollView style={styles.list}>
        {atividades.length > 0 ? (
          atividades.map((atividade) => (
            <View key={atividade.id} style={styles.atividade}>
              <Text style={styles.atividadeTitle}>{atividade.titulo}</Text>
              <Text>{atividade.estado}</Text>
              <Text>{atividade.tempo_execucao}</Text>
              <Text>{atividade.projeto.titulo}</Text>
            </View>
          ))
        ) : (
          <Text>Nenhuma atividade encontrada</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Dashboard")}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Tarefas")}>
          <Text style={styles.buttonText}>Tarefas a Fazer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard_User")}>
          <Text style={styles.buttonText}>Meu Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
          <FontAwesome name="cog" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal de Configurações */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  atividade: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  atividadeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  closeModal: {
    color: '#007bff',
    marginTop: 20,
  },
});

export default Atividades;
