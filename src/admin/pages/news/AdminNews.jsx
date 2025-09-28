import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io"
import { Link } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import Swal from 'sweetalert2';
import useAuth from "../../../hooks/useAuth";

const AdminNews = () => {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const response = await clientAxios.get('/blog', config);
                setBlogs(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        getBlogs();
    }, []);

    const handleDelete = (id) => {

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        Swal.fire({
            title: '¿Estas seguro?',
            text: "Una vez eliminado, no podras recuperar la noticia",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await clientAxios.delete(`/blog/${id}`, config);
                    const newBlogs = blogs.filter(blog => blog._id !== id);
                    setBlogs(newBlogs);
                    Swal.fire(
                        'Eliminado!',
                        'La noticia ha sido eliminada',
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar la noticia'
                    })
                }
            }
        })
    }

    return (
        <section className="container mx-auto bg-slate-50">
            <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">Administra Las Noticias</h1>

            {/* Link agregar nueva imagen */}


            <p className="text-center  my-4 mx-2">
                Aqui podras administrar las noticias de la pagina web
            </p>

            <div className="flex my-2 mx-10">
                <div className="p-2">
                    <Link to='/admin/add-news' className="btn-action p-2">
                        <IoIosAddCircle className="text-2xl" />
                        Agregar Noticias
                    </Link>
                </div>
            </div>

            <div className="">
                <div className="col-span-1 overflow-auto bg-slate-50 shadow-lg p-4">
                    <table className="table-auto border w-full my-2">
                        <thead>
                            <tr>
                                <th className="px-2 py-2 border text-gray-600">No.</th>
                                <th className="px-2 py-2 border text-gray-600">Titulo</th>
                                <th scope="col" className="px-2 py-2 border text-gray-600">Fecha</th>
                                <th scope="col" className="px-2 py-2 border text-gray-600">Estado</th>
                                <th className="px-2 py-2 border text-gray-600">Imagen</th>
                                <th className="px-2 py-2 border text-gray-600">Acciones</th>
                                <th scope="col" className="px-2 py-2 border text-gray-600">Ver</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-sm text-gray-600 mt-2">No hay noticias</td>
                                    </tr>
                                ) : (
                                    blogs.slice().reverse().map((blog, index) => (
                                        <tr key={index}>
                                            <td className="px-2 py-2 border text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-2 py-2 border text-center">
                                                {blog.title}
                                            </td>
                                            <td className="px-2 py-2 border text-center">
                                                {blog.date}
                                            </td>
                                            <td className="px-2 py-2 border text-center">
                                                {blog.isPublished ? (
                                                    <span className="font-bold text-xs uppercase bg-green-50 text-green-500 border-green-500 p-1 border-2 rounded-lg inline-block py-1 px-5">Publicado</span>
                                                ) : (
                                                    <span className="font-bold text-xs uppercase bg-red-50 text-red-500 border-red-500 p-1 border-2 rounded-lg inline-block py-1 px-5">No Publicado</span>
                                                )}
                                            </td>
                                            <td className="px-2 py-2 border flex items-center justify-center">
                                                <img src={blog.img} alt={blog.title} className="w-16 h-16 object-cover" />
                                            </td>
                                            <td className="px-2 py-2 border">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link to={`/admin/edit-news/${blog._id}`} className="">
                                                        <TiEdit className="text-2xl text-blue-600" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(blog._id)}
                                                        className="hover:scale-105 transition-all ease-in-out duration-300"
                                                    >
                                                        <RiDeleteBin6Line className="text-2xl text-red-600" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 border text-center">
                                                <Link to={`/new-item/${blog._id}`} className="btn-action p-2">
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    )))

                            }
                        </tbody>
                    </table>
                    <div className="text-sm text-gray-600 mt-2">

                    </div>
                </div>
            </div>

        </section>
    )
}

export default AdminNews