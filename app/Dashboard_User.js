import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TabMenu from '../components/TabMenu';

const Dashboard_User = () => {
  const navigation = useNavigation();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [barData, setBarData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await fetch('https://sua-api.com/projetos'); // Substitua pela sua URL
        const tasksResponse = await fetch('https://sua-api.com/tarefas'); // Substitua pela sua URL
        const projetosData = await projectsResponse.json();
        const tarefasData = await tasksResponse.json();

        setProjects(projetosData);
        setTasks(tarefasData);

        // Exemplo de dados analíticos
        const completedTasks = tarefasData.filter(task => task.completed).length;
        const inProgressTasks = tarefasData.filter(task => !task.completed && task.dueDate >= new Date()).length;

        // Aqui você pode personalizar os dados para os gráficos conforme necessário
        setActivityData([
          { label: 'Concluído', value: completedTasks, color: '#00C851' },
          { label: 'Em andamento', value: inProgressTasks, color: '#FFC107' },
          { label: 'A Fazer', value: tarefasData.length - completedTasks - inProgressTasks, color: '#FF4444' },
        ]);

        // Para o gráfico de barras, você pode contar as tarefas por projeto
        const projectActivity = projetosData.map(projeto => ({
          label: projeto.name,
          value: tarefasData.filter(task => task.projectId === projeto.id).length,
          color: 'blue', // ou uma cor específica para cada projeto
        }));
        setBarData(projectActivity);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGoHome = () => {
    navigation.navigate('Home'); // Navega para a tela "Home"
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  const maxActivityValue = Math.max(...activityData.map(item => item.value), 1); // Evita divisão por zero
  const maxBarValue = Math.max(...barData.map(item => item.value), 1); // Evita divisão por zero

  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoHome}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>VISÃO GERAL DOS SEUS PROJETOS</Text>
      </View>

      {projects.length === 0 && tasks.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Nenhum projeto ou tarefa encontrada.</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItemContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{tasks.length}</Text>
                <Text style={styles.summaryItemLabel}>Tarefas a Fazer</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{activityData[1]?.value || 0}</Text>
                <Text style={styles.summaryItemLabel}>Em andamento</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemNumber}>{activityData[0]?.value || 0}</Text>
                <Text style={styles.summaryItemLabel}>Feito</Text>
              </View>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Progresso Atual</Text>
            <View style={styles.progressItems}>
              <Text style={styles.progressItemNumber}>{activityData.reduce((acc, curr) => acc + curr.value, 0)}/{tasks.length}</Text>
              <Text style={styles.progressItemLabel}>Progresso Atual</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ATIVIDADE RECENTE</Text>
            <View style={styles.activityChart}>
              {activityData.map((item, index) => (
                <View key={index} style={[styles.activityBar, { height: `${(item.value / maxActivityValue) * 100}%`, backgroundColor: item.color || 'blue' }]}>
                  <Text style={styles.activityLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
            <ScrollView horizontal={true} style={styles.activityLegendContainer}>
              <View style={styles.activityLegend}>
                {activityData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendCircle, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.barChartContainer}>
            <Text style={styles.sectionTitle}>ATIVIDADES CONCLUÍDAS POR PROJETO</Text>
            <View style={styles.barChart}>
              {barData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[styles.bar, {
                      height: `${(item.value / maxBarValue) * 100}%`,
                      backgroundColor: item.color || 'blue',
                    }]}
                  />
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.tasksContainer}>
            <Text style={styles.tasksTitle}>TAREFAS EM REVISÃO</Text>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <View style={styles.taskDetails}>
                  <Text style={styles.taskType}>{task.type}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                  <Text style={styles.taskDue}>{task.due}</Text>
                </View>
                <View style={styles.taskStatus}>
                  <Text style={styles.taskStatusText}>{task.completed ? 'Concluída' : 'Pendente'}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
    <TabMenu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 40,
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
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItemNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressItemLabel: {
    fontSize: 14,
  },
  tasksContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskDue: {
    fontSize: 12,
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  taskStatusText: {
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityChart: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  activityBar: {
    width: 40,
    alignItems: 'center',
  },
  activityLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  activityLegendContainer: {
    marginTop: 10,
  },
  activityLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  barChartContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  barChart: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    width: 40,
  },
  bar: {
    width: '100%',
  },
  barLabel: {
    marginTop: 5,
    fontSize: 12,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard_User;
