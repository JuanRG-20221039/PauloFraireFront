import React, { useEffect, useState } from 'react'
import clientAxios from '../../../config/clientAxios'
import { Link, useNavigate } from 'react-router-dom';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoIosAddCircle } from 'react-icons/io';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAuth from "../../../hooks/useAuth";

const AdminUsers = () => {
    const { token, logout } = useAuth();
    const [users, setUsers] = useState([]);
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
                setUsers(users.filter(user => user._id !== userId));
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

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await clientAxios.get('/user', config);
                setUsers(response.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error('Sesión expirada');
                    logout();
                } else {
                    console.error(error);
                    toast.error('Error al cargar los usuarios');
                }
            }
        }
        getUsers();
    }, [token]);

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

            <p className="text-center  my-4 mx-2">
                Aqui podras administrar los usuarios de la pagina web
            </p>

            <div className="flex my-2 mx-10">
                <div className="p-2">
                    <Link to='/admin/add-user' className="btn-action p-2">
                        <IoIosAddCircle className="text-2xl" />
                        Agregar Usuario
                    </Link>
                </div>
            </div>

            <div className="">
                <div className="col-span-1 overflow-auto bg-slate-50 shadow-lg p-4">
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
                                users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-sm text-gray-600 mt-2 text-center p-4">No hay Usuarios</td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
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
            </div>
        </section>
    )
}

export default AdminUsers
