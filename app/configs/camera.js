import React, { useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setJwtToken(data);  // Aqui está o token JWT capturado
    console.log(`Token JWT capturado: ${data}`);

    // Enviar o token JWT para o backend ou armazenar para uso posterior
    axios.get('http://localhost:8080/some-endpoint', {
      headers: {
        Authorization: `Bearer ${data}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log('Dados recebidos:', response.data);
    })
    .catch(error => {
      console.error('Erro ao conectar-se ao backend:', error);
    });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Sem acesso à câmera</Text>;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 400, width: 400 }}
      />
      {scanned && <Button title={'Escanear novamente'} onPress={() => setScanned(false)} />}
      {jwtToken && <Text>Token JWT: {jwtToken}</Text>}
    </View>
  );
}
