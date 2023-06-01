import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { listarProveedores, listarReabasteci,actualizar,eliminar,eliminarVarios} from '../../services/apiReabastecimiento';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reabastecimiento = () => {
    let emptyRestock = {
        id_reabast: 0,
        pedido_producto: '',
        cantidad_reabastecida: 0,
        fecha_reabastecimiento: '',
        costo_total: 0
    };

    const [proveedores, setProveedores] = useState([]);
    const [reabastecimientos, setReabastecimientos] = useState([]);
    const [listboxValue, setListboxValue] = useState(null);
    const [restockDialog, setRestockDialog] = useState(false);
    const [restockUpdateDialog, setRestockUpdateDialog] = useState(false);
    const [deleteRestockDialog, setDeleteRestockDialog] = useState(false);
    const [deleteRestocksDialog, setDeleteRestocksDialog] = useState(false);
    const [restock, setRestock] = useState(emptyRestock);
    const [selectedRestocks, setSelectedRestocks] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);

    const cargarReabastecimientos = async () => {
        try {
            const reabaste = await listarReabasteci();
            setReabastecimientos(reabaste);
        } catch (error) {
            console.log(error);
        }
    };

    async function actualizarReabastecimiento() {
        try {
            const response = await actualizar(restock.id_reabast, restock.pedido_producto, restock.id_proveedor, restock.cantidad_reabastecida, restock.fecha_reabastecimiento,restock.costo_total);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Servicio actualizado', life: 3000 });
            await cargarReabastecimientos();
            setRestockUpdateDialog(false);
            setRestock(emptyRestock);
        } catch (error) {
            console.log(error);
        }
    }
    function onSubmitActualizar() {
        actualizarReabastecimiento();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_reabast);
        return selectedIds;
    };

    async function eliminarReabastecimiento() {
        try {

            const response = await eliminar(restock.id_reabast);
            console.log(response);
            toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Registro eliminado', life: 3000 });
            await cargarReabastecimientos();
            setDeleteRestockDialog(false);
            setRestock(emptyRestock);
        }
        catch (error) {
            throw error;
        }
    }
    async function eliminarReabasteciminetos() {
        try {
            if (selectedServices) {
                const selectedIds = collectSelectedIds(selectedRestocks);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'error', summary: 'Exitoso', detail: 'Registros eliminados', life: 3000 });
                await cargarReabastecimientos();
                setDeleteRestocksDialog(false);
                setSelectedRestocks(null);
            }
        }
        catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        async function obtenerproveedores() {
            try {
                const proveedores = await listarProveedores();
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerproveedores();
    }, []);

    useEffect(() => {
        async function mostrarReabastecimientos() {
            try {
                const reab = await listarReabasteci();
                console.log(reab);
                setReabastecimientos(reab);
            }
            catch (error) {
                console.log(error);
            }
        }
        mostrarReabastecimientos();
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setRestockDialog(false);
        setRestockUpdateDialog(false);
    };

    const hideDeleteRestockDialog = () => {
        setDeleteRestockDialog(false);
    };

    const hideDeleteRestocksDialog = () => {
        setDeleteRestocksDialog(false);
    };

    const editRestock = (restock) => {
        setRestock({ ...restock });
        console.log(restock);
        setRestockUpdateDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteRestockDialog(true);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setRestock(prevRestock => ({
            ...prevRestock,
            [name]: value
        }));
    };

    const onInputNumberChangeI = (e) => {
        const { name, value } = e.target;
        setRestock(prevRestock => ({
            ...prevRestock,
            [name]: parseInt(value)
        }));
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setRestock(prevRestock => ({
            ...prevRestock,
            [name]: parseFloat(value)
        }));
    };

    const onDateChange = (e) => {
        setRestock(prevRestock => ({
            ...prevRestock,
            fecha_reabastecimiento: e.value
        }));
    };


    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_reabastecimiento}
            </>
        );
    };
    const pedidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Pedido Producto</span>
                {rowData.pedido_producto}
            </>
        );
    };
    const proveedorBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Proveedor</span>
                {rowData.nombre_proveedor}
            </>
        );
    };
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad Pedida</span>
                {rowData.cantidad_reabastecida}
            </>
        );
    };
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Pedido</span>
                {rowData.fecha_reabastecimiento}
            </>
        );
    };
    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Total</span>
                {formatCurrency(rowData.costo_total)}
            </>
        );
    };
    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editRestock(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteSelected(rowData)} />
            </>
        );
    };

    const openNewExportar = () => {
        setServiceDialogExportar(true);
    };
    const hideDialogExportar = () => {
        setServiceDialogExportar(false);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestion de Reabastecimiento</h5>
            <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRestocks || !selectedRestocks.length} />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar nombre..." />
            </span>
        </div>
    );
    const restockUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deleteRestockDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRestockDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarReabastecimiento} />
        </>
    );
    const deleteRestocksDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteRestocksDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarReabasteciminetos} />
        </>
    );
    

        function exportToPDF() {
        if (reabastecimientos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de reabastecimientos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de reabastecimientos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Título
            const title = 'Informe de Reabastecimientos';
            doc.setFontSize(18);
            doc.text(title, 10, 10);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado del reabastecimiento de productos de la clinica CIES. El informe incluye información relevante sobre cada pedido de reabastecimiento, como el nombre del producto solicitado, proveedor, cantidad, fecha del pedido y costo total.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 20);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

            const tableColumns = [
                { header: 'Pedido Producto', dataKey: 'pedido_producto' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Cantidad', dataKey: 'cantidad_reabastecida' },
                { header: 'Fecha pedido', dataKey:'fecha_reabastecimiento' },
                { header: 'Costo total', dataKey: 'costo_total' }
            ];
            
            const tableData = reabastecimientos.map(reab => ({
                pedido_producto: reab.pedido_producto,
                nombre_proveedor: reab.nombre_proveedor,
                cantidad_reabastecida: reab.cantidad_reabastecida,
                fecha_reabastecimiento: reab.fecha_reabastecimiento,
                costo_total: reab.costo_total
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_reabastecimiento.pdf');
        }
    }


    function exportToExcel() {
        if (reabastecimientos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de reabastecimientos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Pedido Producto', dataKey: 'pedido_producto' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Cantidad', dataKey: 'cantidad_reabastecida' },
                { header: 'Fecha pedido', dataKey:'fecha_reabastecimiento' },
                { header: 'Costo total', dataKey: 'costo_total' }
            ];
            
            const tableData = reabastecimientos.map(reab => ({
                pedido_producto: reab.pedido_producto,
                nombre_proveedor: reab.nombre_proveedor,
                cantidad_reabastecida: reab.cantidad_reabastecida,
                fecha_reabastecimiento: reab.fecha_reabastecimiento,
                costo_total: reab.costo_total
            }));
            
            doc.autoTable(tableColumns, tableData, {
                startY: 60,
                margin: { top: 10 },
            });
            
            const tableHeader = tableColumns.map(column => column.header);
            const tableRows = tableData.map(data => tableColumns.map(column => data[column.dataKey]));
            
            const worksheet = XLSX.utils.aoa_to_sheet([tableHeader, ...tableRows]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Servicios');
            
            const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Descargar el archivo Excel
            const excelBlob = new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const excelLink = document.createElement('a');
            excelLink.href = URL.createObjectURL(excelBlob);
            excelLink.download = 'tabla_reabastecimientos.xlsx';
            excelLink.click();
        }
    }


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    
                    <DataTable
                        ref={dt}
                        value={reabastecimientos}
                        selection={selectedRestocks}
                        onSelectionChange={(e) => setSelectedRestocks(e.value)}
                        dataKey="id_reabastecimiento"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} reabastecimiento"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontraron registros."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="nombre_servicio" header="Pedido Producto" sortable body={pedidoBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="id_proveedor" header="Proveedor" body={proveedorBodyTemplate} sortable></Column>
                        <Column field="cantidad_reabastecida" header="Cantidad" sortable body={cantidadBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="fecha_reabastecimiento" header="Fecha Pedido" body={fechaBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="costo_total" header="Costo Total" body={precioBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={restockUpdateDialog} style={{ width: '450px' }} header="Actualizar Servicio" modal className="p-fluid" footer={restockUpdateDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="pedido_producto">Nombre Pedido del Producto</label>
                            <InputText id="pedido_producto" name="pedido_producto" value={restock.pedido_producto} onChange={onInputChange} required autoFocus className={classNames({ 'p-invalid': restock.pedido_producto })} />
                        </div>

                        <div className="field">
                            <label htmlFor="id_proveedor">Proveedor Disponibles</label>
                            <Dropdown value={listboxValue} onChange={(e) => setListboxValue(e.value)} filterPlaceholder='Buscar proveedor' options={proveedores} optionLabel="nombre_proveedor" filter />
                        </div>

                        <div className="field">
                            <label htmlFor="cantidad_reabastecida">Cantidad Pedida</label>
                            <InputNumber id="cantidad_reabastecida" value={restock.cantidad_reabastecida} name='cantidad_reabastecida' onValueChange={onInputNumberChangeI}/>
                        </div>

                        <div className="field" col>
                            <label htmlFor="fecha_pedido">Fecha del Pedido</label>
                            <Calendar id="fecha_pedido" name="fecha_pedido" value={restock.fecha_reabastecimiento} onChange={onDateChange} showIcon />
                        </div>

                        <div className="field">
                            <label htmlFor="costo_total">Precio Total del Pedido</label>
                            <InputNumber id="costo_total" value={restock.costo_total} name='costo_total' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRestockDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRestockDialogFooter} onHide={hideDeleteRestockDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {restock && (
                                <span>
                                    Esta seguro de eliminar el siguiente registro: <b>{restock.pedido_producto}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRestocksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRestocksDialogFooter} onHide={hideDeleteRestocksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {restock && <span>Esta seguro de eliminar los siguientes registros seleccionados?</span>}
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
export default Reabastecimiento;