import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import api from './configs/api';  // Certifique-se de ajustar o caminho conforme seu projeto

const Atividades = () => {
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const response = await api.get('/Atividade/1'); // substitua o ID conforme necessário
        setAtividades(response.data);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    fetchAtividades();
  }, []);

  return (
    <View style={styles.container}>
      {atividades.length > 0 ? (
        atividades.map((atividade) => (
          <View key={atividade.id} style={styles.atividade}>
            <Text>{atividade.nome}</Text>
            <Text>{atividade.estado}</Text>
            <Text>{atividade.tempo_execucao}</Text>
          </View>
        ))
      ) : (
        <Text>Nenhuma atividade encontrada</Text>
      )}
    </View>
  );
};

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
