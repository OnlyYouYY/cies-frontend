import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { ListBox } from 'primereact/listbox';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';
import { mostrarPacientes, eliminar, eliminarVarios, listarDirecciones, actualizar } from '../../services/apiPacientes';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Pacientes = () => {

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

    const [categorias, setCategorias] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [direccion, setDireccion] = useState([]);
    const [pacienteDialog, setPacienteDialog] = useState(false);
    const [pacienteUpdateDialog, setPacienteUpdateDialog] = useState(false);
    const [deletePacienteDialog, setDeletePacienteDialog] = useState(false);
    const [deletePacientesDialog, setDeletePacientesDialog] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [paciente, setPaciente] = useState(emptyPaciente);
    const [selectedPacientes, setSelectedPacientes] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);


    const cargarPacientes = async () => {
        try {
            const pacientes = await mostrarPacientes();
            setPacientes(pacientes);
        } catch (error) {
            console.log(error);
        }
    };

    async function actualizarPaciente() {
        try {
            const response = await actualizar(paciente.id, paciente.nombres, paciente.apellidos, paciente.fecha_nacimiento, paciente.sexo, paciente.telefono, paciente.correo_electronico, paciente.id_direccion, paciente.usuario, paciente.contrasenia);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Paciente actualizado', life: 3000 });
            await cargarPacientes();
            setPacienteUpdateDialog(false);
            setPaciente(emptyPaciente);
        } catch (error) {
            console.log(error);
        }
    }

    function onSubmitActualizar() {
        actualizarPaciente();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id);
        return selectedIds;
    };

    async function eliminarPaciente() {
        try {

            const response = await eliminar(paciente.id);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Paciente eliminado', life: 3000 });
            await cargarPacientes();
            setDeletePacienteDialog(false);
            setPaciente(emptyPaciente);
        }
        catch (error) {
            throw error;
        }
    }

    async function eliminarPacientes() {
        try {
            if (selectedPacientes) {
                const selectedIds = collectSelectedIds(selectedPacientes);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Pacientes eliminados', life: 3000 });
                await cargarPacientes();
                setDeletePacientesDialog(false);
                setSelectedPacientes(null);
            }

        }
        catch (error) {
            throw error;
        }
    }


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


    useEffect(() => {
        async function listarPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                console.log(pacientes)
                setPacientes(pacientes);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarPacientes();
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    const openNew = () => {
        setService(emptyService);
        setSubmitted(false);
        setServiceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setPacienteDialog(false);
        setPacienteUpdateDialog(false);
    };

    const hideDeletePacienteDialog = () => {
        setDeletePacienteDialog(false);
    };

    const hideDeletePacientesDialog = () => {
        setDeletePacientesDialog(false);
    };



    const editService = (paciente) => {
        setPaciente({ ...paciente });
        console.log(paciente);
        setPacienteUpdateDialog(true);
    };

    const confirmDeletePaciente = (paciente) => {
        setPaciente(paciente);
        setDeletePacienteDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeletePacientesDialog(true);
    };


    const onCategoryChange = (e) => {
        let _service = { ...service };
        _service['categoria'] = e.value;
        setService(_service);
    };

    function onCategoryChangeUpdate(categoriaId) {
        setService(prevService => {
            if (prevService.id_categoria === categoriaId) {
                return { ...prevService, id_categoria: null };
            } else {
                return { ...prevService, id_categoria: categoriaId };
            }
        });
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prevPaciente => ({
            ...prevPaciente,
            [name]: value
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setService(prevService => ({
            ...prevService,
            [name]: parseFloat(value)
        }));
    };

    
    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nombresBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.nombres}
            </>
        );
    };

    const apellidosBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.apellidos}
            </>
        );
    };

    const fechaNacimientoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Nacimiento</span>
                {rowData.fecha_nacimiento}
            </>
        );
    };

    const sexoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Sexo</span>
                {rowData.sexo}
            </>
        );
    };

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    };

    const correoElectronicoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.correo_electronico}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editService(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeletePaciente(rowData)} />
            </>
        );
    };

    //Exportar
    const openNewExportar = () => {
        setServiceDialogExportar(true);
    };
    const hideDialogExportar = () => {
        setServiceDialogExportar(false);
    };
    //Fin

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de pacientes</h5>
            <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedPacientes || !selectedPacientes.length} />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const pacienteUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deletePacienteDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePacienteDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarPaciente} />
        </>
    );
    const deletePacientesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeletePacientesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarPacientes} />
        </>
    );


    //Exportar
    function exportToPDF() {

        const doc = new jsPDF();

        // Título
        const title = 'Informe de pacientes';
        doc.setFontSize(18);
        doc.text(title, 10, 10);

        // Párrafo introductorio
        const introText = 'A continuación se presenta un informe detallado de los pacientes registrados en nuestra aplicación. El informe incluye información relevante sobre cada paciente, como sus nombres, apellidos, fecha de nacimiento, telefono, y el correo.';
        //y la ciudad en la reside
        const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
        doc.setFontSize(12);
        doc.text(splitIntroText, 10, 20);
        
        const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

        const tableColumns = [
            { header: 'Nombres', dataKey: 'nombres' },
            { header: 'Apellidos', dataKey: 'apellidos' },
            { header: 'Fecha de nacimiento', dataKey: 'fecha_nacimiento' },
            { header: 'Genero', dataKey: 'sexo' },
            { header: 'Telefono', dataKey: 'telefono' },
            { header: 'Correo', dataKey: 'correo_electronico' },
            //{ header: 'Ciudad', dataKey: 'ciudad' },
          ];
        
          const tableData = pacientes.map(pacientes => ({
              nombres: pacientes.nombres,
              apellidos: pacientes.apellidos,
              fecha_nacimiento: new Date(pacientes.fecha_nacimiento).toLocaleDateString(),
              sexo: pacientes.sexo,
              telefono: pacientes.telefono,
              correo_electronico: pacientes.correo_electronico,
              //ciudad: pacientes.ciudad
          }));

        doc.autoTable(tableColumns, tableData, {
            startY,
            margin: { top: 5 },
        });

        doc.save('tabla_pacientes.pdf');
    }


    function exportToExcel() {
        const doc = new jsPDF();
        
        const tableColumns = [
          { header: 'Nombres', dataKey: 'nombres' },
          { header: 'Apellidos', dataKey: 'apellidos' },
          { header: 'Fecha de nacimiento', dataKey: 'fecha_nacimiento' },
          { header: 'Telefono', dataKey: 'telefono' },
          { header: 'Correo', dataKey: 'correo_electronico' },
          { header: 'Ciudad', dataKey: 'ciudad' },
        ];
      
        const tableData = pacientes.map(pacientes => ({
            nombres: pacientes.nombres,
            apellidos: pacientes.apellidos,
            fecha_nacimiento: new Date(pacientes.fecha_nacimiento).toLocaleDateString(),
            telefono: pacientes.telefono,
            correo_electronico: pacientes.correo_electronico,
            ciudad: pacientes.ciudad
        }));
      
        doc.autoTable(tableColumns, tableData, {
          startY: 60,
          margin: { top: 10 },
        });
      
        const tableHeader = tableColumns.map(column => column.header);
        const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
      
        const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
      
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
        // Descargar el archivo Excel
        const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const excelLink = document.createElement('a');
        excelLink.href = URL.createObjectURL(excelBlob);
        excelLink.download = 'tabla_pacientes.xlsx';
        excelLink.click();
    }

    

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    {/* <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar> */}

                    <DataTable
                        ref={dt}
                        value={pacientes}
                        selection={selectedPacientes}
                        onSelectionChange={(e) => setSelectedPacientes(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} servicios"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron pacientes."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombres" header="Nombre" sortable body={nombresBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="apellidos" header="Apellidos" sortable body={apellidosBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="fecha_nacimiento" header="FechaNacimiento" sortable body={fechaNacimientoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sexo" header="Sexo" sortable body={sexoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="correo" header="Correo" body={correoElectronicoBodyTemplate} sortable></Column>
                        
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={pacienteUpdateDialog} style={{ width: '450px' }} header="Actualizar Paciente" modal className="p-fluid" footer={pacienteUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombresPaciente">Nombres del paciente</label>
                            <InputText id="nombres" name="nombres" value={paciente.nombres} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !paciente.nombres })} />
                            {submitted && !paciente.nombres && <small className="p-invalid">Los nombres son requeridos.</small>}

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
                                value={new Date(paciente.fecha_nacimiento)}
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
                    </Dialog>

                    <Dialog visible={deletePacienteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePacienteDialogFooter} onHide={hideDeletePacienteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {paciente && (
                                <span>
                                    Esta seguro de eliminar el siguiente paciente: <b>{paciente.nombres}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePacientesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePacientesDialogFooter} onHide={hideDeletePacientesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {paciente && <span>Esta seguro de eliminar los siguiente pacientes seleccionados?</span>}
                        </div>
                    </Dialog>


                    <Dialog visible={serviceDialogExportar} style={{ width: '450px' }} header="Exportar" modal className="p-fluid" onHide={hideDialogExportar}>
                        
                        <div className="field" style={{ display: 'flex', gap: '10px' }}>
                            <label htmlFor="formato">En que formato quiere el reporte</label>
                        </div>
                        
                        <div className="field" style={{ display: 'flex', gap: '10px' }}>
                            <Button label="Exportar en EXCEL" icon="pi pi-upload" severity="success" onClick={exportToExcel} />
                            <Button label="Exportar en PDF" icon="pi pi-upload" severity="danger" onClick={exportToPDF} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};


export default Pacientes;