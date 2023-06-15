import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { getUsuario, updateUsuario } from '../../services/apiUsuarios';
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { FileUpload } from 'primereact/fileupload';
import { useRouter } from 'next/router';
import { Password } from 'primereact/password';
import { getSession } from '../../utils/session';
import { decryptData } from '../../services/crypto';

const PerfilUsuario = ({ usuarioId }) => {

  const session = getSession();
  const router = useRouter();

  const rolesPermitidos = ['administrador', 'recepcionista', 'medico', 'farmaceutico'];

  useEffect(() => {
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
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className='card p-fluid'>
          <h5 className='card'>Perfil de usuario</h5>
          <div className="grid">
            <div className="col-12 md:col-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="field">
                <h5>Foto de Perfil</h5>
              </div>
              <div style={{ width: '250px', height: '250px' }}>
                <div
                  style={{
                    borderRadius: '50%',
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${selectedFile ? URL.createObjectURL(selectedFile) : 'https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                </div>
              </div>

              {selectedFile && (
                <div style={{ marginTop: '20px' }}>
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={cancelarSubida}
                    style={{ width: 'auto' }}
                  />
                </div>
              )}
              <div style={{ marginTop: '20px' }}>
                <FileUpload
                  key={fileKey}
                  mode="basic"
                  chooseLabel="Seleccionar"
                  customUpload
                  uploadHandler={uploadFile}
                  onSelect={onFileSelect}
                  style={{ marginBottom: '20px' }}
                />
              </div>
            </div>


            <div className="col-12 md:col-6">
              <div className="field">
                <label htmlFor="nombres">Nombres</label>
                <InputText
                  id="nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="field">
                <label htmlFor="apellidos">Apellidos</label>
                <InputText
                  id="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="field">
                <label htmlFor="correo">Correo electrónico</label>
                <InputText
                  id="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="field">
                <label htmlFor="contrasenia">Contraseña</label>
                <Password id="contrasenia" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} toggleMask disabled={!editing} />
              </div>

              {!editing && (
                <div className="card flex flex-wrap justify-content-center gap-3">
                  <Button label="Editar datos" icon="pi pi-pencil" onClick={() => setEditing(true)} className="p-mt-3" style={{ width: 'auto' }} />
                </div>
              )}
              {editing && (
                <div className="card flex flex-wrap justify-content-center gap-3">
                  <Button
                    label="Guardar"
                    icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
                    className="p-mt-3" 
                    style={{ width: 'auto' }}
                    onClick={guardarUsuario}
                    disabled={loading}
                  />
                  <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    className="p-mt-3" 
                    style={{ width: 'auto' }}
                    onClick={() => {
                      setEditing(false);
                      cargarUsuario(usuarioId);
                    }}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
