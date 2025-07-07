import React, { useEffect, useState } from 'react'
import clientAxios from '../../../config/clientAxios';
import toast from 'react-hot-toast';
import { FaSave } from 'react-icons/fa';
import Spinner from '../../../components/Spinner';
import { IoMdCloseCircle } from 'react-icons/io';
import useAuth from '../../../hooks/useAuth';


const EditAcademyActivityModal = ({ openEdit, setOpenEdit, id }) => {

    const [academyActivity, setAcademyActivity] = useState({
        title: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const { token } = useAuth()

    const handleChangeState = (e) => {
        setAcademyActivity({ ...academyActivity, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        const getAcademyActivityById = async () => {
            try {
                const response = await clientAxios.get(`/academy-activities/${id}`);
                setAcademyActivity(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        if (openEdit) {
            getAcademyActivityById();
        }
    }, [openEdit])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if (academyActivity.title.trim() === '' || academyActivity.description.trim() === '') {
            toast.error('No puede haber campos vacios');
            setLoading(false);
            return;
        }

        try {
            const response = await clientAxios.put(`/academy-activities/${id}`, academyActivity, config);
            setLoading(false);
            if (response.status === 200) {
                toast.success('Actualizado Correctamente');
                setTimeout(() => {
                    setOpenEdit(!openEdit);
                }, 2000);
            }
        } catch (error) {
            setLoading(false);
            toast.error('Hubo un error');
            console.log(error);
        }
    }


    return (
        <div className={`${openEdit ? '' : 'hidden'} fixed top-0 left-0 z-30 w-full h-full bg-black  bg-opacity-85`}>
            <div className={`${openEdit ? '' : 'hidden'} fixed inset-0 m-4  flex items-center z-30 justify-center `}>
                <div className='relative bg-white w-12/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4  overflow-y-auto px-4 py-4 md:px-8 '>
                    <div className='flex items-center justify-between w-full pt-4' action="">
                        <h3 className='font-bold text-center text-gray-600 text-2xl mx-auto'>Actualizar una Actividad Academica</h3>
                        <div
                            onClick={() => setOpenEdit(!openEdit)}
                            className='cursor-pointer text-gray-100 py-2 px-2 rounded-full'
                        >
                            <IoMdCloseCircle className='w-8 h-8 text-red-500 cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out' />
                        </div>
                    </div>
                    <form className='w-full bg-white' onSubmit={handleSubmit}>
                        <div className='flex flex-col space-y-4'>
                            <div >
                                <label htmlFor="title" className="font-bold text-slate-700 mb-2">
                                    Titulo:
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className='input-auth flex-shrink'
                                    placeholder="EJ. Diplomado en Herramientas"
                                    value={academyActivity.title}
                                    onChange={handleChangeState}
                                />
                            </div>
                            <div >
                                <label htmlFor="description" className="font-bold text-slate-700 mb-2">
                                    Descripción:
                                </label>
                                <textarea
                                    type="text"
                                    name="description"
                                    id="description"
                                    className='input-auth'
                                    placeholder="Ej. Imagenes de la actividad"
                                    value={academyActivity.description}
                                    onChange={handleChangeState}
                                />
                            </div>
                        </div>


                        {
                            !loading ?
                                <button className="btn-action">
                                    <FaSave className="w-6 h-6" />
                                    <span>Actualizar</span>
                                </button> :
                                <Spinner />
                        }
                    </form>
                </div>

            </div>
        </div>
    )
}

export default EditAcademyActivityModal