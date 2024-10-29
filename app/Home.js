import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import api from './configs/api';
import { useAuth } from './configs/AuthContext';
import TabMenu from '../components/TabMenu';

const Atividades = ({ navigation }) => {
  const [atividades, setAtividades] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { userLogadoId, user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [dificuldadeFilter, setDificuldadeFilter] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false); // Modal para filtro de dificuldade

  useEffect(() => {
    if (!userLogadoId) {
      console.log("ID do usuário não está definido.");
      return;
    }

    const fetchAtividades = async () => {
      try {
        const response = await api.get(`/Atividade/${userLogadoId}`);
        setAtividades(response.data);
        console.log("HOME", userLogadoId);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error.message);
      }
    };

    fetchAtividades();
  }, [userLogadoId]);

  // Define o ícone com base na dificuldade
  const getDificuldadeIcon = (dificuldade) => {
    switch (dificuldade) {
      case 'SIMPLES':
        return <FontAwesome name="thumbs-up" size={24} color="#28a745" />;
      case 'MODERADA':
        return <FontAwesome name="exclamation-circle" size={24} color="#ff9800" />;
      case 'COMPLEXA':
        return <Entypo name="warning" size={24} color="#f44336" />;
      default:
        return null;
    }
  };

  // Filtra atividades com base na barra de pesquisa e no filtro de dificuldade
  const filteredAtividades = atividades.filter(item => {
    const matchesNome = item.titulo.toLowerCase().includes(searchText.toLowerCase());
    const matchesDificuldade = dificuldadeFilter ? item.dificuldade === dificuldadeFilter : true;
    return matchesNome && matchesDificuldade;
  });

  // Abre o modal de filtro de dificuldade
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  // Fecha o modal de filtro de dificuldade
  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {user ? `Bem-vindo(a), ${user.nome}!` : 'Usuário não logado'}
        </Text>
        <TouchableOpacity>
          <FontAwesome name="user-circle-o" size={24} color="#3E3E3E" />
        </TouchableOpacity>
      </View>

      {/* Seção Promocional de Dashboard */}
      <View style={styles.promoSection}>
        <View style={styles.promoCard}>
          <MaterialIcons name="dashboard" size={40} color="#fff" />
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Acompanhe tudo no app!</Text>
            <Text style={styles.promoSubtitle}>
              Visualize o progresso das atividades de onde estiver, em tempo real por aqui.
            </Text>
          </View>
        </View>

        <View style={styles.promoCard}>
          <FontAwesome name="bell" size={40} color="#fff" />
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>Notificações Instantâneas</Text>
            <Text style={styles.promoSubtitle}>
              Receba atualizações a cada mudança, sem perder nenhuma novidade.
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Listagem de todas as suas atividades</Text>

      {/* Seção de Filtros */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar pelo título..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
          <Text style={styles.filterButtonText}>
            {dificuldadeFilter ? `Dificuldade: ${dificuldadeFilter}` : 'Filtrar Dificuldade'}
          </Text>
        </TouchableOpacity>
      </View>
    
      {/* Modal de Filtro de Dificuldade */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilterModal}
      >
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecione a Dificuldade</Text>
          <TouchableOpacity 
            style={styles.modalOption} 
            onPress={() => { setDificuldadeFilter('SIMPLES'); closeFilterModal(); }}
          >
            <Text style={styles.modalOptionText}>SIMPLES</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalOption} 
            onPress={() => { setDificuldadeFilter('MODERADA'); closeFilterModal(); }}
          >
            <Text style={styles.modalOptionText}>MODERADA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalOption} 
            onPress={() => { setDificuldadeFilter('COMPLEXA'); closeFilterModal(); }}
          >
            <Text style={styles.modalOptionText}>COMPLEXA</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.modalOption} 
            onPress={() => { setDificuldadeFilter(''); closeFilterModal(); }}
          >
            <Text style={styles.modalOptionText}>Limpar Filtro</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Lista de Atividades */}
      <FlatList
        data={filteredAtividades}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {getDificuldadeIcon(item.dificuldade)}
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{item.titulo}</Text>
              <Text style={styles.taskDetails}>{item.descricao}</Text>
              <Text style={styles.taskDetails}>Estado: {item.estado}</Text>
              <Text style={styles.taskDetails}>Dificuldade: {item.dificuldade}</Text>
            </View>
          </View>
        )}
      />
      <TabMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  promoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  promoCard: {
    backgroundColor: '#407BFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
  },
  promoTextContainer: {
    marginTop: 10,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#e6e6e6',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
     color: '#3E3E3E'
  },
  filterSection: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#407BFF',
    padding: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: '#407BFF',
  },
  taskItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3E3E3E',
  },
  taskDetails: {
    fontSize: 14,
    color: '#3E3E3E',
  },
});

export default Atividades;
