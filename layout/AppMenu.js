import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'Home',
            items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Pacientes',
            items: [
                //{ label: 'Registro Paciente', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
                { label: 'Registro de paciente', icon: 'pi pi-fw pi-user-plus'},
                { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open'},
                { label: 'Citas programadas', icon: 'pi pi-fw pi-calendar'},
                { label: 'Consulta medica', icon: 'pi pi-fw pi-heart'},
                { label: 'Pagos', icon: 'pi pi-fw pi-chart-line'},
                { label: 'Administracion de medicamentos', icon: 'pi pi-fw pi-list'},
                { label: 'Informes', icon: 'pi pi-fw pi-file-o' }
            ]
        },
        {
            label: 'Farmacia',
            items: [
                { label: 'Gestion de inventario', icon: 'pi pi-fw pi-book'},
                { label: 'Gestion de pedidos', icon: 'pi pi-fw pi-shopping-cart'},
                { label: 'Dispensacion de medicamentos', icon: 'pi pi-fw pi-heart'},
                { label: 'Control de stock', icon: 'pi pi-fw pi-list'},
                { label: 'Control de calidad', icon: 'pi pi-fw pi-star-fill'},
            ]
        },
        // {
        //     label: 'Facturacion',
        //     items: [
        //         { label: 'Registro de servicios', icon: 'pi pi-fw pi-check-square'},
        //         { label: 'Gestion de pagos', icon: 'pi pi-fw pi-dollar'},
        //         { label: 'Gestion de cobros', icon: 'pi pi-fw pi-money-bill'},
        //         { label: 'Control de caja', icon: 'pi pi-fw pi-chart-bar'},
        //         { label: 'Gestion de devoluciones', icon: 'pi pi-fw pi-trash'},
        //         { label: 'Informes financieros', icon: 'pi pi-fw pi-chart-line'},
        //     ]
        // },
        {
            label: 'Administracion',
            items: [
                { label: 'Gestion de servicios', icon: 'pi pi-fw pi-briefcase', to: '/servicios'},
                { label: 'Gestion de usuarios', icon: 'pi pi-fw pi-user-plus'},
                { label: 'Gestion de permisos', icon: 'pi pi-fw pi-globe'},
                { label: 'Gestion de backups', icon: 'pi pi-fw pi-database'},
                { label: 'Monitoreo del sistema', icon: 'pi pi-fw pi-desktop'},
                { label: 'Generacion de informes', icon: 'pi pi-fw pi-file-excel'},
                { label: 'Configuracion del sistema', icon: 'pi pi-fw pi-cog'},
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
