import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { listarCategorias, mostrarServicios, registrar, actualizar, eliminar, eliminarVarios } from '../../services/apiService';

export const NuevoServicio = () => {

    let emptyService = {
        nombre_servicio: '',
        descripcion_servicio: '',
        precio: 0,
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [servicio, setServicio] = useState(emptyService);
    const [listboxValue, setListboxValue] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    //Registrar Servicio
    async function registrarServicio() {
        if (servicio.nombre_servicio.trim() !== "" &&
            servicio.descripcion_servicio.trim() !== "" &&
            servicio.precio > 0 &&
            listboxValue.id != null &&
            selectedImage) {
            try {
                const response = await registrar(servicio.nombre_servicio, servicio.descripcion_servicio, servicio.precio, listboxValue.id, selectedImage);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio creado', life: 3000 });
                setServicio(emptyService);
                fileUploadRef.current.clear();
                setListboxValue(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }

    }

    //Cargar categorias
    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.files[0];
        setSelectedImage(file);
        console.log(file);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Imagen Confirmada', life: 3000 })
    };

    const handleSubmit = async () => {
        console.log(servicio);
        registrarServicio();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setServicio(prevService => ({
            ...prevService,
            [name]: value
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setServicio(prevService => ({
            ...prevService,
            [name]: parseFloat(value)
        }));
    };


    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">

                    <h5>Nuevo Servicio</h5>
                    <div className="field">
                        <label htmlFor="nombreServicio">Nombre del servicio</label>
                        <InputText id="nombre_servicio" name="nombre_servicio" value={servicio.nombre_servicio} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !servicio.nombre_servicio })} />
                        {submitted && !servicio.nombre_servicio && <small className="p-invalid">El nombre es requerido.</small>}

                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <InputTextarea id="descripcion_servicio" name="descripcion_servicio" onChange={onInputChange} value={servicio.descripcion_servicio} required rows={3} cols={20} />
                    </div>

                    <div className="field">
                        <label htmlFor="precio">Precio</label>
                        <InputNumber id="precio" value={servicio.precio} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                    </div>
                    <div className="field">
                        <label htmlFor="categoria">Categoria</label>
                        <ListBox value={listboxValue} onChange={(e) => setListboxValue(e.value)} filterPlaceholder='Buscar categoria' options={categorias} optionLabel="nombre_categoria" filter />
                    </div>
                    <div className="field">
                        <label htmlFor="imagen">Imagen</label>
                        <FileUpload
                            ref={fileUploadRef}
                            name="demo"
                            chooseLabel="Seleccionar"
                            uploadLabel="Confirmar"
                            cancelLabel='Cancelar'
                            multiple={false}
                            className="custom-fileupload"
                            emptyTemplate="Arrastre y suelte una imagen aquí o suba una imagen."
                            customUpload
                            uploadHandler={handleFileUpload}
                        />

                    </div>
                    <div className="field">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                disabled={!selectedImage || !setServicio}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setServicio(emptyService);
                                setListboxValue(null);
                                setSelectedImage(null);
                            }} />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NuevoServicio;
