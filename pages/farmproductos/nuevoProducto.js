import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarCategorias,listarProveedores,registrar} from '../../services/apiProductos';


export const NuevoProducto = () => {
    let emptyService = {
        nombre_medicamento: '',
        precio: 0,
        cantidad: 0,
        fechacaducidad: null
    };
    
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [producto, setProducto] = useState(emptyService);
    const [listboxValueP, setListboxValueP] = useState(null);
    const [listboxValueC, setListboxValueC] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    //Registrar Nuevo Producto
    async function registrarProducto() {
        if (producto.nombre_medicamento.trim() !== "" &&
            listboxValueP != null &&
            listboxValueC != null &&
            producto.precio > 0 &&
            producto.cantidad > 0 &&
            producto.fechacaducidad ) { 
            try {
                const response = await registrar(producto.nombre_medicamento, listboxValueP.idp ,listboxValueC.idc,producto.precio_unitario, producto.cantidad, producto.fechacaducidad);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto agregado', life: 3000 });
                setProducto(emptyService);
                fileUploadRef.current.clear();
                setListboxValueP(null);
                setListboxValueC(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }
    }

    //cargar todas las categorias de proveedores 
    useEffect(()=>{
        async function obtenercatergoriasproveedores() {
            try {
                const categoriasp = await listarProveedores();
                setProveedores(categoriasp);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenercatergoriasproveedores();
    }, []);

    //cargar todas las categorias de productos
    useEffect(()=>{
        async function obtenercatergoriasproductos() {
            try {
                const categoriasc = await listarCategorias();
                setCategorias(categoriasc);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenercatergoriasproductos();
    }, []);

    const handleSubmit = async () => {
        console.log(producto);
        registrarProducto();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProduct => ({
            ...prevProduct,
            [name]: parseFloat(value)
        }));
    };
    
    const onDateChange = (e) => {
        setProducto(prevProduct => ({
            ...prevProduct,
            fechacaducidad: e.value
        }));
    };

    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-12'>
                <div className='card p-fluid'>
                    <h5>Nuevo Producto</h5>
                    <div className='field'>
                        <label htmlFor='nombreProducto'>Nombre del Producto</label>
                        <InputText id="nombre_medicamento" name="nombre_medicamento" value={producto.nombre_medicamento} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre_medicamento })} />
                        {submitted && !producto.nombre_medicamento && <small className="p-invalid">El nombre es requerido.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="categoriaProveedores">Proveedores</label>
                        <Dropdown value={listboxValueP} onChange={(e) => setListboxValueP(e.value)} filterPlaceholder='Buscar Proveedor' options={proveedores} optionLabel="nombre_proveedor" filter /> {/**chequear bien */}
                    </div>
                    <div className="field">
                        <label htmlFor="categoriaProductos">Categoria Productos</label>
                        <Dropdown value={listboxValueC} onChange={(e) => setListboxValueC(e.value)} filterPlaceholder='Buscar categoria' options={categorias} optionLabel="nombre_categoria" filter />
                    </div>

                    <div className="field">
                        <label htmlFor="precio">Precio Unidad</label>
                        <InputNumber id="precio" value={producto.precio} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad">Cantidad</label>
                        <InputNumber id="cantidad" value={producto.cantidad} name="cantidad" onValueChange={onInputNumberChange} />
                    </div>


                    <div className="field" col>
                        <label htmlFor="fecha">Fecha de Caducidad</label>
                        <Calendar id="fecha" name="fechacaducidad" value={producto.fechacaducidad} onChange={onDateChange} showIcon />
                    </div>


                    <div className="field">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                disabled={!setProducto}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setProducto(emptyService);
                                setListboxValueC(null);
                            }} />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NuevoProducto;