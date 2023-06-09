import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Image } from 'primereact/image';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { Toast } from 'primereact/toast';
import { listarCategorias, listarProductos, listarProveedores, registrarCategoria, actualizar, eliminar, eliminarVarios } from '../../services/apiProductos';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/router';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const Productos = () => {

    const session = getSession();
    const router = useRouter();

    const rolesPermitidos = ['administrador', 'farmaceutico'];

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

    let emptyProduct = {
        id_medicamento: 0, 
        nombre_medicamento: '',
        precio_unitario: 0,
        cantidad: 0,
        fecha_caducidad: null,
        ruta_imagen: ''
    };

    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]); 
    const [listboxValueP, setListboxValueP] = useState(null);
    const [listboxValueC, setListboxValueC] = useState(null);
    const [productUpdateDialog, setProductUpdateDialog] = useState(false); 
    const [deleteProductDialog, setDeleteProductDialog] = useState(false); 
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false); 
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null); 
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [serviceDialogExportar, setServiceDialogExportar] = useState(false);

    const cargarProductos = async () => {
        try {
            const productos = await listarProductos();
            setProductos(productos);
        } catch (error) {
            console.log(error);
        }
    };

    async function registrarCategoriaProductos() {
        try {
            const response = await registrarCategoria(product.categoria);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Categoria ha sido creada creada', life: 3000 });
        } catch (error) {
            console.log(error);
        }
    }
    function onSubmit() {
        registrarCategoriaProductos();
    }

    async function actualizarProducto() {
        try {
            const response = await actualizar(product.id_medicamento ,product.nombre_medicamento, product.proveedor ,product.categoria, product.precio_unitario, product.cantidad, product.fecha_caducidad);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto actualizado', life: 3000 });
            await cargarProductos();
            setProduct(emptyProduct);
        } catch (error) {
            console.log(error);
        }
    }
    function onSubmitActualizar() {
        actualizarProducto();
    }

    const collectSelectedIds = (selectedItems) => {
        const selectedIds = selectedItems.map((item) => item.id_medicamento);
        return selectedIds;
    };

    async function eliminarProducto() {
        try {
            const response = await eliminar(product.id_medicamento);
            console.log(response);
            toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Producto eliminado', life: 3000 });
            await cargarProductos();
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
        } catch (error) {
            throw error;
        }
    }
    async function eliminarProductos() {
        try {
            if (selectedProducts) {
                const selectedIds = collectSelectedIds(selectedProducts);
                console.log(selectedIds);
                const response = await eliminarVarios(selectedIds);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Productos eliminados', life: 3000 });
                await cargarProductos();
                setDeleteProductsDialog(false);
                setSelectedProducts(null);
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        async function mostrarProveedores() {
            try {
                const proveedores = await listarProveedores();
                setProveedores(proveedores);
            } catch (error) {
                console.log(error);
            }
        }
        mostrarProveedores();
    }, []);
    useEffect(() => {
        async function mostrarCategorias() {
            try {
                const categorias = await listarCategorias();
                setCategorias(categorias);
            } catch (error) {
                console.log(error);
            }
        }
        mostrarCategorias();
    }, []);
    useEffect(()=>{
        async function listarMedicamentos() {
            try {
                const productos = await listarProductos();
                console.log(productos);
                setProductos(productos);
            } catch (error) {
                console.log(error);   
            }
        }
        listarMedicamentos();
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' });
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductUpdateDialog(false);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        console.log(product);
        setProductUpdateDialog(true);
    };
    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const onSupplierChange = (e) => {
        let _product = { ...product};
        _product['proveedor'] = e.value;
        setProduct(_product);
    };
    const onCategoryChange = (e) => {
        let _product = { ...product};
        _product['categoria'] = e.value;
        setProduct(_product);
    };

    function onSupplierChangeUpdate(proveedorId) {
        setProduct(prevProduct => {
            if (prevProduct.proveedor_id === proveedorId) {
                return {...prevProduct, proveedor_id: null};
            }else{
                return {...prevProduct, proveedor_id: proveedorId}
            }
        });    
    }
    function onCategoryChangeUpdate(categoriaId) {
        setProduct(prevProduct => {
            if (prevProduct.categoria_id === categoriaId) {
                return {...prevProduct, categoria_id: null};
            }else{
                return {...prevProduct, categoria_id: categoriaId}
            }
        });    
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value
        }));
    };
    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: parseFloat(value)
        }));
    };
    const onDateChange = (e) => {
        setProduct(prevProduct => ({
            ...prevProduct,
            fecha_caducidad: e.value
        }));
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id_medicamento}
            </>
        );
    };
    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre_medicamento}
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
    const categoriaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Categoria</span>
                {rowData.nombre_categoria}
            </>
        );
    };
    const precioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Precio Unitario</span>
                {formatCurrency(rowData.precio_unitario)}
            </>
        );
    };
    const cantidadBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Cantidad</span>
                {rowData.cantidad}
            </>
        );
    };
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Caducidad</span>
                {rowData.fecha_caducidad}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
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
        <div className='flex flex-column md:flex-row md:justify-content-between md:align-items-center'>
            <h5 className='m-0'>Gestion de Productos</h5>
            <Button label='Eliminar' icon='pi pi-trash' severity='danger' onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={openNewExportar} />
            <span className='block mt-2 md:mt-0 p-input-icon-left'>
                <i className='pi pi-search'/>
                <InputText type='search'onChange={(e) => setGlobalFilter(e.target.value)} placeholder='Buscar producto...'/>
            </span>
        </div>
    );

    const productUpdateDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={onSubmitActualizar} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarProducto} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={eliminarProductos} />
        </>
    );

        //funciones para exportar en pdf y exel
    function exportToPDF() {
        if (productos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de productos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de productos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {

            const doc = new jsPDF();

            // Título
            const title = 'Informe de productos';
            doc.setFontSize(18);
            doc.text(title, 10, 10);

            // Párrafo introductorio
            const introText = 'A continuación se presenta un informe detallado de los productos disponibles en la clinica CIES. El informe incluye información relevante sobre cada producto, como el nombre, proveedor, categoria, precio unitario, cantida y fecha de caducidad. Esperamos que este informe sea útil para comprender mejor nuestros productos.';
        
            const splitIntroText = doc.splitTextToSize(introText, doc.internal.pageSize.getWidth() - 20);
            doc.setFontSize(12);
            doc.text(splitIntroText, 10, 20);
            
            const startY = doc.previousAutoTable ? doc.previousAutoTable.finalY + 10 : 60;

            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Categoría', dataKey: 'nombre_categoria' },
                { header: 'Precio unitario', dataKey:'precio_unitario' },
                { header: 'Cantidad', dataKey: 'cantidad' },
                { header: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
            ];
            
            const tableData = productos.map(productos => ({
                nombre_medicamento: productos.nombre_medicamento,
                nombre_proveedor: productos.nombre_proveedor,
                nombre_categoria: productos.nombre_categoria,
                precio_unitario: productos.precio_unitario,
                cantidad: productos.cantidad,
                fecha_caducidad: productos.fecha_caducidad,
            }));

            doc.autoTable(tableColumns, tableData, {
                startY,
                margin: { top: 5 },
            });

            doc.save('tabla_productos.pdf');
        }
    }


    function exportToExcel() {
        if (productos.length === 0) {
            // La tabla está vacía, muestra un mensaje o realiza alguna acción apropiada
            console.log('La tabla de productos está vacía.');
            toast.current.show({ severity: 'warn', summary: 'Error', detail: 'La tabla de productos no se pudo exportar porque está vacía.', life: 3000 });
            return;
        } else {
            const doc = new jsPDF();
        
            const tableColumns = [
                { header: 'Nombre del medicamento', dataKey: 'nombre_medicamento' },
                { header: 'Proveedor', dataKey: 'nombre_proveedor' },
                { header: 'Categoría', dataKey: 'nombre_categoria' },
                { header: 'Precio unitario', dataKey:'precio_unitario' },
                { header: 'Cantidad', dataKey: 'cantidad' },
                { header: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
            ];
            
            const tableData = productos.map(productos => ({
                nombre_medicamento: productos.nombre_medicamento,
                nombre_proveedor: productos.nombre_proveedor,
                nombre_categoria: productos.nombre_categoria,
                precio_unitario: productos.precio_unitario,
                cantidad: productos.cantidad,
                fecha_caducidad: productos.fecha_caducidad,
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
            excelLink.download = 'tabla_productos.xlsx';
            excelLink.click();
        }
    }

    return(
        <div className='grid crud-demo'>
            <div className='col-12'>
                <div className='card'>
                    <Toast ref={toast}/>

                    <DataTable 
                        ref={dt}
                        value={productos}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey='id_medicamento'
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5,10,25]}
                        className='datatable-responsive'
                        paginatorTemplate={"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"}
                        currentPageReportTemplate='Mostrando del {first} al {last} de {totalRecords} productos'
                        globalFilter={globalFilter}
                        emptyMessage='No se encontraron productos disponibles.'
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="nombre_medicamento" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="suplier" header="Proveedor" body={proveedorBodyTemplate} sortable></Column>  
                        <Column field="category" header="Categoria" sortable body={categoriaBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Precio Unitario" sortable body={precioBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="quantity" header="Cantidad" sortable body={cantidadBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="enddate" header="Fecha Caducidad" body={fechaBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productUpdateDialog} style={{width: '450px'}} header='Nuevo Producto' modal className='p-fluid' footer={productUpdateDialogFooter} onHide={hideDialog}>
                    <div className='field'>
                            <label htmlFor='nombre_medicamento'>Nombre del Producto</label>
                            <InputText id='nombre_medicamento' name='nombre_medicamento' value={product.nombre_medicamento} onChange={onInputChange} required autoFocus className={classNames({'p-invalid':submitted && !product.nombre_medicamento})}/>
                            {submitted && !product.nombre_medicamento && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="categoriaProveedores">Proveedores</label>
                            <ListBox value={listboxValueP} onChange={(e) => setListboxValueP(e.value)} filterPlaceholder='Buscar Proveedor' options={proveedores} optionLabel="nombre_proveedor" filter /> {/**chequear bien */}
                        </div>
                        <div className="field">
                            <label htmlFor="categoriaProductos">Categoria Productos</label>
                            <Dropdown value={listboxValueC} onChange={(e) => setListboxValueC(e.value)} filterPlaceholder='Buscar categoria' options={categorias} optionLabel="nombre_categoria" filter />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="price">Precio</label>
                                <InputNumber id="precio" value={product.precio_unitario} name='precio' onValueChange={onInputNumberChange} mode="currency" currency="BOB" locale="es-BO" />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="cantidad">Cantidad</label>
                            <InputNumber id="cantidad" value={product.cantidad} name="cantidad" onValueChange={onInputNumberChange} />
                        </div>

                        <div className="field" col>
                            <label htmlFor="fecha">Fecha de Caducidad</label>
                            <Calendar id="fecha" name="fechacaducidad" value={product.fecha_caducidad} onChange={onDateChange} showIcon />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Esta seguro de eliminar el siguiente servicio: <b>{product.nombre_medicamento}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product &&
                            ( 
                                <span>Esta seguro de eliminar los siguiente servicios seleccionados?</span>
                            )}
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
export default Productos;

