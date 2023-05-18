import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export async function registrar(nombre_servicio, descripcion_servicio, precio, id_categoria) {
    try {
        const response = await axios.post(`${BASE_URL}/servicios/registrar`, {nombre_servicio, descripcion_servicio, precio, id_categoria});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function actualizar(id, nombre_servicio, descripcion_servicio, precio, id_categoria ){
    try {
        const response = await axios.put(`${BASE_URL}/servicios/actualizar/${id}`,{nombre_servicio, descripcion_servicio, precio, id_categoria});
        return response.data;
    }
    catch(error){
        throw error;
    }

}

export async function listarCategorias(){
    try {
        const response = await axios.get(`${BASE_URL}/servicios/categorias`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function mostrarServicios(){
    try {
        const response = await axios.get(`${BASE_URL}/servicios/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

