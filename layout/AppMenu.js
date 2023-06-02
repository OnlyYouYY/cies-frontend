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
                { label: 'Registro de paciente', icon: 'pi pi-fw pi-user-plus', to: '/pacientes/nuevoPaciente'},
                { label: 'Actualizar pacientes', icon: 'pi pi-fw pi-pencil', to: '/pacientes/actualizarPaciente'},
                { label: 'Historia Clinica', icon: 'pi pi-fw pi-folder-open' },
                { label: 'Consulta medica', icon: 'pi pi-fw pi-heart' },
                { label: 'Estadisticas de pacientes', icon: 'pi pi-fw pi-file-o', to: '/estadisticas/indexEstadisticasPacientes' }
            ]
        },
        {
            label: 'Farmacia',
            items: [
                {
                    label: 'Gestion de Productos',
                    icon: 'pi pi-fw pi-book',
                    items: [
                        { label: 'Nuevo producto', icon: 'pi pi-fw pi-plus', to: '/farmproductos/nuevoProducto' },
                        { label: 'Actualizar producto', icon: 'pi pi-fw pi-pencil', to: '/farmproductos' },
                        { label: 'Listar productos', icon: 'pi pi-fw pi-list', to: '/farmproductos/listarProductos' }
                    ]
                },
                {
                    label: 'Gestion de Proveedores',
                    icon: 'pi pi-fw pi-book',
                    items: [
                        { label: 'Nuevo proveedor', icon: 'pi pi-fw pi-plus', to: '/farmproveedores/nuevoProveedor' },
                        { label: 'Actualizar proveedor', icon: 'pi pi-fw pi-pencil', to: '/farmproveedores' },
                        { label: 'Listar proveedores', icon: 'pi pi-fw pi-list', to: '/farmproveedores/listarProveedores' }
                    ]
                },
                {
                    label: 'Gestion de Reabastecimiento',
                    icon: 'pi pi-fw pi-book',
                    items: [
                        { label: 'Nuevo reabastecimiento', icon: 'pi pi-fw pi-plus', to: '/farmreabastecimiento/nuevoReabaste' },
                        { label: 'Actualizar reabastecimiento', icon: 'pi pi-fw pi-pencil', to: '/farmreabastecimiento' },
                    ]
                },
                {
                    label: 'Gestion de Ventas',
                    icon: 'pi pi-fw pi-book',
                    items: [
                        { label: 'Nuevo venta', icon: 'pi pi-fw pi-plus', to: '/farmventas/nuevaVenta' },
                        { label: 'Actualizar venta', icon: 'pi pi-fw pi-pencil', to: '/farmventas' },
                    ]
                }
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
                        { label: 'Actualizar categoria', icon: 'pi pi-fw pi-pencil', to: '/servicios/actualizarCategoria' },
                    ]
                },
                {
                    label: 'Gestión de servicios',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Nuevo servicio', icon: 'pi pi-fw pi-plus', to: '/servicios/nuevoServicio' },
                        { label: 'Actualizar servicio', icon: 'pi pi-fw pi-pencil', to: '/servicios' },
                        
                    ]
                },
                { label: 'Ver servicios', icon: 'pi pi-fw pi-list', to: '/servicios/listarCategorias' },
                { label: 'Registro de fichas', icon: 'pi pi-fw pi-calendar', to: '/servicios/citas/nuevaCita' },
                { label: 'Estadisticas de servicios', icon: 'pi pi-fw pi-file-o', to: '/estadisticas/indexEstadisticasServicios' }
            ]

        },

        {
            label: 'Administración',
            items: [
                {
                    label: 'Gestión de usuarios',
                    icon: 'pi pi-fw pi-user-plus',
                    items: [
                        { label: 'Agregar un usuario', icon: 'pi pi-fw pi-plus', to: '/usuarios/nuevoUsuario' },
                        { label: 'Actualizar usuario', icon: 'pi pi-fw pi-pencil', to: '/usuarios/actualizarUsuario' },
                        { label: 'Listar usuarios', icon: 'pi pi-fw pi-list', to: '/usuarios/listarUsuario' },
                    ]
                },
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
