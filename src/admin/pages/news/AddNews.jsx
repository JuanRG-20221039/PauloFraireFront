import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../components/Spinner';
import clientAxios from '../../../config/clientAxios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link'],
        ['clean'],
    ],
};
const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
];

const AddNews = () => {
    const naviagte = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blog, setBlog] = useState({
        title: '',
        description: '',
        date: '',
    });

    const [img, setImg] = useState(null);
    const { token } = useAuth();

    const updateState = (e) => {
        setBlog({
            ...blog,
            [e.target.name]: e.target.value
        })
    }

    const validateImageAspectRatio = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                if (Math.abs(aspectRatio - 1.5) < 0.01) {
                    resolve(true);
                } else {
                    reject(false);
                }
            };
            img.onerror = () => reject(false);
        });
    };

    const addBlog = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (blog.title.trim() === '' || blog.description.trim() === '' || blog.date.trim() === '' || !img) {
            setLoading(false);
            toast.error('Todos los campos son obligatorios');
            return;
        }

        try {
            // Validar formato de imagen 3:2
            await validateImageAspectRatio(img);
        } catch {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Formato de imagen incorrecto',
                text: 'La imagen debe tener un formato 3:2',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', blog.title);
            formData.append('description', blog.description);
            formData.append('date', blog.date);
            formData.append('img', img);

            const response = await clientAxios.post('/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            setLoading(false);

            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Noticia agregada',
                    timer: 2000,
                    showConfirmButton: false
                });
                naviagte('/admin/news');
            }

        } catch (error) {
            console.log(error);
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar la noticia',
            });
        }
    }

    return (
        <section className="container mx-auto">
            <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">Agrega una Noticia</h1>

            <div className='p-3 max-w-5xl mx-auto min-h-screen '>
                <form className='flex flex-col gap-4' onSubmit={addBlog}>
                    <div className='flex flex-col gap-4 justify-between'>
                        <div className='w-full'>
                            <label htmlFor="title" className="font-semibold text-slate-700 pb-2">
                                Titulo:
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className='input-auth'
                                placeholder="Ej. Noticia de la semana"
                                defaultValue={blog.title}
                                onChange={updateState}
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="date" className="font-semibold text-slate-700 pb-2">
                                Fecha:
                            </label>
                            <input
                                type="text"
                                name="date"
                                id="date"
                                className='input-auth'
                                placeholder="Ej. 23 de Enero del 2023"
                                defaultValue={blog.date}
                                onChange={updateState}
                            />
                        </div>
                        <div className='w-full'>
                            <label htmlFor="img" className="font-semibold text-slate-700 pb-2">
                                Imagen:
                            </label>
                            <input
                                type="file"
                                name="img"
                                id="img"
                                accept="image/*"
                                className='input-auth'
                                onChange={(e) => setImg(e.target.files[0])}
                            />

                            {/* Rectángulo guía con proporción 3:2 */}
                            <div className="mt-3 w-60 h-40 bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400 rounded">
                                <span className="text-gray-600 text-lg font-bold">3:2 🖼️</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="font-semibold text-slate-700 pb-2">
                                Descripción:
                            </label>
                            <ReactQuill
                                placeholder='Write something...'
                                className='h-72 mb-12'
                                formats={formats}
                                modules={modules}
                                value={blog.description}
                                onChange={(e) => setBlog({ ...blog, description: e })}
                            />
                        </div>

                        {
                            loading ? <Spinner /> : (
                                <button
                                    type="submit"
                                    className="btn-action"
                                >
                                    Agregar Noticia
                                </button>
                            )
                        }
                    </div>
                </form>
            </div>
        </section>
    )
}

export default AddNews;
