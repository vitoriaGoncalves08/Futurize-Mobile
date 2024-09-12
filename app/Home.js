import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from './configs/api';

const Atividades = () => {
  const [atividades, setAtividades] = useState([]);

  // Função para buscar atividades da API
  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await api.get('/Atividade/1'); // Substitua o ID conforme necessário
        setAtividades(response.data); // Salvando dados no estado
      } catch (error) {
        console.error("Erro ao buscar atividades:", error.message); // Log do erro
      }
    };

    fetchAtividades(); // Chamando a função ao carregar o componente
  }, []);

  return (
    <View style={styles.container}>
      {atividades.length > 0 ? (
        atividades.map((atividade) => (
          <View key={atividade.id} style={styles.atividade}>
            <Text>{atividade.titulo}</Text>
            <Text>{atividade.estado}</Text>
            <Text>{atividade.tempo_execucao}</Text>
            <Text>{atividade.projeto.titulo}</Text>
          </View>
        ))
      ) : (
        <Text>Nenhuma atividade encontrada</Text>
      )}
    </View>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  atividade: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});

export default Atividades;
