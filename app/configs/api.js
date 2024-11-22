import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//API LOCAL//
// const api = axios.create({
//   baseURL: 'http://localhost:8080',
// });
//DEPLOY//
const api = axios.create({
  baseURL: 'http://192.168.5.112:8080', //http://192.168.83.212:8080
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@tokenJWT');
  if (token) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgVm9sbC5tZWQiLCJzdWIiOiJ2aWdvbmNhbHZlc3BAZ21haWwuY29tIiwiaWQiOjN9.Z4YBUFcYjqmFPBXQ0BmWB9b0qda7Zx5Nxwcxi7MycCc`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});





export default api;
