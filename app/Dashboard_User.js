import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import api from './configs/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart, PieChart } from 'react-native-chart-kit';
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

  // Definindo chartConfig dentro do componente
  const chartConfig = {
    backgroundGradientFrom: "#f5f5f5",
    backgroundGradientTo: "#f5f5f5",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    barPercentage: 0.8, // Aumenta a largura das barras
    decimalPlaces: 0, // Remove casas decimais
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor dos rótulos
    propsForBackgroundLines: {
      strokeWidth: 0, // Remove as linhas de fundo
    },
    propsForVerticalLabels: {
      fontSize: 12, // Tamanho da fonte das etiquetas no eixo X
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const userId = JSON.parse(await AsyncStorage.getItem('@user')).id;
        const headers = { Authorization: `Bearer ${token}` };

        // Atividades Concluídas por Projeto
        const responseAtividadesConcluidasPProjeto = await api.get(`/dashboard/atividades-concluidas-por-projeto/${userId}`, { headers });
        const transformedAtividadesConcluidas = responseAtividadesConcluidasPProjeto.data.map((item, index) => ({
          id: index,
          label: item[0],
          value: item[1],
        }));
        setAtividadesConcluidasPProjeto(transformedAtividadesConcluidas);

        // Minhas Atividades
        const responseMinhasAtividades = await api.get(`/dashboard/atividades/${userId}`, { headers });
        const transformedMinhasAtividades = responseMinhasAtividades.data.map((item, index) => ({
          id: index,
          label: item[0],
          value: item[1],
        }));
        setMinhasAtividades(transformedMinhasAtividades);

        // Projetos Criados
        const responseProjetosCriados = await api.get(`/dashboard/projetos-criados/${userId}`, { headers });
        setProjetosCriados(responseProjetosCriados.data);

        // Projetos Alocados
        const responseProjetosAlocados = await api.get(`/dashboard/projetos-alocados/${userId}`, { headers });
        setProjetosAlocados(responseProjetosAlocados.data);

        // Projetos Concluídos
        const responseProjetosConcluidos = await api.get(`/dashboard/projetos-concluidos/${userId}`, { headers });
        setProjetosConcluidos(responseProjetosConcluidos.data);

        // Atividades em Andamento
        const responseAtividadesAndamento = await api.get(`/dashboard/atividades-andamento/${userId}`, { headers });
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

     {/* Dentro do return, na seção do Gráfico de Barras*/}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Atividades Concluídas por Projeto</Text>
          {atividadesConcluidasPProjeto.length > 0 ? (
            <BarChart
              data={{
                labels: atividadesConcluidasPProjeto.map(item => item.label),
                datasets: [
                  {
                    data: atividadesConcluidasPProjeto.map(item => item.value),
                  },
                ],
              }}
              width={screenWidth - 45}
              height={320}
              fromZero={true}
              showValuesOnTopOfBars={true}
              withInnerLines={false}
              withHorizontalLabels={false}
              chartConfig={chartConfig}
              verticalLabelRotation={20}
            />
          ) : (
            <Text style={styles.noDataText}>Sem atividades concluídas</Text>
          )}
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
              legendFontColor: '#3E3E3E',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 45
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
    fontSize: 15,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#407BFF',
  },
});

export default DashboardUser;