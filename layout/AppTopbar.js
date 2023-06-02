import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { removeSession } from '../utils/session';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-simple.png`} width="40px" height={'35px'} widt={'true'} alt="logo" />
                <span className='font-bold'>CIES Pro Manage</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendario</span>
                </button>
                <Link href="/usuarios/editarPerfil">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                </Link>

                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-cog"></i>
                    <span>Configuracion</span>
                </button>

                <Button label="Cerrar Sesion" severity="danger" className='ml-3' onClick={() => {
                    localStorage.removeItem('userData');
                    removeSession();
                    Router.push('../auth/login');
                }}/>
            </div>
        </div>
    );
});

export default AppTopbar;
