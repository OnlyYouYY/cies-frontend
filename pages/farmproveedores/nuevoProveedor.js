import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarProveedores,registrar} from '../../services/apiProveedores';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';


export const NuevoProveedor = () => {

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

    let emptyService = {
        nombre_proveedor: '',
        representante: '',
        telefono: '',
        descripcion: ''
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [proveedores, setProveedores] = useState(emptyService);
    const [telefono, setTelefono] = useState('');
    const [submitted, setSubmitted] = useState(false);

    //registrar nuevo proveedor
    async function registrarProveedor() {
        if (proveedores.nombre_proveedor.trim() !== "" &&
            proveedores.representante.trim() !== "" && 
            telefono !== "" && 
            proveedores.descripcion !== "") {
            try {
                const response = await registrar(proveedores.nombre_proveedor,proveedores.representante,telefono,proveedores.descripcion);
                console.log(response);
                toast.current.show({severity: 'success', summary: 'Exitoso', detail: 'Proveedor agregado', life: 3000});
                setTelefono(null);
                setProveedores(emptyService);
                fileUploadRef.current.clear();
            } catch (error) {
                console.log(error);
            }
        }else{
            toast.current.show({ severity: 'warning', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    const handleSubmit = async () => {
        console.log(proveedores);
        registrarProveedor();
    };

    const onInputChange = (e) => {
        const {name,value} = e.target;
        setProveedores(prevProveedores => ({
            ...prevProveedores,
            [name]:value
        }));
    };

    const handleTelefonoChange = (event) => {
        const inputValue = event.target.value;
        const numericValue = inputValue.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
        const limitedValue = numericValue.slice(0, 8); // Limita a 10 caracteres

        setTelefono(limitedValue);
    };
    
    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-12'>
                <div className='card p-fluid'>
                    <h5>Nuevo Proveedor</h5>
                    <div className='field'>
                        <label htmlFor='nombreProveedor'>Nombre del Proveedor</label>
                        <InputText id='nombre_proveedor' name='nombre_proveedor' value={proveedores.nombre_proveedor} onChange={onInputChange} required autoFocus className={classNames({'p-invalid' : submitted && !proveedores.nombre_proveedor})}/>
                        {submitted && !proveedores.nombre_proveedor && <small className='p-invalid'>Nombre del Proveedor, requerido.</small>}
                    </div>

                    <div className='field'>
                        <label htmlFor='Representante'>Representante del Proveedor</label>
                        <InputText id='representante' name='representante' value={proveedores.representante} onChange={onInputChange} required autoFocus className={classNames({'p-invalid' : submitted && !proveedores.representante})}/>
                        {submitted && !proveedores.representante && <small className='p-invalid'>Nombre del Representante del Proveedor, requerido.</small>}
                    </div>

                    <div className='field'>
                        <label htmlFor='telefono'>Telefono de la Proveedora</label>
                        <InputText
                            id='telefono'
                            name='telefono'
                            value={telefono}
                            onChange={handleTelefonoChange}
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !telefono })}
                        />
                        {submitted && !telefono && (
                        <small className='p-invalid'>Numero Telefonico, requerido.</small>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <InputTextarea id="descripcion" name="descripcion" onChange={onInputChange} value={proveedores.descripcion} required rows={3} cols={20} />
                    </div>

                    <div className="field">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                disabled={!setProveedores}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setProveedores(emptyService);
                            }} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NuevoProveedor;
