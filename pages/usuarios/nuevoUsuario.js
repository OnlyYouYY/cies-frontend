import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { addUsuarios, filtrarUsuarios } from "../../services/apiUsuarios";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";

const AgregarUsuario = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasenia: "",
    rol: "",
  });
  const [rol, setDropdownItem] = useState("");
  const dropdownItems = [
    { name: "Administrador", value: "administrador" },
    { name: "Recepcionista", value: "recepcionista" },
    { name: "Medico", value: "medico" },
    { name: "Farmaceutico", value: "farmaceutico" },
  ];
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    if (submitted) {
      registrarUsuario();
    }
  }, [submitted]);

  const validarUsuarioExistente = async (correo, contrasenia) => {
    try {
      const usuarios = await filtrarUsuarios("", correo);
      const usuarioExistente = usuarios.find(
        (usuario) =>
          usuario.correo.toLowerCase() === correo.toLowerCase() &&
          usuario.contrasenia === contrasenia
      );
      return usuarioExistente;
    } catch (error) {
      throw error;
    }
  };

  const registrarUsuario = async () => {
    try {
      const usuarioExistente = await validarUsuarioExistente(
        usuario.correo,
        usuario.contrasenia
      );
      if (usuarioExistente) {
        setErrorMensaje(
          "Ya existe un usuario con el mismo correo y contraseña"
        );
        return;
      }

      const response = await addUsuarios(
        usuario.nombre,
        usuario.apellido,
        usuario.correo,
        usuario.contrasenia,
        rol
      );
      console.log(response);
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Exitoso",
          detail: "Usuario creado exitoso",
          life: 3000,
        });
      }
      setUsuario({
        nombre: "",
        apellido: "",
        correo: "",
        contrasenia: "",
        rol: "",
      });
      setErrorMensaje("");
      setError(false);
      setSubmitted(false); // Se agrega esta línea para habilitar el envío de nuevos usuarios
    } catch (error) {
      console.log(error);
      toast.current?.show?.({
        severity: "error",
        summary: "Error",
        detail: "No se pudo crear el usuario",
        life: 3000,
      });
      setError(true);
      setSubmitted(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const usuarioExistente = await validarUsuarioExistente(
      usuario.correo,
      usuario.contrasenia
    );
    if (usuarioExistente) {
      setErrorMensaje("Ya existe un usuario con el mismo correo y contraseña");
      return;
    }
    setErrorMensaje("");
    setSubmitted(true);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
  };

  const limpiarCampos = () => {
    setUsuario({
      nombre: "",
      apellido: "",
      correo: "",
      contrasenia: "",
      rol: "",
    });
    setError(false);
    setErrorMensaje("");
  };

  return (
    <div className="card">
      <h2>Agregar Nuevo Usuario</h2>
      <h5>Ingrese los siguientes datos</h5>
      <br />
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            name="nombre"
            value={usuario.nombre}
            onChange={onInputChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="field">
          <label htmlFor="apellido">Apellido</label>
          <InputText
            id="apellido"
            name="apellido"
            value={usuario.apellido}
            onChange={onInputChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="field">
          <label htmlFor="correo">Correo electrónico</label>
          <InputText
            id="correo"
            name="correo"
            value={usuario.correo}
            onChange={onInputChange}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div className="field">
          <label htmlFor="contrasenia">Contraseña</label>
          <InputText
            id="contrasenia"
            name="contrasenia"
            value={usuario.contrasenia}
            onChange={onInputChange}
            required
            type="password"
            style={{ width: "100%" }}
          />
        </div>
        <div className="field">
          <label htmlFor="rol">Rol</label>
          <Dropdown
            id="state"
            value={rol}
            onChange={(event) => setDropdownItem(event.target.value)}
            options={dropdownItems}
            optionLabel="name"
            placeholder="Seleccionar"
            className="w-full md:w-30rem mb-5"
          ></Dropdown>
        </div>
        <div>
          <Button label="Guardar" icon="pi pi-check" type="submit" />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            onClick={limpiarCampos}
            className="p-button-secondary"
          />
        </div>
      </form>
      {errorMensaje && (
        <div className="error-message">
          <span>{errorMensaje}</span>
        </div>
      )}
      <Toast ref={toast} position="bottom-right" />
    </div>
  );
};

export default AgregarUsuario;
