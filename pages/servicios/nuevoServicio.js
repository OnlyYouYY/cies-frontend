import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';

export const InputDemo = () => {

    const toast = useRef(null);
    const [listboxValue, setListboxValue] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setSelectedFile(URL.createObjectURL(file));
    };

    const listboxValues = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    

    return (
        <div className="grid p-fluid">
            <Toast ref={toast}></Toast>
            <div className="col-12 md:col-12">
                <div className="card">
                    <h5>Nuevo Servicio</h5>
                    <div className="field">
                        <label htmlFor="nombreServicio">Nombre del servicio</label>
                        <InputText id="nombre_servicio" name="nombre_servicio" required autoFocus />

                    </div>
                    <div className="field">
                        <label htmlFor="descripcion">Descripcion</label>
                        <InputTextarea id="descripcion_servicio" name="descripcion_servicio" required rows={3} cols={20} />
                    </div>

                    <div className="field">
                        <label htmlFor="precio">Precio</label>
                        <InputNumber id="precio" name='precio' mode="currency" currency="BOB" locale="es-BO" />
                    </div>
                    <div className="field">
                        <label htmlFor="categoria">Categoria</label>
                        <ListBox value={listboxValue} onChange={(e) => setListboxValue(e.value)} options={listboxValues} optionLabel="name" filter />
                    </div>
                    <div className="field">
                        <label htmlFor="imagen">Imagen</label>
                        <FileUpload
                            name="demo"
                            chooseLabel="Seleccionar"
                            uploadLabel="Subir"
                            cancelLabel="Cancelar"
                            className="custom-fileupload"
                            customUpload
                            emptyTemplate="Arrastre y suelte una imagen aqui"
                            onUpload={handleFileUpload}
                        />
                    </div>
                    <div className="field col-6">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button label="Guardar" icon="pi pi-check" />
                            <Button label="Limpiar" icon="pi pi-times" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InputDemo;
