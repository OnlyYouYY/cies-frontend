import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export async function login(username, password) {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function register(nombre, apellido, correo, contrasenia, rol) {
  try {
    const response = await axios.post(`${BASE_URL}/usuarios/registrar`, { nombre, apellido, correo, contrasenia, rol });
    return response.data;
  } catch (error) {
    throw error;
  }
}
