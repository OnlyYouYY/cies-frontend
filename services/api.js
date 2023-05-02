import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export async function login(username, password) {
  try{
    const response = await axios.post(`${BASE_URL}/usuarios/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
  
}

// export async function register(username, password) {
//   try{
//     const response = await axios.post(`${BASE_URL}/usuarios/login`, { username, password });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
  
// }
