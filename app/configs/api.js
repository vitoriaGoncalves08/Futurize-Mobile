import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL da API
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgVm9sbC5tZWQiLCJzdWIiOiJ2aUBnbWFpbC5jb20iLCJpZCI6Mn0.IWe50jp9i2KRhUpbUIULeygwLaBMeqWqpG686cBmTdE`,
    'Content-Type': 'application/json',
  },
});


export default api;
