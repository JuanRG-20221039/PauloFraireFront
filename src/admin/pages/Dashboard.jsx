import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { IoIosAddCircle } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import AllImagesCustomsize from "../components/AllImagesCustomsize";
import clientAxios from "../../config/clientAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Dashboard = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const { token } = useAuth();

    const handleImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = async () => {
            const width = img.width;
            const height = img.height;
            URL.revokeObjectURL(objectUrl);

            // Validar relación 3:2
            const ratio = width / height;
            const targetRatio = 3 / 2;

            if (Math.abs(ratio - targetRatio) > 0.01) {
                Swal.fire({
                    title: "Formato incorrecto",
                    html: `
                        <div style="display:flex;flex-direction:column;align-items:center;">
                            <div style="width:150px;height:100px;border:2px dashed #ccc;display:flex;align-items:center;justify-content:center;font-size:24px;">
                                📷 3:2
                            </div>
                            <br />
                            <p>Solo se permiten imágenes con relación <b>3:2</b>.</p>
                        </div>
                    `,
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
                return; // Detener carga
            }

            setLoading(true);
            const formData = new FormData();
            formData.append('img', file);

            try {
                const response = await clientAxios.post('/customsize', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                toast.success('Imagen subida correctamente');
                setRefreshKey(prev => prev + 1);
            } catch (error) {
                console.log(error);
                toast.error('Error al subir la imagen');
            } finally {
                setLoading(false);
            }
        };

        img.src = objectUrl;
    }

    return (
        <>
            <section className="container mx-auto bg-slate-50">
                <h1 className="text-4xl font-bold text-center mt-10">Dashboard</h1>

                <p className="text-center my-10 mx-2">
                    Administra la sección de noticias, la biblioteca, la oferta educativa, las actividades de la academia, las convocatorias y la organización.
                </p>

                <div className="relative m-4 bg-white p-4 shadow-lg">
                    <h3 className="border-b-2 border-green-700 mb-4 pb-2 text-2xl font-semibold">
                        Customsize
                    </h3>

                    <div className="relative flex flex-col space-y-2">
                        <div className="relative z-0 px-4 py-2 rounded text-white flex justify-center space-x-2 md:w-4/12 bg-Teal">
                            <IoIosAddCircle className="text-2xl" />
                            <span>Subir Imagen</span>
                        </div>
                        <input
                            onChange={handleImage}
                            type="file"
                            name="image"
                            accept=".jpg, .jpeg, .png, .gif, .bmp , .svg .tif, .tiff|image/*"
                            className="absolute z-10 opacity-0 cursor-pointer w-full h-full top-0 left-0"
                        />
                    </div>

                    <AllImagesCustomsize loading={loading} key={refreshKey} />
                </div>
            </section>
        </>
    )
}

export default Dashboard
