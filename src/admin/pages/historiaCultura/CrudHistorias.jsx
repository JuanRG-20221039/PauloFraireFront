import { useEffect, useState } from "react";
import axios from "axios";
import clientAxios from "../../../config/clientAxios"; // tu axios configurado
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const CrudHistorias = () => {
  const [historias, setHistorias] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    paragraphs: [""],
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Carga las historias existentes
  const fetchHistorias = async () => {
    try {
      const { data } = await clientAxios.get("/stories");
      setHistorias(data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar las historias", "error");
    }
  };

  useEffect(() => {
    fetchHistorias();
  }, []);

  // Cambios en inputs
  const handleInputChange = (e, index = null) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const fileList = Array.from(files);
      setForm((prev) => ({ ...prev, images: fileList }));
      const previews = fileList.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    } else if (name === "paragraphs") {
      const newParagraphs = [...form.paragraphs];
      newParagraphs[index] = value;
      setForm((prev) => ({ ...prev, paragraphs: newParagraphs }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Agregar párrafo
  const handleAddParagraph = () => {
    setForm((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  };

  // Remover párrafo
  const handleRemoveParagraph = (index) => {
    const newParagraphs = form.paragraphs.filter((_, i) => i !== index);
    setForm((prev) => ({
      ...prev,
      paragraphs: newParagraphs.length ? newParagraphs : [""],
    }));
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({ title: "", author: "", paragraphs: [""], images: [] });
    setEditingId(null);
    setPreviewImages([]);
    setIsUploading(false);
  };

  // Subir imagen a Cloudinary (o tu servidor)
  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "preset_paulo"); // Cambia por tu preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/tu_usuario/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 20000,
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      Swal.fire("Error", "No se pudo subir la imagen. Intenta otra.", "error");
      throw error;
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      form.paragraphs.some((p) => !p.trim())
    ) {
      Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }

    setIsUploading(true);

    try {
      let uploadedImageUrls = [];

      // Subir todas las imágenes (si las hay)
      if (form.images.length > 0 && form.images[0] instanceof File) {
        const uploadPromises = form.images.map((file) => uploadImage(file));
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // Crear FormData para enviar al backend
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("paragraphs", JSON.stringify(form.paragraphs));

      // Agregar urls de imágenes subidas
      uploadedImageUrls.forEach((url) => formData.append("images", url));

      if (editingId && editingId !== "new") {
        await clientAxios.put(`/stories/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Actualizado", "Historia actualizada", "success");
      } else {
        await clientAxios.post("/stories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Creado", "Historia creada", "success");
      }

      fetchHistorias();
      resetForm();
    } catch (error) {
      console.error("Error al guardar historia:", error);
      Swal.fire("Error", "No se pudo guardar la historia", "error");
      setIsUploading(false); // <— importantísimo para desbloquear el botón
    }
  };

  // Editar historia
  const handleEdit = (historia) => {
    setEditingId(historia._id);
    setForm({
      title: historia.title,
      author: historia.author,
      paragraphs: historia.paragraphs || [""],
      images: [], // vaciar para subir nuevas imágenes
    });
    setPreviewImages(historia.images || []);
  };

  // Eliminar historia
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await clientAxios.delete(`/stories/${id}`);
        Swal.fire("Eliminado", "La historia fue eliminada", "success");
        fetchHistorias();
        if (editingId === id) resetForm();
      } catch {
        Swal.fire("Error", "No se pudo eliminar la historia", "error");
      }
    }
  };

  const historiasToShow =
    showAll || historias.length <= 2 ? historias : [historias[0]];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Historias</h2>

      {historias.length > 0 && editingId === null && (
        <button
          onClick={() => setEditingId("new")}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Agregar Historia
        </button>
      )}

      {historias.length > 0 && (
        <>
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Título</th>
                <th className="px-4 py-2 border">Autor</th>
                <th className="px-4 py-2 border">Contenido</th>
                <th className="px-4 py-2 border">Imágenes</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historiasToShow.map((h) => (
                <tr key={h._id}>
                  <td className="border px-2 py-1 whitespace-pre-wrap">
                    {h.title}
                  </td>
                  <td className="border px-2 py-1 whitespace-pre-wrap">
                    {h.author}
                  </td>
                  <td
                    className="border px-2 py-1 whitespace-pre-wrap max-w-xs break-words"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {h.paragraphs?.join("\n\n")}
                  </td>
                  <td className="border px-2 py-1 whitespace-pre-wrap">
                    {h.images && h.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {h.images.map((imgUrl, i) => (
                          <img
                            key={i}
                            src={imgUrl}
                            alt={`Imagen ${i + 1}`}
                            className="w-32 h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleEdit(h)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Editar historia"
                    >
                      <FiEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar historia"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {historias.length > 2 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showAll ? "Ver menos" : `Ver más (${historias.length - 1} más)`}
            </button>
          )}
        </>
      )}

      {historias.length === 0 && editingId === null && (
        <button
          onClick={() => setEditingId("new")}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Agregar Historia
        </button>
      )}

      {editingId !== null && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6 border p-4 rounded shadow"
        >
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={form.title}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={form.author}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

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
              />
              <button
                type="button"
                onClick={() => handleRemoveParagraph(i)}
                className="text-red-600 hover:text-red-800 self-start mt-2"
                title="Eliminar párrafo"
              >
                <RiDeleteBin6Line size={24} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddParagraph}
            className="text-blue-600 text-sm mb-2"
          >
            + Agregar párrafo
          </button>

          <div>
            <label className="block mb-1 font-medium">
              Imágenes (puedes seleccionar varias)
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleInputChange}
              disabled={isUploading}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  alt={`Preview ${i}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 rounded text-white ${
                isUploading
                  ? "bg-yellow-500 cursor-wait"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isUploading
                ? "Subiendo..."
                : editingId === "new"
                ? "Crear Historia"
                : "Actualizar Historia"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              disabled={isUploading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CrudHistorias;
