import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//API LOCAL//
// const api = axios.create({
//   baseURL: 'http://localhost:8080',
// });
//DEPLOY//
const api = axios.create({
  baseURL: 'http://192.168.15.26:8080',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@tokenJWT');
  if (token) {
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgVm9sbC5tZWQiLCJzdWIiOiJ2aUBnbWFpbC5jb20iLCJpZCI6MX0.gPeiPgT8VusxlIqU2pajcOaNFhh-WUbweg92IUz5VXE`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});





export default api;
