//EditScholarshipInfo.jsx
import { useState, useEffect } from "react";
import clientAxios from "../../../../config/clientAxios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";

const EditScholarshipInfo = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchScholarshipInfo = async () => {
      try {
        const { data } = await clientAxios.get("/becas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitulo(data.titulo);
        setDescripcion(data.descripcion);
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la información de becas", "error");
      }
    };
    fetchScholarshipInfo();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descripcion) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }
    setIsLoading(true);
    try {
      await clientAxios.put("/becas", { titulo, descripcion }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Éxito", "Información de becas actualizada", "success");
      navigate("/admin/becas");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la información", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-700 mb-4 text-center">
        Editar Información de Becas
      </h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="w-full">
          <div>
            <label className="block text-gray-700 font-semibold">Título:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Actualizar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditScholarshipInfo;
