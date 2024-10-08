import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  FlatList 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import api from './configs/api';

const Atividades = ({ navigation }) => {
  const [atividades, setAtividades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await api.get('/Atividade/1');
        setAtividades(response.data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error.message);
      }
    };

    fetchAtividades();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Bem Vindo, {'\n'}Maverick</Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle-o" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dashboard Section */}
      <View style={styles.dashboardSection}>
        <TouchableOpacity style={styles.dashboardCard} onPress={() => navigation.replace("Dashboard")}>
          <Text style={styles.dashboardTitle}>Dashboard</Text>
          <Text>Projetos e atividades de forma Dinâmica</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("Tarefas")}>
          <Text style={styles.tabText}>Todas as Tarefas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Últimos Projetos</Text>
        </TouchableOpacity>
      </View>
{/* Task List */}
      <FlatList
        data={atividades}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.taskItem}>
            <TouchableOpacity style={styles.checkbox}>
              {/* You can add a checkbox component here */}
            </TouchableOpacity>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{item.titulo}</Text>
              <Text style={styles.taskDetails}>
                Fazer Agora
              </Text>
            </View>
            
          </View>
          
        )}
      />
       <View style={styles.bottomNavigation}>
           <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Dashboard_User")}>
          <Text style={styles.navButtonText}>Meu Dashboard</Text>
        </TouchableOpacity>
          <FontAwesome name="cog" size={24} color="white" />

      </View>

      {/* Bottom Navigation */}
     

      {/* Modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', 
     shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Dashboard Section Styles
  dashboardSection: {
    padding: 20,
  },
  dashboardCard: {
    backgroundColor: '#fff',
    padding: 20,
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
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Tabs Styles
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  tabButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    textAlign: 'center',
  },
  // Task List Styles
  taskItem: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDetails: {
    fontSize: 14,
    color: '#666',
  },
  // Bottom Navigation Styles
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  navButtonText: {
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
  // Modal Styles
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