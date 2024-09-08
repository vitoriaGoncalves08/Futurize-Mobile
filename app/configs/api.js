import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL da API
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBUEkgVm9sbC5tZWQiLCJzdWIiOiJmYXZAZ21haWwuY29tIiwiaWQiOjUwfQ.AA9OYwn-V1tL_kYH7U5PIPB8oxJebY3-ZPOaSeDbI9E`,
    'Content-Type': 'application/json',
  },
});


export default api;
