import axios from 'axios';

const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';

export async function registrar(nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia) {
    try {

        const response = await axios.post(`${BASE_URL}/pacientes/registrar`, {nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia});
        return response.data;
    }
    catch (error) {
        throw error;
    }
}



export async function actualizar(id, nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/actualizar/${id}`, { nombres, apellidos, fecha_nacimiento, sexo, telefono, correo_electronico, id_direccion, usuario, contrasenia });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function eliminar(id) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/delete/${id}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/pacientes/eliminarPacientes`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export async function listarDirecciones() {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/direccion`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function mostrarPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/pacientes/pacientes`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}