import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabMenu from '../components/TabMenu';
import api from './configs/api';
import RNPickerSelect from 'react-native-picker-select';
import { PieChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const screenWidth = Dimensions.get('window').width;

const DashboardProjeto = () => {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [listagemAtividades, setListagemAtividades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minhasAtividades, setMinhasAtividades] = useState([]);
  const [aConcluidasPProjeto, setAConcluidasPProjeto] = useState([]);

  const [aNaoIniciada, setANaoIniciada] = useState(0);
  const [aConcluir, setAConcluir] = useState(0);
  const [aRefeitas, setARefeitas] = useState(0);
  const [integrantes, setIntegrantes] = useState(0);

  const colors = ['#407BFF', '#79A2FE', '#48beff', '#9FBDFF', '#73d2de', '#a1cdf4', '#60b2e5', '#457eac'];

  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    barPercentage: 0.8,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
    propsForVerticalLabels: {
      fontSize: 12,
    },
  };

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const user = await AsyncStorage.getItem('@user');
        const userId = JSON.parse(user).id;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await api.get(`/Projeto/porUsuario/${userId}`, { headers });
        const data = response.data;

        setProjetos(data);

        if (data.length > 0) {
          setProjetoSelecionado(data[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!projetoSelecionado) return;

      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const userId = JSON.parse(await AsyncStorage.getItem('@user')).id;
        const headers = { Authorization: `Bearer ${token}` };

        // Redefine o estado para evitar dados do projeto anterior
        setIntegrantes('');

        // Listagem de atividades
        const responseListagem = await api.get(`/dashboard-projeto/listagem-das-atividades-por-projeto/${userId}/${projetoSelecionado}`);
        setListagemAtividades(responseListagem.data);

        // Projetos não iniciados
        const responseNiniciados = await api.get(`/dashboard-projeto/total-atividades-nao-iniciadas-por-projeto/${userId}/${projetoSelecionado}`, { headers });
        setANaoIniciada(responseNiniciados.data);

        // Projetos não concluídos
        const responseNconcluidos = await api.get(`/dashboard-projeto/total-atividades-nao-concluidas/${userId}/${projetoSelecionado}`, { headers });
        setAConcluir(responseNconcluidos.data);

        // Projetos refeitas
        const responseRefeitas = await api.get(`/dashboard-projeto/total-atividades-refeitas/${userId}/${projetoSelecionado}`, { headers });
        setARefeitas(responseRefeitas.data);

        // Integrantes com mais entregas
        const responseIntegrantes = await api.get(`/dashboard-projeto/usuario-mais-atividades-concluidas/${userId}/${projetoSelecionado}`, { headers });
        if (Array.isArray(responseIntegrantes.data) && responseIntegrantes.data.length > 0) {
          setIntegrantes(responseIntegrantes.data[0][2]);
        } else {
          setIntegrantes('Sem entregas');
        }

        // Todas as atividades
        const responseTodas = await api.get(`/dashboard-projeto/total-atividades-por-projeto/${userId}/${projetoSelecionado}`, { headers });
        const transformedTodas = responseTodas.data.map((item, index) => ({
          id: index,
          label: item[1],
          value: item[0],
        }));
        setMinhasAtividades(transformedTodas);

        // Atividades Concluídas por Projeto
        const responseConcluidasPProjeto = await api.get(`/dashboard-projeto/atividades-concluidas-por-projeto/${userId}/${projetoSelecionado}`, { headers });

        const data = responseConcluidasPProjeto.data;
        if (data.length > 0) {
          const transformedAConcluidasPProjeto = {
            concluidas: data[0][0],
            total: data[0][1],
          };
          setAConcluidasPProjeto(transformedAConcluidasPProjeto);
        }

      } catch (error) {
        console.log('Erro ao buscar dados da dashboard', error);
      }
    };

    fetchData();
  }, [projetoSelecionado]);

  const handleProjetoChange = (itemValue) => {
    setProjetoSelecionado(itemValue);
  };

  const porcentagemConcluidas = (aConcluidasPProjeto.total > 0)
    ? parseFloat(((aConcluidasPProjeto.concluidas / aConcluidasPProjeto.total) * 100).toFixed(2))
    : 0;

  const renderHeader = () => (
    <>
      {/* Seletor de Projeto */}
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={handleProjetoChange}
          items={projetos.map(projeto => ({
            label: projeto.titulo,
            value: projeto.id,
          }))}
          value={projetoSelecionado}
          style={{
            inputAndroid: {
              padding: 10,
              borderWidth: 1,
              borderColor: '#407BFF',
              borderRadius: 5,
            },
            inputIOS: {
              padding: 10,
              borderWidth: 1,
              borderColor: '#407BFF',
              borderRadius: 5,
            },
          }}
          placeholder={{ label: "Selecione um projeto", value: 0 }}
        />
      </View>

      {/* Gráfico de Gauge */}
      <View style={styles.gaugeContainer}>
        <Text style={styles.chartTitle}>Atividades Concluídas por Trabalho</Text>
        <AnimatedCircularProgress
          size={250}
          width={15}
          fill={porcentagemConcluidas}
          tintColor="#407BFF"
          backgroundColor="#e6e6e6"
          rotation={180}
          lineCap="round"
        >
          {() => (
            <Text style={styles.gaugeText}>
              {aConcluidasPProjeto.concluidas} / {aConcluidasPProjeto.total}
            </Text>
          )}
        </AnimatedCircularProgress>

        <Text style={styles.percentageText}>{porcentagemConcluidas}%</Text>
      </View>

      {/* Gráfico de Pizza */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Minhas Atividades</Text>
        <PieChart
          data={minhasAtividades.map((item, index) => ({
            name: item.label,
            population: item.value,
            color: colors[index % colors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 10,
          }))}
          width={screenWidth - 30}
          height={250}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Resumo de Projetos */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Atividades não iniciadas</Text>
          <Text style={styles.summaryValue}>{aNaoIniciada}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Atividades para concluir</Text>
          <Text style={styles.summaryValue}>{aConcluir}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Atividades refeitas</Text>
          <Text style={styles.summaryValue}>{aRefeitas}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Integrante com mais entregas</Text>
          <Text style={styles.summaryValue}>{integrantes}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Retrabalho por atividade</Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard por Trabalho</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#407BFF" />
        </View>
      ) : (
        <FlatList
          data={listagemAtividades}
          keyExtractor={(item) => item[0]?.id.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listTitle}>{item[0]?.titulo}</Text>
              <Text style={styles.listDetails}>
                Responsável: {item[0]?.responsavel.nome} | Refeita {item[0]?.quantidade_retrabalho}x
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessage}>Nenhuma atividade encontrada.</Text>
          )}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
      <TabMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    marginTop: 45,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#407BFF',
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: '#e6e6e6',
    padding: 10,
    borderRadius: 8,
  },
  pickerContainer: {
    marginVertical: 20,
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
  },
  listItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listDetails: {
    fontSize: 14,
    color: '#7F7F7F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7F7F7F',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryBox: {
    width: '48%',
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#407BFF',
    textAlign: 'center'
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#F8F8F8',
    padding: 10,
    borderRadius: 8,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevação para Android
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  gaugeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#407BFF',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -20,
  },
});

export default DashboardProjeto;
