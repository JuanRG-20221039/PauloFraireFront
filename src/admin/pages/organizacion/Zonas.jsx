import { useEffect, useState } from "react";
import clientAxios from "../../../config/clientAxios";
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import Swal from "sweetalert2";

const Zonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    lugar: "",
    encargado: "",
    telefono: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const { data } = await clientAxios.get("/zonas");
        setZonas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar las zonas");
      } finally {
        setLoading(false);
      }
    };
    fetchZonas();
  }, []);

  const openCreate = () => {
    setFormData({ lugar: "", encargado: "", telefono: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (zona) => {
    setFormData({
      lugar: zona.lugar || "",
      encargado: zona.encargado || "",
      telefono: zona.telefono || "",
    });
    setEditingId(zona._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { data } = await clientAxios.put(`/zonas/${editingId}`, formData);
        setZonas((prev) => prev.map((z) => (z._id === editingId ? data : z)));
        Swal.fire("Actualizado", "La zona fue actualizada", "success");
      } else {
        const { data } = await clientAxios.post("/zonas", formData);
        setZonas((prev) => [data, ...prev]);
        Swal.fire("Agregado", "La zona fue agregada", "success");
      }
      closeForm();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.msg || "No se pudo guardar la zona",
        "error"
      );
    }
  };
  const handleTelefonoChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 10) {
      setFormData({ ...formData, telefono: value });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Eliminar zona?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete(`/zonas/${id}`);
          setZonas((prev) => prev.filter((z) => z._id !== id));
          Swal.fire("Eliminada", "La zona fue eliminada", "success");
        } catch (err) {
          console.error(err);
          Swal.fire(
            "Error",
            err.response?.data?.msg || "No se pudo eliminar la zona",
            "error"
          );
        }
      }
    });
  };

  return (
    <section className="container mx-auto bg-slate-50 p-4">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Administrar Zonas
      </h1>
      <p className="text-center my-4 mx-2">
        Gestiona los círculos de estudio y contactos
      </p>

      <div className="flex my-2 mx-10">
        <div className="p-2">
          <button
            onClick={openCreate}
            className="btn-action p-2 inline-flex items-center gap-2"
          >
            <IoIosAddCircle className="text-2xl" />
            Agregar zona
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mx-10 my-4 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Editar zona" : "Nueva zona"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Lugar
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-md p-2"
                value={formData.lugar}
                onChange={(e) =>
                  setFormData({ ...formData, lugar: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Encargado
              </label>
              <input
                type="text"
                className="mt-1 w-full border rounded-md p-2"
                value={formData.encargado}
                onChange={(e) =>
                  setFormData({ ...formData, encargado: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Teléfono
              </label>

              <input
                type="tel"
                className="mt-1 w-full border rounded-md p-2"
                value={formData.telefono}
                onChange={handleTelefonoChange} // ← Usa la función especial
                maxLength={10}
                pattern="[0-9]{10}"
                required
              />
            </div>
            <div className="md:col-span-3 flex gap-3 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                {editingId ? "Guardar cambios" : "Agregar"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-fixed border w-full my-2 text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-gray-600 w-16">No.</th>
              <th className="px-4 py-2 border text-gray-600 w-1/3">Lugar</th>
              <th className="px-4 py-2 border text-gray-600 w-1/3">Encargado</th>
              <th className="px-4 py-2 border text-gray-600 w-40">Teléfono</th>
              <th className="px-4 py-2 border text-gray-600 w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-red-600">
                  {error}
                </td>
              </tr>
            ) : zonas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay zonas registradas
                </td>
              </tr>
            ) : (
              zonas.map((zona, index) => (
                <tr key={zona._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border whitespace-normal break-words">{zona.lugar}</td>
                  <td className="px-4 py-2 border whitespace-normal break-words">{zona.encargado}</td>
                  <td className="px-4 py-2 border whitespace-normal break-words">{zona.telefono}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => openEdit(zona)} title="Editar">
                        <TiEdit className="text-3xl text-blue-600 hover:text-blue-800 cursor-pointer transition-colors" />
                      </button>
                      <button
                        onClick={() => handleDelete(zona._id)}
                        title="Eliminar"
                      >
                        <RiDeleteBin6Line className="text-3xl text-red-600 hover:text-red-800 cursor-pointer transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Zonas;
