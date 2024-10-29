import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { PieChart } from 'react-native-chart-kit';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabMenu from '../components/TabMenu';

const screenWidth = Dimensions.get('window').width;

const DashboardProjeto = () => {
  const [projetos, setProjetos] = useState([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [minhasAtividades, setMinhasAtividades] = useState([]);
  const [atividadesNIniciadas, setAtividadesNIniciadas] = useState(0);
  const [atividadesParaConcluir, setAtividadesParaConcluir] = useState(0);
  const [atividadesRefeitas, setAtividadesRefeitas] = useState(0);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState({ concluidas: 0, total: 0 });
  const [listagemAtividades, setListagemAtividades] = useState([]);
  const [integranteMaisEntregas, setIntegranteMaisEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ['#407BFF', '#79A2FE', '#48beff', '#9FBDFF', '#73d2de', '#a1cdf4', '#60b2e5', '#457eac'];

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const user = await AsyncStorage.getItem('@user');
        const userId = JSON.parse(user).id;
        
        // Substitua pela URL do seu backend
        const response = await fetch(`http://192.168.0.100:8080/Projeto/porUsuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
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
    const fetchAtividades = async () => {
      if (!projetoSelecionado) return;

      try {
        const token = await AsyncStorage.getItem('@tokenJWT');
        const user = await AsyncStorage.getItem('@user');
        const userId = JSON.parse(user).id;

        const response = await fetch(`http://192.168.0.100:8080/dashboard-projeto/listagem-das-atividades-por-projeto/${userId}/${projetoSelecionado}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setListagemAtividades(data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    fetchAtividades();
  }, [projetoSelecionado]);


  const handleProjetoChange = (itemValue) => {
    setProjetoSelecionado(itemValue);
  };

  const porcentagem = atividadesConcluidas.total > 0 
    ? ((atividadesConcluidas.concluidas / atividadesConcluidas.total) * 100).toFixed(2) 
    : 0;

  return (
    <> 
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Gestão dos Trabalhos</Text>

      {/* Seletor de Projeto */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={projetoSelecionado}
          onValueChange={handleProjetoChange}
          style={styles.picker}
        >
          {projetos.map((projeto) => (
            <Picker.Item key={projeto.id} label={projeto.titulo} value={projeto.id} />
          ))}
        </Picker>
      </View>

      {/* Gráfico de Barras */}
      <Text style={styles.chartTitle}>Atividades Concluídas por Trabalho</Text>
      <BarChart
        data={{
          labels: ['Concluídas', 'Total'],
          datasets: [{ data: [atividadesConcluidas.concluidas, atividadesConcluidas.total] }],
        }}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#FFF",
          color: () => '#407BFF',
        }}
        style={styles.chart}
      />

      {/* Gráfico de Pizza */}
      <Text style={styles.chartTitle}>Todas Atividades</Text>
      <PieChart
        data={minhasAtividades.map((item, index) => ({
          name: item.label,
          population: item.value,
          color: colors[index % colors.length],
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        }))}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#FFF",
          backgroundGradientTo: "#FFF",
          color: () => '#407BFF',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Listagem de Atividades */}
      <Text style={styles.chartTitle}>Quantidade de Retrabalho nas Atividades</Text>
      <FlatList
        data={listagemAtividades}
        keyExtractor={(item) => item[0]?.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listTitle}>{item[0]?.titulo}</Text>
            <Text style={styles.listDetails}>
              Responsável: {item[0]?.responsavel.nome} | Refeita {item[0]?.quantidade_retrabalho}x
            </Text>
          </View>
        )}
      />

      {/* Resumo das Atividades */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total Não Iniciadas</Text>
          <Text style={styles.summaryNumber}>{atividadesNIniciadas}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Para Concluir</Text>
          <Text style={styles.summaryNumber}>{atividadesParaConcluir}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Refeitas</Text>
          <Text style={styles.summaryNumber}>{atividadesRefeitas}</Text>
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
    padding: 15,
    backgroundColor: '#F8F8F8',
    marginTop:45
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginVertical: 20,
    borderColor: '#407BFF',
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  chart: {
    marginBottom: 20,
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryNumber: {
    fontSize: 24,
    color: '#407BFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardProjeto;
