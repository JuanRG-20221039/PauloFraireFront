// ...importaciones
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import clientAxios from "../../../config/clientAxios";
import useAuth from "../../../hooks/useAuth";
import CrudHistorias from "./CrudHistorias";

const HistoriaCultura = () => {
  const [intro, setIntro] = useState(null);
  const [form, setForm] = useState({
    mainTitle: "",
    mainAuthor: "",
    paragraphs: [""],
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchIntroduction();
  }, []);

  const fetchIntroduction = async () => {
    try {
      const { data } = await clientAxios.get("/introduction");
      setIntro(data);
      setForm({
        mainTitle: data.mainTitle,
        mainAuthor: data.mainAuthor,
        paragraphs: data.introduction?.paragraphs || [""],
      });
    } catch (error) {
      setIntro(null);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "paragraphs") {
      const newParagraphs = [...form.paragraphs];
      newParagraphs[index] = value;
      setForm({ ...form, paragraphs: newParagraphs });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddParagraph = () => {
    setForm({ ...form, paragraphs: [...form.paragraphs, ""] });
  };

  const handleCancel = () => {
    if (intro) {
      setForm({
        mainTitle: intro.mainTitle,
        mainAuthor: intro.mainAuthor,
        paragraphs: intro.introduction?.paragraphs || [""],
      });
    } else {
      setForm({ mainTitle: "", mainAuthor: "", paragraphs: [""] });
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación: todos los campos obligatorios
    if (
      !form.mainTitle.trim() ||
      !form.mainAuthor.trim() ||
      form.paragraphs.length === 0 ||
      form.paragraphs.some((p) => !p.trim())
    ) {
      Swal.fire(
        "Campos incompletos",
        "Por favor, completa todos los campos obligatorios.",
        "warning"
      );
      return;
    }
    try {
      if (intro) {
        await clientAxios.put("/introduction", form);
        Swal.fire(
          "Actualizado",
          "La introducción ha sido actualizada",
          "success"
        );
      } else {
        await clientAxios.post("/introduction", form);
        Swal.fire("Creado", "La introducción ha sido creada", "success");
      }
      fetchIntroduction();
      setIsEditing(false);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Error en la petición",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await clientAxios.delete("/introduction");
        Swal.fire("Eliminado", "La introducción ha sido eliminada", "success");
        setIntro(null);
        setForm({ mainTitle: "", mainAuthor: "", paragraphs: [""] });
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la introducción", "error");
      }
    }
  };
  const handleRemoveParagraph = (index) => {
    const newParagraphs = form.paragraphs.filter((_, i) => i !== index);
    setForm({
      ...form,
      paragraphs: newParagraphs.length ? newParagraphs : [""],
    });
  };
  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Historia y Cultura
      </h1>
      <p className="text-center my-4 mx-2">
        Aquí puedes gestionar información sobre historia y cultura
      </p>
      {intro ? (
        <div className="">
          <table className="w-full border border-gray-300 text-sm table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border w-1/6">Título Principal</th>
                <th className="px-4 py-2 border w-1/6">Autor</th>
                <th className="px-4 py-2 border w-3/6">Párrafos</th>
                <th className="px-4 py-2 border w-1/6">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border break-words whitespace-pre-wrap max-w-[1px]">
                  {intro.mainTitle}
                </td>
                <td className="px-4 py-2 border break-words whitespace-pre-wrap max-w-[1px]">
                  {intro.mainAuthor}
                </td>
                <td className="px-4 py-2 border break-words whitespace-pre-wrap max-w-[1px]">
                  <ul className="list-disc pl-4 space-y-1">
                    {intro.introduction?.paragraphs?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border break-words whitespace-pre-wrap max-w-[1px] text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setIsEditing(true)}
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={handleDelete}
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">No hay introducción registrada</p>
      )}

      {(isEditing || !intro) && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">
              Título Principal
            </label>
            <input
              required
              type="text"
              name="mainTitle"
              value={form.mainTitle}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Autor</label>
            <input
              required
              type="text"
              name="mainAuthor"
              value={form.mainAuthor}
              onChange={handleInputChange}
              className="mt-1 p-2 border w-full rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Párrafos</label>
            {form.paragraphs.map((p, i) => (
              <div key={i} className="flex items-start gap-2 mb-4">
                <textarea
                  name="paragraphs"
                  value={p}
                  onChange={(e) => handleInputChange(e, i)}
                  className="flex-grow p-2 border rounded resize-y"
                  rows={3}
                  required
                  aria-label={`Párrafo ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(i)}
                  className="text-red-600 hover:text-red-800 self-start mt-2"
                  aria-label={`Eliminar párrafo ${i + 1}`}
                  title="Eliminar párrafo"
                >
                  <RiDeleteBin6Line size={24} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddParagraph}
              className="text-blue-600 text-sm"
            >
              + Agregar párrafo
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              {intro ? "Actualizar" : "Crear"} Introducción
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar edición
            </button>
          </div>
        </form>
      )}
      <div className="mt-12">
        <CrudHistorias />
      </div>
    </div>
  );
};

export default HistoriaCultura;
