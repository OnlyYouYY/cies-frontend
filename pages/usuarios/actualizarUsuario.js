import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { actualizar, mostrarUsuarios } from "../../services/apiUsuarios";
import { confirmDialog } from "primereact/confirmdialog";
import { deleteUsuario } from "../../services/apiUsuarios";
import { Dialog } from "primereact/dialog";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef(null);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [rol, setRol] = useState("");
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const response = await mostrarUsuarios();
      setUsuarios(response);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarUsuario = async (usuarioId) => {
    try {
      const response = await deleteUsuario(usuarioId);
      console.log(response);
      obtenerUsuarios();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario eliminado exitosamente",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario",
        life: 3000,
      });
    }
  };

  const confirmarEliminarUsuario = (usuario) => {
    const confirmEliminar = () => {
      setUsuarioSeleccionado(usuario);
      console.log("Se confirma la eliminacion");
      confirmDialog({
        message: `¿Estás seguro de que quieres eliminar a ${usuario.nombre}?`,
        header: "Confirmar Eliminación",
        icon: "pi pi-exclamation-triangle",
        accept: () => eliminarUsuario(usuario.id), // Pasa usuario.id en lugar de usuario
      });
    };

    confirmEliminar();
  };

  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setCorreo(usuario.correo);
    setContrasenia(usuario.contrasenia);
    setRol(usuario.rol);
    setDialogVisible(true);
  };

  const guardarCambios = async () => {
    if (!nombre || !apellido || !correo || !rol) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
        life: 3000,
      });
      return;
    }

    try {
      await actualizar(
        usuarioSeleccionado.id,
        nombre,
        apellido,
        correo,
        contrasenia,
        rol
      );
      obtenerUsuarios();
      toast.current.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario actualizado exitosamente",
        life: 3000,
      });
      cerrarDialogo();
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo actualizar el usuario",
        life: 3000,
      });
    }
  };

  const cerrarDialogo = () => {
    setUsuarioSeleccionado(null);
    setNombre("");
    setApellido("");
    setCorreo("");
    setContrasenia("");
    setRol("");
    setDialogVisible(false);
  };

  const dialogFooter = (
    <div className="p-clearfix">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-secondary"
        onClick={cerrarDialogo}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-primary"
        onClick={guardarCambios}
      />
    </div>
  );

  const opcionesRol = [
    { label: "Administrador", value: "Administrador" },
    { label: "Recepcionista", value: "Recepcionista" },
    { label: "Médico", value: "Médico" },
    { label: "Farmacéutico", value: "Farmacéutico" },
  ];

  return (
    <div className="card">
      <h3>Actualizar Usuario</h3>
      <h5>Seleccione al usuario que desea editar o eliminar</h5>
      <Toast ref={toast} />
      <DataTable value={usuarios} className="p-datatable-striped">
        <Column field="nombre" header="Nombre" />
        <Column field="apellido" header="Apellido" />
        <Column field="correo" header="Correo" />
        <Column field="rol" header="Rol" />
        <Column
          body={(rowData) => (
            <div>
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-success p-mr-2"
                onClick={() => editarUsuario(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger"
                onClick={() => eliminarUsuario(rowData.id)}
              />
            </div>
          )}
        />
      </DataTable>
      <Dialog
        visible={dialogVisible}
        onHide={cerrarDialogo}
        header={usuarioSeleccionado ? "Editar Usuario" : "Agregar Usuario"}
        footer={dialogFooter}
        style={{ width: "50vw" }} // Aumenta el tamaño de la ventana emergente
      >
        <div className="p-grid p-fluid">
          <div className="p-col-4">
            <label htmlFor="nombre">Nombre</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="apellido">Apellido</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="correo">Correo</label>
          </div>
          <div className="p-col-8">
            <InputText
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="contrasenia">Contraseña</label>
          </div>
          <div className="p-col-8">
            <Password
              id="contrasenia"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              toggleMask
              feedback={false}
            />
          </div>
          <div className="p-col-4">
            <label htmlFor="rol">Rol</label>
          </div>
          <div className="p-col-8">
            <Dropdown
              id="rol"
              value={rol}
              options={opcionesRol}
              onChange={(e) => setRol(e.value)}
              placeholder="Seleccionar Rol"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Usuarios;