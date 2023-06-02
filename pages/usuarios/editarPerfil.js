import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { getUsuario, updateUsuario } from '../../services/apiUsuarios';
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';

const PerfilUsuario = ({ usuarioId }) => {
  const [id, setid] = useState(null);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [rol, setRol] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);

  const toast = useRef(null);

  useEffect(() => {
    cargarUsuario(usuarioId);
    console.log(usuarioId);
  }, [usuarioId]);

  const cargarUsuario = async (id) => {
    try {
      let usuario;
      if (id) {
        usuario = await getUsuario(id);
      } else {
        const userData = JSON.parse(localStorage.getItem('userData'));
        usuario = {
          id: userData.id,
          nombres: userData.nombres,
          apellidos: userData.apellidos,
          correo: userData.correo,
          contrasenia: userData.contrasenia,
          rol: userData.rol
        };
        console.log(usuario);
      }
      setid(usuario.id);
      setNombres(usuario.nombres);
      setApellidos(usuario.apellidos);
      setCorreo(usuario.correo);
      setContrasenia(usuario.contrasenia);
      setRol(usuario.rol);
      console.log(nombres);
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
      showToast('error', 'Error', 'No se pudo cargar el usuario.');
    }
  };

  const guardarUsuario = async () => {
    if (nombres.trim() === '' || apellidos.trim() === '' || correo.trim() === '' || contrasenia.trim() === '' || rol.trim() === '') {
      showToast('warn', 'Advertencia', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await updateUsuario(id, nombres, apellidos, correo, contrasenia, rol);
      console.log(response);

      showToast('success', 'Éxito', 'Usuario guardado correctamente.');
      setEditing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      showToast('error', 'Error', 'No se pudo guardar el usuario.');
      setLoading(false);
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail });
  };

  const onFileSelect = (event) => {
    setSelectedFile(event.files[0]);
  };

  const uploadFile = () => {
    console.log('Archivo seleccionado:', selectedFile);
  };

  const cancelarSubida = () => {
    setSelectedFile(null);
    setFileKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="p-grid">
      <div className="p-col-12 p-md-6">
        <h2 className='card'>EDITAR PERFIL DE USUARIO</h2>
        <Card title="Perfil de Usuario" className="card-form" style={{ width: '50%', float:'left', marginTop:'35px' }}>
          <div className="p-mb-3">
            <label htmlFor="nombres">Nombre:   </label>
            <InputText
              id="nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              disabled={!editing}
            />
          </div>
          <br />
          <div className="p-mb-3">
            <label htmlFor="apellidos">Apellido:   </label>
            <InputText
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              disabled={!editing}
            />
          </div>
          <br />
          <div className="p-mb-3">
            <label htmlFor="correo">Correo electrónico:   </label>
            <InputText
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={!editing}
            />
          </div>
          <br />
          <div className="p-mb-3">
            <label htmlFor="contrasenia">Contraseña:   </label>
            <InputText
              id="contrasenia"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              disabled={!editing}
            />
          </div>
          <br />

          {!editing && (
            <Button label="Editar" icon="pi pi-pencil" onClick={() => setEditing(true)} />
          )}
          {editing && (
            <div>
              <Button
                label="Guardar"
                icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                onClick={guardarUsuario}
                disabled={loading}
              />
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => {
                  setEditing(false);
                  cargarUsuario(usuarioId);
                }}
                disabled={loading}
              />
            </div>
          )}
        </Card>
      </div>
      <br />
      <br />
      <div className="p-col-12 p-md-6 p-lg-4">
        <Card title="Subir Imagen" className="card-form" style={{ width: '45%', marginLeft: '50%', position: 'left'}}>
          <h6>Foto de Perfil</h6>
          <FileUpload
            key={fileKey} 
            mode="basic"
            chooseLabel="Seleccionar"
            customUpload
            uploadHandler={uploadFile}
            onSelect={onFileSelect}
            style={{display:'inline-block', marginRight:'10px'}}
           
          
          />
          <br/>
         
          {selectedFile && (
            <div className="p-mt-2" style={{float:'right'}}>
              <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-primary"
                onClick={cancelarSubida}
                
              
              />
            </div>
          )}
          
          <div className="container">
          {selectedFile && (
            <div>
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Imagen seleccionada"
                style={{
                  marginTop: '10px',
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '250px',
                  borderRadius:'50%',
                  
          
                }}
              />
            </div>
            
          )}
          </div>
         
         
        </Card>
      </div>
    </div>
  );
};

export default PerfilUsuario;
