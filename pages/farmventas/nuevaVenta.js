import React, { useEffect, useState, useRef, use } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarMedicamentos,registrar} from '../../services/apiVentas';
import NuevoProducto from '../farmproductos/nuevoProducto';


export const NuevaVenta = () => {
    let emptySell = {
        cantidad_vendida: 0,
        fecha_venta: null,
        total_venta: 0
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [medicamentos, setMedicamentos] = useState([]);
    const [venta, setVenta] = useState(emptySell);
    const [listboxValueM, setListboxValueM] = useState(null);

    async function registrarVenta() {
        if (listboxValueM.id_mediamento != null &&
            venta.cantidad_vendida > 0 &&
            venta.fecha_venta != "" &&
            venta.total_venta > 0
            ) { 
            try {
                const response = await registrar(listboxValueM.id_mediamento, venta.cantidad_vendida, venta.fecha_venta, venta.total_venta);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Venta agregada', life: 3000 });
                setVenta(emptySell);
                fileUploadRef.current.clear();
                setListboxValueM(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }
    //cargar todas los medicamentos para seleccionar
    useEffect(()=>{
        async function obtenermedicamentos() {
            try {
                const medicamentos = await listarMedicamentos();
                setMedicamentos(medicamentos);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenermedicamentos();
    }, []);

    const handleSubmit = async () => {
        console.log(venta);
        registrarVenta();
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setVenta(prevSell => ({
            ...prevSell,
            [name]: parseFloat(value)
        }));
    };

    const onDateChange = (e) => {
        setVenta(prevSell => ({
            ...prevSell,
            fecha_venta: e.value
        }));
    };

    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-12'>
                <div className='card p-fluid'>
                    <h5>Nueva Venta</h5>
                    
                    <div className="field">
                        <label htmlFor="nombreMedicamento">Medicamentos Disponibles</label>
                        <Dropdown value={listboxValueM} onChange={(e) => setListboxValueM(e.value)} filterPlaceholder='Buscar medicamento' options={medicamentos} optionLabel="nombre_medicamento" filter />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad_vendida">Cantidad del Producto Vendido</label>
                        <InputNumber id="cantidad_vendida" value={venta.cantidad_vendida} name="cantidad_vendida" onValueChange={onInputNumberChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="fecha_venta">Fecha de Registro</label>
                        <Calendar id="fecha_venta" name="fecha_venta" value={venta.fecha_venta} onChange={onDateChange} showIcon />
                    </div>

                    <div className="field">
                        <label htmlFor="total_venta">Monto Total del Medicamento</label>
                        <InputNumber
                            id="total_venta"
                            value={venta.total_venta}
                            name="total_venta"
                            onValueChange={onInputNumberChange}
                            mode='currency'
                            currency='BOB'
                            locale='es-BO'
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setVenta(emptySell);
                                setListboxValueM(null);
                            }} />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default NuevaVenta;