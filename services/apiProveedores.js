import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api';


//listara todos los proveedores que estas con estado 1 o activo o true
export async function listarProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/proveedores/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//lo que hara es registrar nuevos proveedores con sus datos correcpondientes
export async function registrar(nombre_proveedor, representante, telefono, descripcion_proveedor) {
    try {
        const response = await axios.post(`${BASE_URL}/proveedores/registrar`, {nombre_proveedor, representante, telefono, descripcion_proveedor});
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//actualizara los proveedores que no esten bien registrados 
export async function actualizar(id_proveedor ,nombre_proveedor, representante, telefono, descripcion_proveedor ){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/modificar/${id_proveedor}`,{nombre_proveedor, representante, telefono, descripcion_proveedor});
        return response.data;
    }
    catch(error){
        throw error;
    }

}

//eliminara o cambiara el estado de activo a inactivo de un proveedores en especifico 
export async function eliminar(id_medicamento){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/eliminar/${id_medicamento}`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

//eliminara o cambiara el estado de activo a inactivo de varios proveedores
export async function eliminarVarios(ids){
    try {
        const response = await axios.put(`${BASE_URL}/proveedores/eliminarproveedores`,{ids});
        return response.data;
    }
    catch(error){
        throw error;
    }
}
