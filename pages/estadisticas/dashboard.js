import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import Link from 'next/link';
import { Dropdown } from 'primereact/dropdown';
import { listarCategorias, mostrarServiciosID, mostrarServiciosIDmedico, mostrarMedicosIDservicio, mostrarPacientes, registrarFicha, mostrarPacienteID } from '../../services/apiService';
const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
        {
            label: 'Ventas',
            data: [2, 1, 1, 4, 12, 3],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {

    const [products, setProducts] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [lineOptions, setLineOptions] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [selectedCity, setSelectedCity] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [categoriasDropdown, setCategoriasDropdown] = useState([]);
    

    useEffect(() => {
        async function obtenerCategorias() {
            try {
                const categorias = await listarCategorias();
                console.log(categorias);
                setCategorias(categorias);

                const categoriasDropdown = categorias.map(categoria => ({
                    label: categoria.nombre_categoria,
                    value: categoria.id
                }));

                setCategoriasDropdown(categoriasDropdown);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerCategorias();
    }, []);

    useEffect(() => {
        async function obtenerPacientes() {
            try {
                const pacientes = await mostrarPacientes();
                console.log(pacientes);
                setPacientes(pacientes);

            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacientes();
    }, []);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);


    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--yellow-500'),
                        documentStyle.getPropertyValue('--red-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--red-400')
                    ]
                }
            ]
        }
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    const nombrePacienteTemplate = (rowData) => {
        return <span>{rowData.nombres} {rowData.apellidos}</span>;
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Ventas de farmacia</span>
                            <div className="text-900 font-medium text-xl">5</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">5 nuevos </span>
                    <span className="text-500">en el ultimo mes</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Venta de servicios</span>
                            <div className="text-900 font-medium text-xl">11</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">1 nuevos </span>
                    <span className="text-500">el dia de hoy</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Pacientes nuevos</span>
                            <div className="text-900 font-medium text-xl">13</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">13 </span>
                    <span className="text-500">nuevos registros el ultimo mes</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Resumen de venta de fichas</h5>
                    <Dropdown id="categoria" value={categoria} onChange={(e) => setCategoria(e.value)} options={categoriasDropdown} placeholder="Seleccione una categoria" className='w-full field'/>
                    <div className="flex justify-content-center">
                        <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                    </div>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Servicios mas solicitados</h5>
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                            <div>
                                <span className="text-900 font-medium mr-2 mb-1 md:mb-0">Rayos X</span>
                                <div className="mt-1 text-600">Servicios de diagnostico</div>
                            </div>
                            <div className="mt-2 md:mt-0 flex align-items-center">
                                <span className="text-orange-500 ml-3 font-medium">50 fichas</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Resumen de venta en farmacia</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
                <div className="card">
                    <h5>Pacientes nuevos</h5>
                    <DataTable value={pacientes} rows={5} paginator responsiveLayout="scroll">
                        <Column field="nombres" header="Nombre Completo" body={nombrePacienteTemplate} sortable style={{ width: '35%' }} />
                        <Column field="ci" header="Documento de identidad" sortable style={{ width: '35%' }} />
                        <Column field="sexo" header="Genero" sortable style={{ width: '30%' }} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
