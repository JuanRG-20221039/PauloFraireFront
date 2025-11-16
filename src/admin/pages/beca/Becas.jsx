//Becas.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const Becas = () => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchBecas = async () => {
      try {
        const response = await clientAxios.get("/getbecas", config);
        setBecas(response.data);
      } catch (error) {
        console.error("Error al obtener becas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBecas();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Seguro que quieres eliminar?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await clientAxios.delete(`/deletebeca/${id}`, config);
        setBecas(becas.filter((beca) => beca._id !== id));
        Swal.fire("Eliminado", "Beca eliminada correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la beca", "error");
      }
    }
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">Administrar Becas</h1>
      <br></br>
      <Link to="/admin/add-beca" className="btn-action">Agregar Beca</Link>
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">No.</th>
            <th className="border px-4 py-2">Título</th>
            <th className="border px-4 py-2">Descripción</th>
            <th className="border px-4 py-2">Imagen</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="text-center py-4">Cargando...</td></tr>
          ) : becas.length === 0 ? (
            <tr><td colSpan="5" className="text-center py-4">No hay becas</td></tr>
          ) : (
            becas.map((beca, index) => (
              <tr key={beca._id}>
                <td className="border px-4 py-2 text-center text-slate-600">{index + 1}</td>
                <td className="border px-4 py-2 text-slate-600">{beca.title}</td>
                <td className="border px-4 py-2 text-slate-600">{beca.description}</td>
                <td className="border px-4 py-2">
                  <img src={beca.imageUrl} alt={beca.title} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <Link to={`/admin/edit-beca/${beca._id}`} className="btn-action bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Editar</Link>
                  <button onClick={() => handleDelete(beca._id)} className="btn-action bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
};

export default Becas;
