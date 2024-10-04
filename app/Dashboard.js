import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from './configs/api'; // Ajuste o caminho conforme necessário
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projetos'); // Substitua pela sua URL
        setProjects(response.data);
        if (response.data.length > 0) {
          setSelectedProject(response.data[0]); // Seleciona o primeiro projeto por padrão
          fetchActivities(response.data[0].id); // Busca as atividades do primeiro projeto
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchActivities = async (projectId) => {
    setLoadingActivities(true);
    try {
      const response = await api.get(`/Atividade/${projectId}`); // Ajuste o endpoint conforme necessário
      setActivities(response.data);
    } catch (error) {
      console.error("Erro ao buscar atividades:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    fetchActivities(project.id); // Atualiza as atividades ao selecionar um novo projeto
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
        <TouchableOpacity onPress={handleGoHome}> 
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.projectSelector}>
          <Text style={styles.title}>{selectedProject ? selectedProject.nome : 'Nenhum Projeto'}</Text>
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
                <Text style={styles.summaryItemNumber}>{activities.length}</Text>
                <Text style={styles.summaryItemLabel}>Total de Atividades</Text>
              </View>
              {/* Adicione mais informações sobre as atividades aqui se necessário */}
            </View>
          </View>

          {loadingActivities ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.activitiesContainer}>
              {activities.length > 0 ? (
                activities.map((atividade) => (
                  <View key={atividade.id} style={styles.atividade}>
                    <Text style={styles.atividadeTitle}>{atividade.nome}</Text>
                    <Text>{atividade.estado}</Text>
                    <Text>{atividade.tempo_execucao}</Text>
                  </View>
                ))
              ) : (
                <Text>Nenhuma atividade encontrada para este projeto.</Text>
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
  activitiesContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  atividade: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  atividadeTitle: {
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

export default Dashboard;
