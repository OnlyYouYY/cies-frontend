import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { listarProveedores} from '../../services/apiProveedores';
import 'primeflex/primeflex.css';
import { render } from 'react-dom';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';


const CardBox = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'farmaceutico'];

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

    const [proveedores, setProveedores] = useState([]);

    useEffect(()=>{
        async function mostrarProveedores() {
            try {
                const proveedores = await listarProveedores();
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        mostrarProveedores();
    },[]);

    const renderCards = () => {
        return proveedores.map((proveedor) => (
            <div className='col-12 md:col-6' key={proveedor.id_proveedor}>
                <Card
                    title={proveedor.nombre_proveedor}
                    subTitle={proveedor.telefono}
                    style={{ width: '100%' }}
                    className="p-shadow-10"
                    >
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Proveedor: {proveedor.nombre_proveedor}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Precio: {proveedor.representante}</p>
                    <p className="p-m-0" style={{ lineHeight: '1.5' }}>Código: {proveedor.descripcion_proveedor}</p>
                </Card>
            </div>
        ));
    };

    return (
        <div className='grid p-fluid'>
            {renderCards()}
        </div>

    );
};
export default CardBox;