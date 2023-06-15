import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { listarProductos} from '../../services/apiProductos';
import 'primeflex/primeflex.css';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const CardBox = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'farmaceutico', 'medico', 'recepcionista'];

    useEffect(()=>{
        if (typeof window !== 'undefined') {
            const rolUsuarioEncriptado = localStorage.getItem('userRole');
            if (session == null || rolUsuarioEncriptado == null) {
                router.replace('/pages/notfound');
                return;
            }
            const rolUsuario = decryptData(rolUsuarioEncriptado);
            if (!rolesPermitidos.includes(rolUsuario)) {
                router.replace('/pages/notfound');
                return;
            }
        }
    });

    const [productos, setProductos] = useState([]);
    useEffect(() => {
        async function mostrarProductos() {
            try {
                const productos = await listarProductos();
                setProductos(productos);
            }
            catch (error) {
                console.log(error);
            }
        }
        mostrarProductos();
    }, []);

    const renderCards = () => {
        return productos.map((producto) => (
            <div className="col-12 md:col-6" key={producto.id_medicamento}>
                <Card
                    title={producto.nombre_medicamento}
                    subTitle={producto.nombre_categoria}
                    style={{ width: '100%' }}
                    className="p-shadow-10"

                    //header={renderHeader(producto.ruta_imagen)}
                >
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Proveedor: {producto.nombre_proveedor}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Precio: {producto.precio_unitario}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Código: {producto.id_medicamento}</p>
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
