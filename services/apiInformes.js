import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

export async function serviciosUtilizados() {
    try {
        const response = await axios.get(`${BASE_URL}/informes/serviciosutilizados`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function cantidadPacientes() {
    try {
        const response = await axios.get(`${BASE_URL}/informes/cantidadpacientes`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
