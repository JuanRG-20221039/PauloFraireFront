import React, { useState } from 'react';
import AllImages from './AllImages';
import { IoIosAddCircle } from "react-icons/io";
import clientAxios from '../../../config/clientAxios';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Swal from 'sweetalert2';
import EditAcademyActivityModal from './EditAcademyActivityModal';

const AcademyActivityCard = ({ activity, refresh }) => {
    const { _id } = activity;
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const { token } = useAuth();

    const handleUploadImage = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('description', 'imagen de actividad');
        formData.append('id', _id);

        try {
            const response = await clientAxios.post('/image-activity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setLoading(false);

            if (response.status === 200) {
                toast.success('Imagen subida correctamente');
                refresh(); // ✅ refresca los datos sin recargar la página
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error('Error subiendo la imagen');
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Una vez eliminado, no podrás recuperar la actividad",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await clientAxios.delete(`/academy-activities/${_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                toast.success('Actividad eliminada');
                refresh(); // ✅ refresca los datos sin recargar
            } catch (error) {
                toast.error('No se pudo eliminar la actividad');
                console.error('Error:', error);
            }
        }
    };

    return (
        <>
            <div className="relative m-4 bg-white p-4 shadow-lg">
                <div className='flex justify-between items-center w-full border-b-2 border-indigo-700 mb-2'>
                    <div className='flex-col'>
                        <h3 className="mt-2 pb-2 text-2xl font-semibold">
                            {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                            {activity.description}
                        </p>
                    </div>
                    <div className='flex gap-4'>
                        <button type='button' onClick={handleDelete}>
                            <MdDelete className='w-6 h-6 text-red-500' />
                        </button>
                        <button type='button' onClick={() => setOpenEdit(!openEdit)}>
                            <FaEdit className='w-6 h-6 text-blue-500' />
                        </button>
                    </div>
                </div>

                <div className="relative flex flex-col space-y-2">
                    <div className="relative z-0 px-4 py-2 rounded text-white flex justify-center space-x-2 md:w-4/12 bg-Teal">
                        <IoIosAddCircle className="text-2xl" />
                        <span>Subir Imagen</span>
                    </div>
                    <input
                        onChange={handleUploadImage}
                        type="file"
                        name="image"
                        accept=".jpg, .jpeg, .png, .gif, .bmp , .svg .tif, .tiff|image/*"
                        className="absolute z-10 opacity-0 cursor-pointer w-full h-full top-0 left-0"
                    />
                </div>

                <AllImages loading={loading} id={_id} />
            </div>

            <EditAcademyActivityModal
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
                id={_id}
                refresh={refresh} // Para refrescar si se editan datos
            />
        </>
    );
};

export default AcademyActivityCard;
