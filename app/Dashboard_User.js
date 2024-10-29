import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabMenu from '../components/TabMenu';

const screenWidth = Dimensions.get('window').width;

const DashboardUser = () => {
  const [atividadesConcluidasPProjeto, setAtividadesConcluidasPProjeto] = useState([]);
  const [minhasAtividades, setMinhasAtividades] = useState([]);
  const [projetosCriados, setProjetosCriados] = useState(0);
  const [projetosAlocados, setProjetosAlocados] = useState(0);
  const [projetosConcluidos, setProjetosConcluidos] = useState(0);
  const [atividadesAndamento, setAtividadesAndamento] = useState(0);
  const colors = ['#407BFF', '#79A2FE', '#48beff', '#9FBDFF', '#73d2de', '#a1cdf4', '#60b2e5', '#457eac'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const userId = JSON.parse(await AsyncStorage.getItem('@user')).id;

        // Atividades Concluídas por Projeto
        const responseAtividadesConcluidasPProjeto = await axios.get(
          `http://localhost:8080/dashboard/atividades-concluidas-por-projeto/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const transformedAtividadesConcluidas = responseAtividadesConcluidasPProjeto.data.map((item, index) => ({
          id: index,
          label: item[0],
          value: item[1],
        }));

        setAtividadesConcluidasPProjeto(transformedAtividadesConcluidas);

        // Minhas Atividades
        const responseMinhasAtividades = await api.get(`/dashboard/atividades/${userId}`)
        const transformedMinhasAtividades = responseMinhasAtividades.data.map((item, index) => ({
          id: index,
          label: item[0],
          value: item[1],
        }));

        setMinhasAtividades(transformedMinhasAtividades);

        // Outros dados de projetos
        const responseProjetosCriados = await api.get(`/dashboard/projetos-criados/${userLogadoId}`);
        setProjetosCriados(responseProjetosCriados.data);
        console.log(projetosCriados);

        const responseProjetosAlocados = await axios.get(
          `http://localhost:8080/dashboard/projetos-alocados/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjetosAlocados(responseProjetosAlocados.data);

        const responseProjetosConcluidos = await axios.get(
          `http://localhost:8080/dashboard/projetos-concluidos/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProjetosConcluidos(responseProjetosConcluidos.data);

        const responseAtividadesAndamento = await axios.get(
          `http://localhost:8080/dashboard/atividades-andamento/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAtividadesAndamento(responseAtividadesAndamento.data);
      } catch (error) {
        console.error('Erro ao buscar dados da dashboard', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Minha Dashboard</Text>

      {/* Gráfico de Barras */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Atividades Concluídas por Projeto</Text>
        <BarChart
          data={{
            labels: atividadesConcluidasPProjeto.map(item => item.label),
            datasets: [
              {
                data: atividadesConcluidasPProjeto.map(item => item.value),
                colors: atividadesConcluidasPProjeto.map((_, index) => colors[index % colors.length]),
              },
            ],
          }}
          width={screenWidth - 30}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          verticalLabelRotation={30}
        />
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
            legendFontSize: 15,
          }))}
          width={screenWidth - 30}
          height={220}
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
          <Text style={styles.summaryTitle}>Trabalhos Criados</Text>
          <Text style={styles.summaryValue}>{projetosCriados}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Trabalhos Alocados</Text>
          <Text style={styles.summaryValue}>{projetosAlocados}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Trabalhos Concluídos</Text>
          <Text style={styles.summaryValue}>{projetosConcluidos}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Atividades em Andamento</Text>
          <Text style={styles.summaryValue}>{atividadesAndamento}</Text>
        </View>
      </View>
    </ScrollView>
    <TabMenu />
    </>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginTop:45
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
    fontSize: 16,
    color: '#333',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default DashboardUser;
