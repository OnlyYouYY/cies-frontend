import Router, { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { login } from '../../../services/api';
import { setSession } from '../../../utils/session';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Link from 'next/link';


const RegisterPage = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const [dropdownItem, setDropdownItem] = useState(null);
    const dropdownItems = [
        { name: 'Administrador', code: 'administrador' },
        { name: 'Recepcionista', code: 'recepcionista' },
        { name: 'Medico', code: 'medico' },
        { name: 'Farmaceutico', code: 'farmaceutico' }
    ];

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <div className={containerClassName}>
            <Head>
                <title>Registro de usuario</title>
            </Head>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-simple.png`} alt="Cies logo" className="mb-5 w-6rem flex-shrink-0" />
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(255, 165, 0, 0) 40%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                            <span className="text-600 font-medium">Registra tus datos.</span>
                        </div>
                        <form>
                            <label htmlFor="nombres" className="block text-900 text-xl font-medium mb-2">
                                Nombres
                            </label>
                            <InputText inputid="nombres1" type="text" placeholder="Nombres" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}></InputText>
                            <label htmlFor="apellidos" className="block text-900 text-xl font-medium mb-2">
                                Apellidos
                            </label>
                            <InputText inputid="apellidos1" type="text" placeholder="Apellidos" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}></InputText>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Correo electronico
                            </label>
                            <InputText inputid="email1" type="email" placeholder="Correo electronico" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }}></InputText>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Contraseña
                            </label>
                            <Password inputid="password1" placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" maxLength={15}></Password>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Acceso
                            </label>
                            <Dropdown id="state" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Seleccionar" className="w-full md:w-30rem mb-5"></Dropdown>
                            <Button label="Registrar" className="block w-full p-3 text-xl bg-orange-400" type='submit'></Button>
                            <div className="block text-center mb-5 mt-3">
                                <span>Espera la confirmacion por correo electronico para acceder.</span>
                            </div>
                        </form>
                        <Button icon="pi pi-arrow-left" className="block w-full" style={{ color: 'var(--primary-color)'}} label="Iniciar Sesion" text onClick={() => Router.push('/auth/login')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default RegisterPage;
