import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Tarefa = () => {
  const navigation = useNavigation();

  // Estado para tarefas e projetos
  const [tarefas, setTarefas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dados da API
    const fetchData = async () => {
      try {
        const projetosResponse = await fetch('https://sua-api.com/projetos'); // Substitua pela sua URL
        const tarefasResponse = await fetch('https://sua-api.com/tarefas'); // Substitua pela sua URL
        const projetosData = await projetosResponse.json();
        const tarefasData = await tarefasResponse.json();

        setProjects(projetosData);
        setTarefas(tarefasData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGoHome = () => {
    navigation.navigate('Home'); // Navega para a tela "Home"
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const hasProjects = projects.length > 0;
  const hasTarefas = tarefas.length > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome}> 
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Tarefas</Text>
      </View>

      {hasProjects && hasTarefas ? (
        <View>
          {tarefas.map((tarefa) => (
            <View key={tarefa.id} style={styles.tarefaItem}>
              <Text style={styles.tarefaTitle}>{tarefa.title}</Text>
              <Text style={styles.tarefaStatus}>{tarefa.status}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          {!hasProjects ? (
            <Text style={styles.noDataText}>Você não está em nenhum projeto.</Text>
          ) : (
            <Text style={styles.noDataText}>Nenhuma tarefa encontrada.</Text>
          )}
        </View>
      )}

      {/* Modal para adicionar nova tarefa ou selecionar projeto, se necessário */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Nova Tarefa</Text>
            {/* Aqui você pode implementar um formulário para adicionar nova tarefa */}
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
  tarefaItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
  },
  tarefaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tarefaStatus: {
    fontSize: 14,
    color: '#777',
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
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Tarefa;
