import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export async function addUsuarios(nombres, apellidos, correo, contrasenia, rol) {
    try {
        const response = await axios.post(`${BASE_URL}/usuarios/registrar`, { nombres, apellidos, correo, contrasenia, rol });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function actualizar(id, nombres, apellidos, correo, contrasenia, rol) {
    try {
        const response = await axios.put(`${BASE_URL}/usuarios/actualizar/${id}`, { nombres, apellidos, correo, contrasenia, rol });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUsuario(id) {
    try {
      const response = await axios.put(`${BASE_URL}/usuarios/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  

export async function mostrarUsuarios() {
    try {
        const response = await axios.get(`${BASE_URL}/usuarios/`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export async function getUsuario(id) {
    try {
      const response = await axios.get(`${BASE_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
    
export async function updateUsuario(id, nombres, apellidos, correo, contrasenia, rol) {
    try {
    const response = await axios.put(`${BASE_URL}/usuarios/actualizar/${id}`, {
        nombres,
        apellidos,
        correo,
        contrasenia,
        rol
    });
    return response.data;
    } catch (error) {
    throw error;
    }
}



export async function filtrarUsuarios(nombre, correo) {
    try {
    const response = await axios.get(`${BASE_URL}/usuarios/filtrar?nombres=${nombres}&correo=${correo}`);
    return response.data;
    } catch (error) {
    throw error;
    }
}
