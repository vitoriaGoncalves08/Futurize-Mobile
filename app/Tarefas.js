import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Pressable, ActivityIndicator } from 'react-native';
import api from './configs/api'; // Ajuste o caminho conforme necessário
import { useNavigation } from '@react-navigation/native';

const Tarefas = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projetos'); // Substitua pela sua URL
        setProjects(response.data);
        if (response.data.length > 0) {
          setSelectedProject(response.data[0]); // Seleciona o primeiro projeto por padrão
          fetchTasks(response.data[0].id); // Busca as tarefas do primeiro projeto
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchTasks = async (projectId) => {
    setLoadingTasks(true);
    try {
      const response = await api.get(`/Tarefas/${projectId}`); // Ajuste o endpoint conforme necessário
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchTasks(project.id); // Atualiza as tarefas ao selecionar um novo projeto
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}> 
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.projectSelector}>
          <Text style={styles.title}>{selectedProject ? selectedProject.nome : 'Nenhum Projeto'}</Text>
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Sem projetos disponíveis</Text>
        </View>
      ) : (
        <>
          {loadingTasks ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.tasksContainer}>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <View key={task.id} style={styles.task}>
                    <Text style={styles.taskTitle}>{task.nome}</Text>
                    <Text>{task.estado}</Text>
                    <Text>{task.tempo_execucao}</Text>
                  </View>
                ))
              ) : (
                <Text>Nenhuma tarefa encontrada para este projeto.</Text>
              )}
            </View>
          )}
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha um Projeto</Text>
            <FlatList
              data={projects}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleProjectSelect(item)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item.nome}</Text>
                </Pressable>
              )}
            />
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: '#007BFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  projectSelector: {
    marginLeft: 16,
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
  },
  tasksContainer: {
    padding: 16,
  },
  task: {
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
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalItemText: {
    fontSize: 16,
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

export default Tarefas;
