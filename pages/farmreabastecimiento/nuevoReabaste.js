import React, { useEffect, useState, useRef, use } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarProveedores,registrar} from '../../services/apiReabastecimiento';

export const NuevoReabastecimiento = () => {
    let emptyRestock = {
        pedido_producto: '',
        cantidad_reabastecida: 0,
        fecha_reabastecimiento: '',
        costo_total: 0
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [proveedores, setProveedores] = useState([]);
    const [reabastecimiento, setReabastecimiento] = useState(emptyRestock);
    const [listboxValue, setListboxValue] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    async function registrarReabastecimiento() {
        if (reabastecimiento.pedido_producto != '' &&
            listboxValue.id_proveedor != null &&
            reabastecimiento.cantidad_reabastecida > 0 &&
            reabastecimiento.fecha_reabastecimiento != "" &&
            reabastecimiento.costo_total > 0
            ) { 
            try {
                const response = await registrar(reabastecimiento.cantidad_reabastecida, listboxValue.id_proveedor, reabastecimiento.cantidad_reabastecida.reabastecimiento.fecha_reabastecimiento, reabastecimiento.costo_total);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: '¡Agregado!', life: 3000 });
                setReabastecimiento(emptyRestock);
                setListboxValue(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    useEffect(() => {
        async function obtenerproveedores() {
            try {
                const categorias = await listarProveedores();
                setProveedores(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerproveedores();
    }, []);

    const handleSubmit = async () => {
        console.log(reabastecimiento);
        registrarReabastecimiento();
    };
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            [name]: value
        }));
    };
    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            [name]: parseFloat(value)
        }));
    };

    const onInputNumberChangeI = (e) => {
        const { name, value } = e.target;
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            [name]: parseInt(value)
        }));
    };

    const onDateChange = (e) => {
        setReabastecimiento(prevRestock => ({
            ...prevRestock,
            fecha_reabastecimiento: e.value
        }));
    };

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">
                    <h5>Nuevo Registro de Reabastecimiento</h5>
                    <div className="field">
                        <label htmlFor="pedido_producto">Nombre Pedido del Producto</label>
                        <InputText id="pedido_producto" name="pedido_producto" value={reabastecimiento.pedido_producto} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': reabastecimiento.pedido_producto })} />
                        {submitted && !reabastecimiento.pedido_producto && <small className="p-invalid">El nombre del priducto pedido es requerido.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="id_proveedor">Proveedor Disponibles</label>
                        <Dropdown value={listboxValue} onChange={(e) => setListboxValue(e.value)} filterPlaceholder='Buscar proveedor' options={proveedores} optionLabel="nombre_proveedor" filter />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad">Cantidad Pedida</label>
                        <InputNumber id="cantidad" value={reabastecimiento.cantidad_reabastecida} name='cantidad' onValueChange={onInputNumberChangeI}/>
                    </div>

                    <div className="field" col>
                        <label htmlFor="fecha_pedido">Fecha del Pedido</label>
                        <Calendar id="fecha_pedido" name="fecha_pedido" value={reabastecimiento.fecha_reabastecimiento} onChange={onDateChange} showIcon />
                    </div>

                    <div className="field">
                        <label htmlFor="costo_total">Precio Total del Pedido</label>
                        <InputNumber id="costo_total" value={reabastecimiento.costo_total} name='costo_total' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                    </div>

                    <div className="field">
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setReabastecimiento(emptyRestock);
                                setListboxValue(null);
                            }} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default NuevoReabastecimiento;