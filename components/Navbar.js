import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

const Navbar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      {/* Ícone de Home (Agora à Esquerda) */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={28} color="#007bff" />
      </TouchableOpacity>

      {/* Ícone de Dashboard (Agora no Meio) */}
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Ionicons name="grid-outline" size={28} color="#007bff" />
      </TouchableOpacity>

      {/* Ícone de Notificações */}
      <TouchableOpacity onPress={() => navigation.navigate('Notificacoes')}>
        <Ionicons name="notifications-outline" size={28} color="#007bff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
  },
});

export default Navbar;
