import React, { useState, useRef, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { listarCategorias, mostrarServiciosID, mostrarServiciosIDmedico, mostrarMedicosIDservicio } from '../../../services/apiService';

export default function ReservaCitas() {

    const toast = useRef(null);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);
    const [servicios, setServicios] = useState(null);
    const [servicio, setServicio] = useState(null);
    const [serviciosDropdown, setServiciosDropdown] = useState([]);
    const [medico, setMedico] = useState(null);
    const [medicos, setMedicos] = useState([]);
    const [medicosDropdown, setMedicosDropdown] = useState([]);
    const [infoMedico, setInfoMedico] = useState(null);
    const [infoMedicos, setInfoMedicos] = useState([]);
    const [fecha, setFecha] = useState(null);
    const [hora, setHora] = useState(null);
    const [medicosDelDia, setMedicosDelDia] = useState([]);

    const fechaActual = new Date();
    const opciones = { weekday: 'long' };
    const diaActual = new Intl.DateTimeFormat('es-ES', opciones).format(fechaActual);
    const diaActualCapitalizado = diaActual.charAt(0).toUpperCase() + diaActual.slice(1);



    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);

                const categoriasDropdown = categorias.map(categoria => ({
                    label: categoria.nombre_categoria,
                    value: categoria.id
                }));

                setCategoriasDropdown(categoriasDropdown);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);


    useEffect(() => {
        async function listarServicios() {
            try {
                if (categoria) {
                    const servicios = await mostrarServiciosID(categoria);
                    console.log(servicios);
                    setServicios(servicios);

                    const serviciosDropdown = servicios.map(servicio => ({
                        label: servicio.nombre_servicio,
                        value: servicio.id
                    }));

                    setServiciosDropdown(serviciosDropdown);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
    }, [categoria]);


    useEffect(() => {
        async function listarMedicos() {
            try {
                if (servicio) {
                    const medicos = await mostrarMedicosIDservicio(servicio);
                    console.log(medicos);
                    setMedicos(medicos);

                    const medicosDropdown = medicos.map(medico => ({
                        label: `${medico.nombres} ${medico.apellidos}`,
                        value: medico.id
                    }));

                    setMedicosDropdown(medicosDropdown);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        listarMedicos();
    }, [servicio]);

    useEffect(() => {
        async function obtenerInfoMedico() {
            try {
                if (medico) {
                    const infoMedicos = await mostrarServiciosIDmedico(medico);
                    console.log(infoMedicos);
                    setInfoMedicos(infoMedicos);

                    const medicosDelDia = infoMedicos.filter(infoMedico => infoMedico.dia_semana === diaActualCapitalizado);
                    setMedicosDelDia(medicosDelDia);
                    console.log(medicosDelDia);
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerInfoMedico();
    }, [medico]);


    const crearCita = () => {

    }

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}/${mes}/${anio}`;
    }

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">

                <div className="card p-fluid">
                    <h5>Registro de ficha</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="categoria">Categoria</label>
                                <Dropdown id="categoria" value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder="Seleccione una categoria" />
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="servicio">Servicio</label>
                                <Dropdown id="servicio" value={servicio} onChange={(e) => setServicio(e.value)} options={serviciosDropdown} placeholder="Seleccione un servicio" disabled={!categoria} />
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="medico">Médico</label>
                        <Dropdown id="medico" value={medico} onChange={(e) => setMedico(e.value)} options={medicosDropdown} placeholder="Seleccione un médico" disabled={!servicio} />
                    </div>
                    <div className="card">
                        <div className="field">
                            <label className='font-bold' htmlFor="medico">Informacion del medico</label>
                            <ul className="list-none p-0 m-0">
                                {medicosDelDia.map(infoMedico => (
                                    <React.Fragment key={infoMedico.id}>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Servicio</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.nombre_servicio}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Dia actual</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                <Chip label={infoMedico.dia_semana} className="mr-2" />
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Nombre</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.nombres} {infoMedico.apellidos}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Especialidad</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{infoMedico.especialidad}</div>

                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Horario</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{infoMedico.hora_inicio} - {infoMedico.hora_final}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Fichas disponibles</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">{infoMedico.fichas_disponibles}</div>
                                        </li>
                                    </React.Fragment>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="fecha">Fecha actual</label>
                                <div className="p-inputgroup">
                                    <span className="p-inputgroup-addon">
                                        <i className="pi pi-calendar"></i>
                                    </span>
                                    <InputText id="fecha" value={obtenerFechaActual()} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="hora">Hora</label>
                                <Dropdown id="hora" value={hora} onChange={(e) => setHora(e.value)} placeholder="Seleccione una hora" />
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Nombre del paciente</label>
                        <AutoComplete placeholder="Buscar nombre" id="dd" dropdown multiple field="name" />
                    </div>

                    <Button label="Reservar" onClick={crearCita} className="p-mt-3" />


                </div>

            </div>
        </div>
    );
}
