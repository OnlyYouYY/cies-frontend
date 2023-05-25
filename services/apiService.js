import axios from 'axios';

const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';

export async function registrar(nombre_servicio, descripcion_servicio, precio, id_categoria, imagen) {
    try {
        const formData = new FormData();
        formData.append('nombre_servicio', nombre_servicio);
        formData.append('descripcion_servicio', descripcion_servicio);
        formData.append('precio', precio);
        formData.append('id_categoria', id_categoria);
        formData.append('imagen', imagen);

        const response = await axios.post(`${BASE_URL}/servicios/registrar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function actualizar(id, nombre_servicio, descripcion_servicio, precio, id_categoria) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/actualizar/${id}`, { nombre_servicio, descripcion_servicio, precio, id_categoria });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function eliminar(id) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminar/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/servicios/eliminarServicios`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarCategorias() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/categorias`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarServicios() {
    try {
        const response = await axios.get(`${BASE_URL}/servicios/`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

