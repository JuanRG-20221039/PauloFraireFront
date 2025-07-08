import React, { useState, useEffect } from 'react';
import clientAxios from '../../../config/clientAxios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Spinner from '../../../components/Spinner';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await clientAxios.get('/user');
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Error al obtener los usuarios');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await clientAxios.delete(`/user/${userToDelete._id}`);
            toast.success('Usuario eliminado correctamente');
            setShowDeleteModal(false);
            setUserToDelete(null);
            getUsers();
        } catch (error) {
            console.log(error);
            toast.error('Error al eliminar el usuario');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await clientAxios.put(`/user/${editingUser._id}`, editingUser);
            toast.success('Usuario actualizado correctamente');
            setShowEditModal(false);
            setEditingUser(null);
            getUsers();
        } catch (error) {
            console.log(error);
            toast.error('Error al actualizar el usuario');
        }
    };

    const handleChangeEditingUser = useCallback((field, value) => {
        setEditingUser(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const getRoleName = (role) => {
        switch (role) {
            case '0': return 'Estudiante';
            case '1': return 'Administrador';
            case '2': return 'Editor';
            default: return 'Desconocido';
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Administrar Usuarios</h1>
                <Link to="/admin/users/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Agregar Usuario
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{`${user.name} ${user.lastName}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getRoleName(user.role)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => {
                                                const roleAsNumber = Number(user.role);
                                                setEditingUser({
                                                    ...user,
                                                role: [0, 1, 2].includes(roleAsNumber) ? roleAsNumber : '', // ← asegura valor válido
                                                });
                                                setShowEditModal(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setUserToDelete(user);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-4">Confirmar Eliminación</h3>
                        <p>¿Estás seguro de que deseas eliminar al usuario {userToDelete?.name}?</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h3 className="text-lg font-bold mb-4">Editar Usuario</h3>
                        <form onSubmit={handleEdit}>
                            {console.log('Edit Modal render')}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) => handleChangeEditingUser('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                                    <input
                                        type="text"
                                        value={editingUser.lastName}
                                        onChange={(e) => handleChangeEditingUser('lastName', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => handleChangeEditingUser('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                                    <select
                                        value={editingUser.role?.toString() ?? ''}
                                        onChange={(e) => handleChangeEditingUser('role', parseInt(e.target.value, 10))}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="0">Estudiante</option>
                                        <option value="1">Administrador</option>
                                        <option value="2">Editor</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
