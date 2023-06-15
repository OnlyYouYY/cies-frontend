
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DataView } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { mostrarMedicoPerfil, mostrarFichasMedico, finalizarFicha } from '../../services/apiPacientes';
import { listarFichas, eliminarFicha } from '../../services/apiService';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

export default function BasicDemo() {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['medico'];

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

    const [fecha, setFecha] = useState(obtenerFechaActual);
    const [fichas, setFichas] = useState([]);
    const [ficha, setFicha] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteFichaDialog, setDeleteFichaDialog] = useState(false);
    const [finalizarFichaDialog, setFinalizarFichaDialog] = useState(false);
    const [medico, setMedico] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        async function obtenerPerfilMedico() {
            const idUsuarioEncriptado = localStorage.getItem('userID');
            const idUsuario = decryptData(idUsuarioEncriptado);
            try {
                const medico = await mostrarMedicoPerfil(idUsuario);
                console.log(medico);

                setMedico(medico);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPerfilMedico();
    }, []);

    async function cargarFichas() {
        try {
            const idUsuarioEncriptado = localStorage.getItem('userID');
            const idUsuario = decryptData(idUsuarioEncriptado);
            const fechaBusqueda = formatDate(fecha);
            const fichas = await mostrarFichasMedico(idUsuario, fechaBusqueda);
            console.log(fechaBusqueda);
            setFichas(fichas);
            console.log(fichas);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function obtenerFichasActual() {
            try {
                const idUsuarioEncriptado = localStorage.getItem('userID');
                const idUsuario = decryptData(idUsuarioEncriptado);
                const fechaBusqueda = formatDate(fecha);
                const fichas = await mostrarFichasMedico(idUsuario, fechaBusqueda);
                console.log(fechaBusqueda);
                setFichas(fichas);
                console.log(fichas);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerFichasActual()
    }, [fecha]);

    async function cancelarFicha() {
        try {

            const response = await eliminarFicha(ficha.id);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Ficha cancelada', life: 3000 });
            setDeleteFichaDialog(false);
            cargarFichas();
        }
        catch (error) {
            throw error;
        }
    }

    async function finalizarFichaPaciente() {
        try {

            const response = await finalizarFicha(ficha.id);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Ficha finalizada', life: 3000 });
            setFinalizarFichaDialog(false);
            cargarFichas();
        }
        catch (error) {
            throw error;
        }
    }

    function obtenerFechaActual() {
        const fecha = new Date();
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${anio}/${mes}/${dia}`;
    }

    function formatDate(dateString) {
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    }

    const getSeverity = (medico) => {
        switch (medico.estadoMedico) {
            case 'Registrado':
                return 'success';

            case 'No registrado':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Fichas reservadas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Busqueda..." />
            </span>
        </div>
    );

    const headerMedico = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Consulta medica</h5>
        </div>
    );

    const hideDeleteFichaDialog = () => {
        setDeleteFichaDialog(false);
    };
    const hideFinalizarFichaDialog = () => {
        setFinalizarFichaDialog(false);
    };

    const confirmDeleteFicha = (ficha) => {
        setFicha(ficha);
        setDeleteFichaDialog(true);
    };

    const confirmFinalizarFicha = (ficha) => {
        setFicha(ficha);
        setFinalizarFichaDialog(true);
    };

    const deleteFichaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteFichaDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={cancelarFicha} />
        </>
    );

    const finalizarFichaDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideFinalizarFichaDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={finalizarFichaPaciente} />
        </>
    );

    const nombrePacienteTemplate = (rowData) => {
        return <span>{rowData.nombre_paciente} {rowData.apellido_paciente}</span>;
    };

    const fechaNacimientoTemplate = (rowData) => {
        return <span>{formatDate(rowData.fecha_nacimiento)}</span>;
    };

    const fichaEstado = (value) => {
        switch (value) {
            case 'Finalizado':
                return 'success';

            case 'Pendiente':
                return 'warning';

            case 'Cancelado':
                return 'danger';

            default:
                return null;
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-book" severity="info" rounded className="mr-2" onClick={() => confirmDeleteService(rowData)} />
                <Button icon="pi pi-check" severity="success" rounded className="mr-2" onClick={() => confirmFinalizarFicha(rowData)} />
                <Button severity="danger" icon="pi pi-times" rounded onClick={() => confirmDeleteFicha(rowData)}></Button>
            </>
        );
    };

    const estadoTemplate = (rowData) => {
        return <Tag value={rowData.estado_ficha} severity={fichaEstado(rowData.estado_ficha)}></Tag>;
    };

    const itemTemplate = (medico) => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png`} alt={medico.rol} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{medico.nombres} {medico.apellidos}</div>
                            <span>{medico.correo}</span>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-user"></i>
                                    <span className="font-semibold">{medico.nombre_servicio}</span>
                                </span>
                                <Tag value={medico.estadoMedico} severity={getSeverity(medico)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">{medico.especialidad}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="card">
                <DataView header={headerMedico} value={medico} itemTemplate={itemTemplate} />
            </div>
            <div className="card">
                <Toast ref={toast} />
                <DataTable value={fichas} dataKey="id"
                    scrollable
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="datatable-responsive"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} fichas"
                    emptyMessage="No se encontraron fichas de la fecha."
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll">
                    <Column field="nombre_paciente" header="Nombre" body={nombrePacienteTemplate} style={{ minWidth: '200px' }} ></Column>
                    <Column field="ci" header="CI" style={{ minWidth: '100px' }}></Column>
                    <Column field="sexo" header="Sexo" style={{ minWidth: '150px' }}></Column>
                    <Column field="fecha_nacimiento" header="Fecha de nacimiento" body={fechaNacimientoTemplate} style={{ minWidth: '150px' }}></Column>
                    <Column field="estado_ficha" header="Estado" body={estadoTemplate} style={{ minWidth: '100px' }} alignFrozen="right" frozen></Column>
                    <Column header="Accion" headerStyle={{ minWidth: '10rem' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} alignFrozen="right" frozen />
                </DataTable>

                <Dialog visible={deleteFichaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteFichaDialogFooter} onHide={hideDeleteFichaDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {ficha && (
                            <span>
                                Esta seguro de cancelar la cita con: <b>{ficha.nombre_paciente} {ficha.apellido_paciente}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={finalizarFichaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={finalizarFichaDialogFooter} onHide={hideFinalizarFichaDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        {ficha && (
                            <span>
                                Desea finalizar la cita con: <b>{ficha.nombre_paciente} {ficha.apellido_paciente}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>
            </div>
        </div>


    )
}
