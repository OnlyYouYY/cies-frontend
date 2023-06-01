import axios from 'axios';

const BASE_URL = 'https://app-84d299d1-f2c1-4453-b186-40061aa20a53.cleverapps.io/api';

export async function registrar(pedido_producto, id_proveedor, cantidad_reabastecida, fecha_reabastecimiento, numero_factura, costo_total) {
    try {
        const formData = new FormData();
        formData.append('pedido_producto', pedido_producto);
        formData.append('id_proveedor', id_proveedor);
        formData.append('cantidad_reabastecida', cantidad_reabastecida);
        formData.append('fecha_reabastecimiento', fecha_reabastecimiento);
        formData.append('costo_total', costo_total);
        //formData.append('imagen', imagen); //crea folder es especifico -> para lo que quiero productos 

        const response = await axios.post(`${BASE_URL}/reabastecer/registrar`, formData, {
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
export async function actualizar(id_reabastecimiento, pedido_producto,id_proveedor, cantidad_reabastecida, fecha_reabastecimiento , costo_total) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/actualizar/${id_reabastecimiento}`, { pedido_producto,id_proveedor, cantidad_reabastecida, fecha_reabastecimiento , costo_total });
        return response.data;
    }
    catch (error) {
        throw error;
    }

}

export async function eliminar(id_reabastecimiento) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/eliminar/${id_reabastecimiento}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function eliminarVarios(ids) {
    try {
        const response = await axios.put(`${BASE_URL}/reabastecer/eliminarVarios`, { ids });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export async function listarProveedores(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/proveedores`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export async function listarReabasteci(){
    try {
        const response = await axios.get(`${BASE_URL}/reabastecer/`);
        return response.data;
    }
    catch(error){
        throw error;
    }
}