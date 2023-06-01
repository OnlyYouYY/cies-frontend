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
import { classNames } from 'primereact/utils';
import React, { use, useEffect, useRef, useState } from 'react';
import { ServiceService } from '../../demo/service/ServiceService';
import { mostrarUsuarios, actualizar, eliminar, nuevoUsuario } from '../../services/apiUsuarios';


//Obtener y mostrar a todos los usuario registrados
const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        async function listarUsuarios() {
            try {
                const usuarios = await mostrarUsuarios();
                console.log(usuarios);
                setUsuarios(usuarios);
            }
            catch (error) {
                console.log(error);
            }
        }
        listarUsuarios();

    }, []);


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
                {rowData.nombre}
            </>
        );
    };

    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido</span>
                {rowData.apellido}
            </>
        );
    };

    const correoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
                {rowData.correo}
            </>
        );
    };


    const contraseniaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Contraseña</span>
                {rowData.constrasenia}
            </>
        );
    };

    const rolBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Rol</span>
                {rowData.rol}
            </>
        );
    };



    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                <DataTable
                        value={usuarios}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} usuarios"
                        emptyMessage="No se encontraron usuarios."
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nombreBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="apellido" header="Apellido" body={apellidoBodyTemplate} sortable></Column>
                        <Column field="correo" header="Correo" body={correoBodyTemplate} sortable></Column>
                        <Column field="contrasenia" header="Contrasenia" body={contraseniaBodyTemplate} sortable></Column>
                        <Column field="rol" header="Rol" sortable body={rolBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                        
                </div>
            </div>
        </div>
    );
};


export default Usuarios;
