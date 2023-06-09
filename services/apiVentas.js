import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';

//listara todos los ventas que estas con estado 1 o activo o true
export async function listarVentas(){
    try {
        const response = await axios.get(`${BASE_URL}/ventas/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function listarMedicamentos(){
    try {
        const response = await axios.get(`${BASE_URL}/ventas/medicamentos`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//lo que hara es registrar nuevos ventas con sus datos correcpondientes
export async function registrar(id_medicamento, cantidad_vendida, fecha_venta, total_venta) {
    try {
        const response = await axios.post(`${BASE_URL}/ventas/registrar`, {id_medicamento, cantidad_vendida, fecha_venta, total_venta});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//actualizara los ventas que no esten bien registrados 
export async function actualizar(id_venta,id_medicamento, cantidad_vendida, fecha_venta, total_venta ){
    try {
        const response = await axios.put(`${BASE_URL}/ventas/modificar/${id_venta}`,{id_medicamento, cantidad_vendida, fecha_venta, total_venta});
        return response.data;
    }
    catch(error){
        throw error;
    }

}

//eliminara o cambiara el estado de activo a inactivo de una venta en especifico 
export async function eliminar(id_venta){
    try {
        const response = await axios.put(`${BASE_URL}/ventas/eliminar/${id_venta}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//eliminara o cambiara el estado de activo a inactivo de varias ventas
export async function eliminarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/ventas/eliminarventas`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}