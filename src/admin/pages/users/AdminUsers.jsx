import React, { useEffect, useState } from 'react'
import clientAxios from '../../../config/clientAxios'
import { Link, useNavigate } from 'react-router-dom';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoIosAddCircle } from 'react-icons/io';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useAuth from "../../../hooks/useAuth";
import Spinner from '../../../components/Spinner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminUsers = () => {
    const { token, logout } = useAuth();
    const [adminUsers, setAdminUsers] = useState([]);
    const [editorUsers, setEditorUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchRole, setSearchRole] = useState('all');
    const [searchResult, setSearchResult] = useState(null);
    const [showSearchAlert, setShowSearchAlert] = useState(false);
    const navigate = useNavigate();

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    const handleDeleteClick = async (userId) => {
        const result = await Swal.fire({
            title: '¿Estas seguro?',
            text: "Una vez eliminado, no podrás recuperar el usuario",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar'
        });

        if (result.isConfirmed) {
            try {
                await clientAxios.delete(`/user/${userId}`, config);
                
                // Actualizar todas las listas de usuarios
                setAllUsers(allUsers.filter(user => user._id !== userId));
                setAdminUsers(adminUsers.filter(user => user._id !== userId));
                setEditorUsers(editorUsers.filter(user => user._id !== userId));
                
                toast.success('Usuario eliminado correctamente');
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Sesión expirada');
                    logout();
                } else {
                    console.error(error);
                    toast.error('Error al eliminar el usuario');
                }
            }
        }
    };

    const [studentUsers, setStudentUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                const response = await clientAxios.get('/user', config);
                // Guardar todos los usuarios
                setAllUsers(response.data);
                
                // Filtrar usuarios por rol
                const admins = response.data.filter(user => parseInt(user.role) === 1);
                const editors = response.data.filter(user => parseInt(user.role) === 2);
                const students = response.data.filter(user => parseInt(user.role) === 0);
                
                setAdminUsers(admins);
                setEditorUsers(editors);
                setStudentUsers(students);
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Sesión expirada');
                    logout();
                } else {
                    console.error(error);
                    toast.error('Error al cargar los usuarios');
                }
                setLoading(false);
            }
        }
        getUsers();
    }, [token]);

    const handleSearch = () => {
        if (!searchEmail.trim()) {
            toast.error('Ingresa un correo para buscar');
            return;
        }

        // Filtrar usuarios según el rol seleccionado
        let usersToSearch = allUsers;
        if (searchRole !== 'all') {
            usersToSearch = allUsers.filter(user => parseInt(user.role) === parseInt(searchRole));
        }

        const foundUser = usersToSearch.find(user => 
            user.email.toLowerCase().includes(searchEmail.toLowerCase())
        );

        if (foundUser) {
            setSearchResult(foundUser);
            // Redirigir al panel de edición del usuario encontrado
            navigate(`/admin/add-user?id=${foundUser._id}`);
        } else {
            setSearchResult(null);
            setShowSearchAlert(true);
            toast.error(`No se encontró ningún usuario ${searchRole !== 'all' ? roleDefault(searchRole) : ''} con ese correo`);
            // Ocultar la alerta después de 3 segundos
            setTimeout(() => {
                setShowSearchAlert(false);
            }, 3000);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchEmail(e.target.value);
        // Si se borra el campo de búsqueda, ocultar la alerta
        if (!e.target.value.trim()) {
            setSearchResult(null);
            setShowSearchAlert(false);
        }
    };

    const handleRoleChange = (e) => {
        setSearchRole(e.target.value);
    };

    const roleDefault = (role) => {
        switch (parseInt(role)) {
            case 0:
                return 'Estudiante';
            case 1:
                return 'Administrador';
            case 2:
                return 'Editor';
            default:
                return 'Usuario básico';
        }
    }

    return (
        <section className="container mx-auto bg-slate-50">
            <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">Administra Los Usuarios</h1>

            <p className="text-center my-4 mx-2">
                Aquí podrás administrar los usuarios de la página web
            </p>

            {/* Barra de búsqueda */}
            <div className="flex justify-center my-6">
                <div className="relative w-full max-w-xl px-4">
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Buscar usuario por correo..."
                            value={searchEmail}
                            onChange={handleSearchInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                        <select
                            value={searchRole}
                            onChange={handleRoleChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="0">Estudiante</option>
                            <option value="1">Administrador</option>
                            <option value="2">Editor</option>
                        </select>
                        <button
                            onClick={handleSearch}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>

            {/* Alerta de búsqueda sin resultados */}
            {showSearchAlert && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-auto my-4 max-w-xl">
                    <p className="text-center">No se encontró ningún usuario con ese correo</p>
                </div>
            )}

            <div className="flex my-2 mx-10">
                <div className="p-2">
                    <Link to='/admin/add-user' className="btn-action p-2">
                        <IoIosAddCircle className="text-2xl" />
                        Agregar Usuario
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Spinner />
                </div>
            ) : (
                <Tabs className="mx-4">
                    <TabList className="flex border-b mb-4">
                        <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-green-600 hover:border-green-600 focus:outline-none transition-all" selectedClassName="text-green-600 border-green-600">
                            Administradores
                        </Tab>
                        <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-green-600 hover:border-green-600 focus:outline-none transition-all" selectedClassName="text-green-600 border-green-600">
                            Editores
                        </Tab>
                        <Tab className="px-4 py-2 cursor-pointer border-b-2 border-transparent hover:text-green-600 hover:border-green-600 focus:outline-none transition-all" selectedClassName="text-green-600 border-green-600">
                            Estudiantes
                        </Tab>
                    </TabList>

                    <TabPanel>
                        <div className="col-span-1 overflow-auto bg-slate-50 shadow-lg p-4">
                            <h2 className="text-xl font-semibold text-slate-600 mb-4">Usuarios Administradores</h2>
                            <table className="table-auto border w-full my-2">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 border text-gray-600">No.</th>
                                        <th className="px-2 py-2 border text-gray-600">Nombre</th>
                                        <th scope="col" className="px-2 py-2 border text-gray-600">Correo</th>
                                        <th className="px-2 py-2 border text-gray-600">Rol</th>
                                        <th className="px-2 py-2 border text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        adminUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-sm text-gray-600 mt-2 text-center p-4">No hay usuarios administradores</td>
                                            </tr>
                                        ) : (
                                            adminUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 py-2 border text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.name} {user.lastName}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {
                                                            roleDefault(user.role)
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2 border">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link to={`/admin/add-user?id=${user._id}`} className="">
                                                                <TiEdit className="text-2xl text-blue-600" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(user._id)}
                                                                className="hover:scale-105 transition-all ease-in-out duration-300"
                                                                disabled={loading}
                                                            >
                                                                <RiDeleteBin6Line className="text-2xl text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="col-span-1 overflow-auto bg-slate-50 shadow-lg p-4">
                            <h2 className="text-xl font-semibold text-slate-600 mb-4">Usuarios Editores</h2>
                            <table className="table-auto border w-full my-2">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 border text-gray-600">No.</th>
                                        <th className="px-2 py-2 border text-gray-600">Nombre</th>
                                        <th scope="col" className="px-2 py-2 border text-gray-600">Correo</th>
                                        <th className="px-2 py-2 border text-gray-600">Rol</th>
                                        <th className="px-2 py-2 border text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        editorUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-sm text-gray-600 mt-2 text-center p-4">No hay usuarios editores</td>
                                            </tr>
                                        ) : (
                                            editorUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 py-2 border text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.name} {user.lastName}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {
                                                            roleDefault(user.role)
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2 border">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link to={`/admin/add-user?id=${user._id}`} className="">
                                                                <TiEdit className="text-2xl text-blue-600" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(user._id)}
                                                                className="hover:scale-105 transition-all ease-in-out duration-300"
                                                                disabled={loading}
                                                            >
                                                                <RiDeleteBin6Line className="text-2xl text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="col-span-1 overflow-auto bg-slate-50 shadow-lg p-4">
                            <h2 className="text-xl font-semibold text-slate-600 mb-4">Usuarios Estudiantes</h2>
                            <table className="table-auto border w-full my-2">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 border text-gray-600">No.</th>
                                        <th className="px-2 py-2 border text-gray-600">Nombre</th>
                                        <th scope="col" className="px-2 py-2 border text-gray-600">Correo</th>
                                        <th className="px-2 py-2 border text-gray-600">Rol</th>
                                        <th className="px-2 py-2 border text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        studentUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-sm text-gray-600 mt-2 text-center p-4">No hay usuarios estudiantes</td>
                                            </tr>
                                        ) : (
                                            studentUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td className="px-2 py-2 border text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.name} {user.lastName}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-2 py-2 border text-center">
                                                        {
                                                            roleDefault(user.role)
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2 border">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link to={`/admin/add-user?id=${user._id}`} className="">
                                                                <TiEdit className="text-2xl text-blue-600" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteClick(user._id)}
                                                                className="hover:scale-105 transition-all ease-in-out duration-300"
                                                                disabled={loading}
                                                            >
                                                                <RiDeleteBin6Line className="text-2xl text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>
                </Tabs>
            )}
        </section>
    )
}

export default AdminUsers
