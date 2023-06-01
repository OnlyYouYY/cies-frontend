import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { registrar, listarDirecciones } from '../../services/apiPacientes';

export const NuevoPaciente = () => {

    let emptyPaciente = {
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        sexo: '',
        telefono: '',
        correo_electronico: '',
        usuario:'',
        contrasenia:'',
    };

    const toast = useRef(null);
    const [direccion, setDireccion] = useState([]);
    const [paciente, setPaciente] = useState(emptyPaciente);
    const [listboxValue, setListboxValue] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    //Registrar paciente
    async function registrarPaciente() {
        if (paciente.nombres.trim() !== "" &&
            paciente.apellidos.trim() !== "" &&
            paciente.fecha_nacimiento !== "" &&
            paciente.sexo.trim() !== "" &&
            paciente.telefono.trim() !== "" &&
            paciente.correo_electronico.trim() !== "" &&
            listboxValue.id != null &&
            paciente.usuario.trim() !== "" &&
            paciente.contrasenia.trim() !== "") {
            try {
                const response = await registrar(paciente.nombres, paciente.apellidos, paciente.fecha_nacimiento, paciente.sexo, paciente.telefono, paciente.correo_electronico, listboxValue.id, paciente.usuario, paciente.contrasenia);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Paciente registrado', life: 3000 });
                setPaciente(emptyPaciente);
                setListboxValue(null);
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }

    }

    //Cargar direcciones
    useEffect(() => {
        async function obtenerDirecciones() {
            try {
                const direccion = await listarDirecciones();
                console.log(direccion)
                setDireccion(direccion);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerDirecciones();
    }, []);

    /*
    const handleFileUpload = (event) => {
        const file = event.files[0];
        setSelectedImage(file);
        console.log(file);
        toast.current.show({ severity: 'success', summary: 'Exito', detail: 'Imagen Confirmada', life: 3000 })
    };
    */

    const handleSubmit = async () => {
        console.log(paciente);
        registrarPaciente();
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prevPaciente => ({
            ...prevPaciente,
            [name]: value
        }));
    };

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">

                    <h5>Registrar Paciente</h5>
                    <div className="field">
                        <label htmlFor="nombresPaciente">Nombres del paciente</label>
                        <InputText id="nombres" name="nombres" value={paciente.nombres} onChange={onInputChange} />
                        
                    </div>

                    <div className="field">
                        <label htmlFor="apellidosPaciente">Apellidos del paciente</label>
                        <InputText id="apellidos" name="apellidos" value={paciente.apellidos} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.apellidos })} />
                        {submitted && !paciente.apellidos && <small className="p-invalid">Los apellidos son requeridos.</small>}

                    </div>

                    <div className="field">
                        <label htmlFor="fecha_nacimiento">Fecha de nacimiento del paciente</label>
                        <Calendar
                            id="fecha_nacimiento"
                            name="fecha_nacimiento"
                            value={paciente.fecha_nacimiento}
                            onChange={onInputChange}
                            showIcon
                            dateFormat="yy/mm/dd"
                            required
                            autoFocus
                            className={classNames({ 'p-invalid': submitted && !paciente.fecha_nacimiento })}
                        />
                        {submitted && !paciente.fecha_nacimiento && (
                            <small className="p-invalid">La fecha de nacimiento es requerida.</small>
                        )}
                    </div>

                    {/*
                    <div className="field">
                        <label htmlFor="fecha_nacimiento">Fecha de nacimiento del paciente</label>
                        <InputText id="fecha_nacimiento" name="fecha_nacimiento" value={paciente.fecha_nacimiento} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.fecha_nacimiento })} />
                        {submitted && !paciente.fecha_nacimiento && <small className="p-invalid">La fecha de nacimiento es requerido.</small>}

                    </div>*/}

                    <div className="field">
                        <label htmlFor="sexo">Genero del paciente</label>
                        <InputText id="sexo" name="sexo" value={paciente.sexo} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.sexo })} />
                        {submitted && !paciente.sexo && <small className="p-invalid">El sexo es requerido.</small>}

                    </div>

                    <div className="field">
                        <label htmlFor="telefono">Telefono del paciente</label>
                        <InputText id="telefono" name="telefono" value={paciente.telefono} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.telefono })} />
                        {submitted && !paciente.telefono && <small className="p-invalid">El telefono es requerido.</small>}

                    </div>

                    <div className="field">
                        <label htmlFor="correo_electronico">Correo electronico del paciente</label>
                        <InputText id="correo_electronico" name="correo_electronico" value={paciente.correo_electronico} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.correo_electronico })} />
                        {submitted && !paciente.correo_electronico && <small className="p-invalid">El correo electronico es requerido.</small>}

                    </div>

                    <div className="field">
                        <label htmlFor="direccion">Direccion</label>
                        <ListBox value={listboxValue} onChange={(e) => setListboxValue(e.value)} filterPlaceholder='Buscar direccion' options={direccion} optionLabel="direccion" filter />
                    </div>


                    <div className="field">
                        <label htmlFor="usuario">Usuario</label>
                        <InputText id="usuario" name="usuario" value={paciente.usuario} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.usuario })} />
                        {submitted && !paciente.usuario && <small className="p-invalid">El usuario es requerido.</small>}

                    </div>

                    <div className="field">
                        <label htmlFor="contrasenia">Contraseña</label>
                        <InputText id="contrasenia" name="contrasenia" value={paciente.contrasenia} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.contrasenia })} />
                        {submitted && !paciente.contrasenia && <small className="p-invalid">La contrasenia es requerida.</small>}

                    </div>

                    {/*
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

                    */}
                    <div className="field">
                        <label htmlFor="opciones">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                                disabled={!setPaciente}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setPaciente(emptyPaciente);
                                setListboxValue(null);
                            }} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevoPaciente;