import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-hot-toast';
import clientAxios from '../../config/clientAxios';

const UserProfile = () => {
    const { logout, token } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Obtener el email del usuario del localStorage
                const storedToken = localStorage.getItem("token");
                if (storedToken) {
                    const parsedToken = JSON.parse(storedToken);
                    const email = parsedToken.email;
                    
                    // Obtener los datos completos del usuario
                    const response = await clientAxios.get(`/user/email/${email}`, {
                        headers: {
                            'Authorization': `Bearer ${parsedToken.token}`
                        }
                    });
                    
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                toast.error('No se pudo cargar la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Cargando información del usuario...</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Perfil de Usuario</h1>
            
            {userData ? (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Información Personal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 font-medium">Nombre:</p>
                                <p className="text-gray-800">{userData.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Apellido:</p>
                                <p className="text-gray-800">{userData.lastName}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Correo Electrónico:</p>
                                <p className="text-gray-800">{userData.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 font-medium">Fecha de Registro:</p>
                                <p className="text-gray-800">{new Date(userData.createdAt).toLocaleDateString('es-MX')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600">
                    No se pudo cargar la información del usuario.
                </div>
            )}
            
            <div className="mt-6 text-center">
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default UserProfile;


