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
                //{ label: 'Prueba Menu', icon: 'pi pi-fw pi-id-card', to: '/uikit/input' },
                { label: 'Registro de paciente', icon: 'pi pi-fw pi-user-plus' },
                { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open' },
                
                { label: 'Consulta medica', icon: 'pi pi-fw pi-heart' },
            ]
        },
        {
            label: 'Farmacia',
            items: [
                { label: 'Gestion de inventario', icon: 'pi pi-fw pi-book' },
                { label: 'Dispensacion de medicamentos', icon: 'pi pi-fw pi-heart' },
                { label: 'Control de stock', icon: 'pi pi-fw pi-list' },
            ]
        },

        {
            label: 'Servicios',
            items: [
                {
                    label: 'Gestión de categorias para servicios',
                    icon: 'pi pi-fw pi-table',
                    items: [
                        { label: 'Nueva categoria', icon: 'pi pi-fw pi-plus', to: '/servicios/categoriaServicios' },
                        { label: 'Actualizar categoria', icon: 'pi pi-fw pi-pencil', to: '/servicios/actualizarCategoria'},
                    ]
                },
                {
                    label: 'Gestión de servicios',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Nuevo servicio', icon: 'pi pi-fw pi-plus', to: '/servicios/nuevoServicio' },
                        { label: 'Actualizar servicio', icon: 'pi pi-fw pi-pencil', to: '/servicios' },
                        { label: 'Listar servicios', icon: 'pi pi-fw pi-list', to: '/servicios/listarCategorias' }
                    ]
                },
                { label: 'Citas', icon: 'pi pi-fw pi-calendar' ,to:'/servicios/citas/nuevaCita'},
            ]

        },
        
        {
            label: 'Administración',
            items: [
                { label: 'Gestión de usuarios', icon: 'pi pi-fw pi-user-plus' },
                { label: 'Generación de informes', icon: 'pi pi-fw pi-file-excel' },
                { label: 'Configuración del sistema', icon: 'pi pi-fw pi-cog' }
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
