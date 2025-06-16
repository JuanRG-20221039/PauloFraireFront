import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { toast } from 'react-hot-toast';
import clientAxios from '../../config/clientAxios';
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const UserProfile = () => {
    const { logout, token } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
        },
    };

    const handleDocChange = (e) => {
        setDocs([...docs, ...Array.from(e.target.files)]);
    };

    const removeDoc = (index) => {
        setDocs(docs.filter((_, i) => i !== index));
    };

    const handleUploadDocs = async () => {
        if (docs.length === 0) {
            Swal.fire("Error", "Debe seleccionar al menos un documento", "error");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        docs.forEach((doc) => formData.append("docs", doc));

        try {
            // Endpoint para subir documentos
            await clientAxios.post(`/user/${userData._id}/docs`, formData, config);
            Swal.fire("Éxito", "Documentos subidos correctamente. Pendientes de aprobación.", "success");
            setDocs([]);
            // Actualizar los datos del usuario para mostrar los nuevos documentos
            fetchUserData();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al subir los documentos", "error");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

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

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Documentos del Aspirante</h2>
                        <div className="mb-4">
                            <p className="text-gray-600 font-medium">Estado de Documentos:</p>
                            <div className="flex items-center mt-1">
                                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${userData.docsStatus === 1 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                <p className="text-gray-800">
                                    {userData.docsStatus === 1 ? 'Aprobados' : 'Pendientes de aprobación'}
                                </p>
                            </div>
                        </div>

                        {userData.docsAspirante && userData.docsAspirante.length > 0 ? (
                            <div className="mt-4">
                                <h3 className="text-lg font-medium mb-2">Documentos Cargados:</h3>
                                <ul className="border p-2 rounded-lg bg-gray-100">
                                    {userData.docsAspirante.map((doc, index) => (
                                        <li key={index} className="flex justify-between items-center p-2 border-b">
                                            <div>
                                                <p className="font-medium">{doc.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    Subido el: {new Date(doc.uploadDate).toLocaleDateString('es-MX')}
                                                </p>
                                            </div>
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                Ver
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-600 italic">No hay documentos cargados.</p>
                        )}

                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Cargar Nuevos Documentos:</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Por favor, suba su certificado, CURP, ficha de inscripción y carta compromiso.
                            </p>
                            
                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                multiple
                                onChange={handleDocChange}
                                className="hidden"
                                id="docsInput"
                            />
                            <div className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer">
                                <label
                                    htmlFor="docsInput"
                                    className="w-full text-gray-500 cursor-pointer"
                                >
                                    {docs.length > 0
                                        ? `Se han agregado ${docs.length} archivos`
                                        : "No se ha seleccionado ningún documento"}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("docsInput").click()}
                                    className={`p-1 rounded-full ${docs.length > 0 ? "text-green-600" : "text-blue-600"}`}
                                >
                                    <IoIosAddCircle className="text-2xl" />
                                </button>
                            </div>

                            {docs.length > 0 && (
                                <>
                                    <ul className="mt-2 border p-2 rounded-lg bg-gray-100">
                                        {docs.map((doc, index) => (
                                            <li
                                                key={index}
                                                className="flex justify-between items-center p-1 border-b"
                                            >
                                                {doc.name}
                                                <button type="button" onClick={() => removeDoc(index)}>
                                                    <RiDeleteBin6Line className="text-red-600 text-xl" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={handleUploadDocs}
                                        disabled={isUploading}
                                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                    >
                                        {isUploading ? `Subiendo... ${uploadProgress}%` : "Subir Documentos"}
                                    </button>
                                </>
                            )}
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


