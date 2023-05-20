import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Rating } from 'primereact/rating';
import { listarCategorias, mostrarServicios, registrar, actualizar, eliminar, eliminarVarios } from '../../services/apiService';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { ServiceService } from '../../demo/service/ServiceService';

const Servicios = () => {
    let emptyService = {
        id: 0,
        nombre_servicio: '',
        descripcion_servicio: '',
        precio: 0,
        categoria: 0
    };

    const [categorias, setCategorias] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [services, setServices] = useState(null);
    const [serviceDialog, setServiceDialog] = useState(false);
    const [serviceUpdateDialog, setServiceUpdateDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [deleteServicesDialog, setDeleteServicesDialog] = useState(false);
    const [service, setService] = useState(emptyService);
    const [selectedServices, setSelectedServices] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        ServiceService.getServices().then((data) => setServices(data));
    }, []);

    const cargarServicios = async () => {
        try {
            const servicios = await mostrarServicios();
            setServicios(servicios);
        } catch (error) {
            console.log(error);
        }
    };

    async function registrarServicio() {
        try {
            const response = await registrar(service.nombre_servicio, service.descripcion_servicio, service.precio, service.categoria);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio creado', life: 3000 });
            setServiceDialog(false);
            await cargarServicios();
            setService(emptyService);
        } catch (error) {
            console.log(error);
        }
    }

    function onSubmit() {
        registrarServicio();
    }

    async function actualizarServicio() {
        try {
            const response = await actualizar(service.id, service.nombre_servicio, service.descripcion_servicio, service.precio, service.id_categoria);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio actualizado', life: 3000 });
            await cargarServicios();
            setServiceUpdateDialog(false);
            setService(emptyService);
        } catch (error) {
            console.log(error);
        }
    }

    function onSubmitActualizar() {
        actualizarServicio();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id);
        return selectedIds;
    };

    async function eliminarServicio() {
        try {

            const response = await eliminar(service.id);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Servicio eliminado', life: 3000 });
            await cargarServicios();
            setDeleteServiceDialog(false);
            setService(emptyService);
        }
        catch (error) {
            throw error;
        }
    }

    async function eliminarServicios() {
        try {
            if (selectedServices) {
                const selectedIds = collectSelectedIds(selectedServices);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Servicios eliminados', life: 3000 });
                await cargarServicios();
                setDeleteServicesDialog(false);
                setSelectedServices(null);
            }

        }
        catch (error) {
            throw error;
        }
    }


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

    useEffect(() => {
        async function listarServicios() {
            try {
                const servicios = await mostrarServicios();
                setServicios(servicios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarServicios();
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
        setServiceDialog(false);
        setServiceUpdateDialog(false);
    };

    const hideDeleteServiceDialog = () => {
        setDeleteServiceDialog(false);
    };

    const hideDeleteServicesDialog = () => {
        setDeleteServicesDialog(false);
    };



    const editService = (service) => {
        setService({ ...service });
        console.log(service);
        setServiceUpdateDialog(true);
    };

    const confirmDeleteService = (service) => {
        setService(service);
        setDeleteServiceDialog(true);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < services.length; i++) {
            if (services[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteServicesDialog(true);
    };

    const deleteSelectedServices = () => {
        let _services = services.filter((val) => !selectedServices.includes(val));
        setServices(_services);
        setDeleteServicesDialog(false);
        setSelectedServices(null);

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
        setService(prevService => ({
            ...prevService,
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                    <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedServices || !selectedServices.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="mr-2 inline-block" />
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_servicio}
            </>
        );
    };

    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.precio)}
            </>
        );
    };

    const categoriaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.nombre_categoria}
            </>
        );
    };

    const estadosColor = (estadoColor) => {
        if (estadoColor === 'Pendiente') {
            return 'lowstock';
        }
        if (estadoColor === 'Habilitado') {
            return 'instock';
        }
        if (estadoColor === 'Deshabilitado') {
            return 'outofstock';
        }
        return estadoColor;
    }

    const estadoBodyTemplate = (rowData) => {
        const estadoColor = estadosColor(rowData.estado_servicio);
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`product-badge status-${estadoColor}`}>{rowData.estado_servicio}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editService(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteService(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Servicios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );

    const serviceDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmit} />
        </>
    );

    const serviceUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deleteServiceDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServiceDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarServicio} />
        </>
    );
    const deleteServicesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteServicesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarServicios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={servicios}
                        selection={selectedServices}
                        onSelectionChange={(e) => setSelectedServices(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} servicios"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron servicios."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre_servicio" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Precio" body={precioBodyTemplate} sortable></Column>
                        <Column field="category" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="inventoryStatus" header="Estado" body={estadoBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={serviceDialog} style={{ width: '450px' }} header="Nuevo Servicio" modal className="p-fluid" footer={serviceDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre_servicio">Nombre del servicio</label>
                            <InputText id="nombre_servicio" name="nombre_servicio" value={service.nombre_servicio} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !service.nombre_servicio })} />
                            {submitted && !service.nombre_servicio && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descripcion</label>
                            <InputTextarea id="descripcion_servicio" name="descripcion_servicio" value={service.descripcion_servicio} onChange={onInputChange} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Categoria</label>
                            <div className="formgrid grid">
                                {categorias.map((categoria) => (
                                    <div className="field-radiobutton col-6" key={categoria.id}>
                                        <RadioButton
                                            inputId={`category${categoria.id}`}
                                            name="categoria"
                                            value={categoria.id}
                                            onChange={onCategoryChange}
                                            checked={service.categoria === categoria.id}
                                        />
                                        <label htmlFor={`category${categoria.id}`}>{categoria.nombre_categoria}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="precio" value={service.precio} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={serviceUpdateDialog} style={{ width: '450px' }} header="Actualizar Servicio" modal className="p-fluid" footer={serviceUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre_servicio">Nombre del servicio</label>
                            <InputText id="nombre_servicio" name="nombre_servicio" value={service.nombre_servicio} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': submitted && !service.nombre_servicio })} />
                            {submitted && !service.nombre_servicio && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Descripcion</label>
                            <InputTextarea id="descripcion_servicio" name="descripcion_servicio" value={service.descripcion_servicio} onChange={onInputChange} required rows={3} cols={20} />
                        </div>

                        <div className="field">
                            <label className="mb-3">Categoria</label>
                            <div className="formgrid grid">
                                {categorias.map((categoria) => (
                                    <div className="field-radiobutton col-6" key={categoria.id}>
                                        <RadioButton
                                            inputId={`category${categoria.id}`}
                                            name="categoria"
                                            value={categoria.id}
                                            onChange={() => onCategoryChangeUpdate(categoria.id)}
                                            checked={service.id_categoria === categoria.id}


                                        />
                                        <label htmlFor={`category${categoria.id}`}>{categoria.nombre_categoria}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="precio" value={service.precio} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServiceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServiceDialogFooter} onHide={hideDeleteServiceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && (
                                <span>
                                    Esta seguro de eliminar el siguiente servicio: <b>{service.nombre_servicio}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteServicesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteServicesDialogFooter} onHide={hideDeleteServicesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {service && <span>Esta seguro de eliminar los siguiente servicios seleccionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Servicios;
