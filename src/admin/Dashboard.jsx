import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import clientAxios from "../config/clientAxios";

const Dashboard = () => {


    const [data, setData] = useState([])

    useEffect(() => {
        const getHero = async () => {
            try {
                const response = await clientAxios.get('/customsize')
                setData(response.data)

            } catch (error) {
                console.log(error)
            }
        }

        getHero()
    }, [])

    return (
        <>
            <section className="container mx-auto bg-slate-50">
                <h1 className="text-4xl font-bold text-center mt-10">Dashboard</h1>

                {/* Link agregar nueva imagen */}


                <p className="text-center  my-10 mx-2">
                    Administra la sección de noticias, la biblioteca, la oferta educativa, las actividades de la academia, las convocatorias y la organización.
                </p>

                <div className="flex my-5 mx-10">
                    <div className="p-2">
                        <Link className="btn-action p-2">
                            <IoIosAddCircle className="text-2xl" />
                            Agregar Imagen
                        </Link>.
                    </div>
                </div>

                {/* formulario de  */}

                <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
                    <table className="table-auto border w-full my-2">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border">Imagen</th>
                                <th className="px-4 py-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>

                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-2 flex justify-center">
                                        <img
                                            className="w-44 h-44 object-cover object-center"
                                            src={item.slideImg}
                                            alt="pic"
                                        />
                                    </td>
                                    <td className="px-4 py-2 ">
                                        <div className="flex flex-col justify-center items-center">
                                            <Link to={`/admin/edit/${item.id}`} className="flex p-2 underline">
                                                <FaEdit className="text-2xl text-blue-600" />
                                                Editar
                                            </Link>
                                            <button className="flex p-2 underline">
                                                <MdDelete className="text-2xl text-red-600" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-sm text-gray-600 mt-2">

                    </div>
                </div>

            </section>
        </>
    )
}

export default Dashboard