import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { listarCategorias, mostrarServicios, registrar, actualizar, eliminar, eliminarVarios } from '../../services/apiService';
import 'primeflex/primeflex.css';

const CardBox = () => {

    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        async function listarServicios() {
            try {
                const servicios = await mostrarServicios();
                setServicios(servicios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, []);


    const renderCards = () => {
        return servicios.map((servicio) => (
            <div className="col-12 md:col-6" key={servicio.id}>
                <Card
                    title={servicio.nombre_servicio}
                    subTitle={servicio.nombre_categoria}
                    style={{ width: '100%' }}
                    className="p-shadow-10"

                    header={renderHeader(servicio.ruta_imagen)}
                >
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Descripción: {servicio.descripcion_servicio}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Precio: {servicio.precio}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Código: {servicio.id}</p>
                </Card>
            </div>
        ));
    };

    const renderHeader = (rutaImagen) => {
        return <img alt="Card" src={rutaImagen} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />;
    };

    

    return (
        <div className="grid p-fluid">
            {renderCards()}
            
        </div>
    );
}


export default CardBox;
