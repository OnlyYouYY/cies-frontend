import React, { useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';

export default function ReservaCitas() {
    // Aquí puedes manejar el estado para cada uno de los inputs
    const toast = useRef(null);
    const [servicio, setServicio] = useState(null);
    const [medico, setMedico] = useState(null);
    const [fecha, setFecha] = useState(null);
    const [hora, setHora] = useState(null);
    const [infoPaciente, setInfoPaciente] = useState({
        nombre: '',
        correo: '',
        telefono: ''
    });
    // Aquí puedes tener una lista de citas
    const [citas, setCitas] = useState([]);

    // Función para manejar la creación de la cita
    const crearCita = () => {
        // Aquí puedes añadir la lógica para crear la cita
    }

    return (
        <div className="grid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">

                    <div className="card p-fluid">
                    <h5>Reserva de citas</h5>
                        <div className="field">
                            <label htmlFor="servicio">Servicio</label>
                            <Dropdown id="servicio" value={servicio} onChange={(e) => setServicio(e.value)} placeholder="Seleccione un servicio" />
                        </div>
                        <div className="field">
                            <label htmlFor="medico">Médico</label>
                            <Dropdown id="medico" value={medico} onChange={(e) => setMedico(e.value)} placeholder="Seleccione un médico" />
                        </div>
                        <div className="field">
                            <label htmlFor="fecha">Fecha</label>
                            <Calendar id="fecha" value={fecha} onChange={(e) => setFecha(e.value)} inline showIcon />
                        </div>
                        <div className="field">
                            <label htmlFor="hora">Hora</label>
                            <Dropdown id="hora" value={hora} onChange={(e) => setHora(e.value)} placeholder="Seleccione una hora" />
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Nombre del paciente</label>
                            <AutoComplete placeholder="Paciente" id="dd" dropdown multiple field="name" />
                        </div>
                        
                        <Button label="Reservar" onClick={crearCita} className="p-mt-3" />

                        {/* Aquí podrías mostrar la tabla con las citas */}
                    </div>

            </div>
        </div>
    );
}
