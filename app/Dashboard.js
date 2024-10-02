import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();

  // Estado para os projetos e o projeto selecionado
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar dados da API
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://sua-api.com/projetos'); // Substitua pela sua URL
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]); // Seleciona o primeiro projeto por padrão
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleGoHome = () => {
    navigation.navigate('Home'); // Navega para a tela "Home"
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome}> 
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.projectSelector}>
          <Text style={styles.title}>{selectedProject ? selectedProject.name : 'Nenhum Projeto'}</Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Sem dados para analisar</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItemContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{selectedProject.totalTasks}</Text>
                <Text style={styles.summaryItemLabel}>Total de Tarefas</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{selectedProject.completedTasks}</Text>
                <Text style={styles.summaryItemLabel}>Concluídas</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{selectedProject.totalTasks - selectedProject.completedTasks}</Text>
                <Text style={styles.summaryItemLabel}>Pendentes</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progresso Atual</Text>
            <Text style={styles.progressItemNumber}>{selectedProject.completedTasks}/{selectedProject.totalTasks}</Text>
            <Text style={styles.progressItemLabel}>Progresso Atual</Text>
          </View>

          {/* Aqui você pode adicionar seus gráficos conforme o seu layout desejado */}
        </>
      )}

      {/* Modal para seleção de projeto */}
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleProjectSelect(item)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item.name}</Text>
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
  projectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  summaryItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryItemNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryItemLabel: {
    fontSize: 14,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressItemNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressItemLabel: {
    fontSize: 14,
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

export default Dashboard;
