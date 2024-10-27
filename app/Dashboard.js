import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from './configs/api';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from "react-native-chart-kit";
import TabMenu from '../components/TabMenu';

const Dashboard = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('your-user-id');
  const [loading, setLoading] = useState(true);
  const [projetos, setProjetos] = useState([]);
  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activities, setActivities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do Modal
  const [dashboardData, setDashboardData] = useState({
    totalAtividades: 0,
    projetosCriados: 0,
    projetosAlocados: 0,
    projetosConcluidos: 0,
    atividadesAndamento: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/Projeto/porUsuario/${userId}`);
        setProjetos(response.data);


        if (response.data.length > 0) {
          setSelectedProjeto(response.data[0]);
          await fetchActivities(response.data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (selectedProjeto) {
        try {
          const [
            atividadesResponse,
            projetosCriadosResponse,
            projetosAlocadosResponse,
            projetosConcluidosResponse,
            atividadesAndamentoResponse,
          ] = await Promise.all([
            api.get(`/dashboard/atividades/${userId}`),
            api.get(`/dashboard/projetos-criados/${userId}`),
            api.get(`/dashboard/projetos-alocados/${userId}`),
            api.get(`/dashboard/projetos-concluidos/${userId}`),
            api.get(`/dashboard/atividades-andamento/${userId}`),
          ]);

          setDashboardData({
            totalAtividades: atividadesResponse.data.length,
            projetosCriados: projetosCriadosResponse.data,
            projetosAlocados: projetosAlocadosResponse.data,
            projetosConcluidos: projetosConcluidosResponse.data,
            atividadesAndamento: atividadesAndamentoResponse.data,
          });
        } catch (error) {
          console.error("Erro ao buscar dados do dashboard:", error);
        }
      }
    };

    fetchDashboardData();
  }, [selectedProjeto]);

  const fetchActivities = async (projetoId) => {
    setLoadingActivities(true);
    try {
      const response = await api.get(`/Atividade/${projetoId}`);
      setActivities(response.data);
    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleProjetoSelect = (projeto) => {
    setSelectedProjeto(projeto);
    fetchActivities(projeto.id);
  };

  const formatDataToBarChart = (data) => {
    return {
      labels: ["Criados", "Alocados", "Concluídos"],
      datasets: [
        {
          data: [data.projetosCriados, data.projetosAlocados, data.projetosConcluidos],
          color: (opacity = 1) => `rgba(53, 109, 244, ${opacity})`, // Cor das barras
        }
      ]
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoHome}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        <View style={styles.dashboardContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.projetoSelector}>
            <Text style={styles.title}>
              Projeto: {selectedProjeto ? selectedProjeto.nome : 'Selecione um projeto'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.chartContainer}>
            <Text style={styles.cardTitle}>Projetos por Status</Text>
            <BarChart
              data={formatDataToBarChart(dashboardData)}
              width={350}
              height={220}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>

          <View style={styles.dataContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total de Atividades</Text>
              <Text style={styles.cardValue}>{dashboardData.totalAtividades}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Projetos Criados</Text>
              <Text style={styles.cardValue}>{dashboardData.projetosCriados}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Projetos Alocados</Text>
              <Text style={styles.cardValue}>{dashboardData.projetosAlocados}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Projetos Concluídos</Text>
              <Text style={styles.cardValue}>{dashboardData.projetosConcluidos}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Atividades em Andamento</Text>
              <Text style={styles.cardValue}>{dashboardData.atividadesAndamento}</Text>
            </View>
          </View>

          <View style={styles.atividadesContainer}>
            <Text style={styles.atividadesTitle}>Atividades do Projeto {selectedProjeto ? selectedProjeto.nome : ''}</Text>
            {activities.map((atividade) => (
              <View key={atividade.id} style={styles.atividadeCard}>
                <Text style={styles.atividadeTitle}>{atividade.nome}</Text>
              </View>
            ))}
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Selecione um Projeto</Text>
              <FlatList
                data={projetos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleProjetoSelect(item);
                      setModalVisible(!modalVisible);
                    }}
                    style={styles.projetoModalContainer}
                  >
                    <Text style={styles.projetoModalTitle}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <TabMenu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dashboardContainer: {
    padding: 16,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  atividadesContainer: {
    padding: 16,
  },
  atividadesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  atividadeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  atividadeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projetoSelector: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  projetoModalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  projetoModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;