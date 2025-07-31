import { useEffect, useState } from "react";
import clientAxios from "../../../config/clientAxios";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

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
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const { token } = useAuth();

  // Carga las historias existentes
  const fetchHistorias = async () => {
    try {
      const { data } = await clientAxios.get("/stories");
      setHistorias(data);
      console.log(
        "Historias cargadas:",
        data.map((h) => ({ id: h._id, images: h.images }))
      );
    } catch (error) {
      console.error("Error al cargar historias:", error);
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

      // Calcular el número de imágenes activas actuales (excluyendo las marcadas para eliminar)
      const activePreviewImages = previewImages.filter(
        (img) => !imagesToDelete.includes(img)
      ).length;
      const newImageCount = fileList.length;

      // Validar cantidad de imágenes (máximo 10)
      if (activePreviewImages + newImageCount > 10) {
        Swal.fire({
          title: "Error",
          text: "No puedes subir más de 10 imágenes en total.",
          icon: "error",
        });
        return;
      }

      // Validar tamaño de cada imagen (máximo 20MB) y tamaño total (máximo 200MB)
      const maxSizePerFile = 20 * 1024 * 1024; // 20MB en bytes
      const maxTotalSize = 200 * 1024 * 1024; // 200MB en bytes
      const totalSize =
        fileList.reduce((sum, file) => sum + file.size, 0) +
        form.images.reduce((sum, file) => sum + file.size, 0);
      const oversizedFiles = fileList.filter(
        (file) => file.size > maxSizePerFile
      );

      if (oversizedFiles.length > 0) {
        Swal.fire({
          title: "Error",
          text: `Las siguientes imágenes exceden el límite de 20MB: ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`,
          icon: "error",
        });
        return;
      }

      if (totalSize > maxTotalSize) {
        Swal.fire({
          title: "Error",
          text: "El tamaño total de las imágenes no debe exceder 200MB.",
          icon: "error",
        });
        return;
      }

      // Agregar nuevas imágenes al estado
      setForm((prev) => ({ ...prev, images: [...prev.images, ...fileList] }));
      const previews = fileList.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...previews]);
    } else if (name === "paragraphs") {
      const newParagraphs = [...form.paragraphs];
      newParagraphs[index] = value;
      setForm((prev) => ({ ...prev, paragraphs: newParagraphs }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Remover una imagen
  const removeImage = (index) => {
    console.log(
      "Removing image at index:",
      index,
      "PreviewImages:",
      previewImages,
      "FormImages:",
      form.images
    );

    const img = previewImages[index];
    if (typeof img === "string" && img.startsWith("http")) {
      // Imagen existente (URL de Cloudinary)
      setImagesToDelete((prev) => [...prev, img]);
    } else {
      // Imagen nueva (local)
      URL.revokeObjectURL(img); // Liberar memoria
      const newImages = form.images.filter((_, i) => i !== index); // Eliminar la imagen correspondiente
      setForm((prev) => ({
        ...prev,
        images: newImages,
      }));
      console.log("After removal - FormImages:", newImages);
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
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
    previewImages.forEach((img) => {
      if (typeof img !== "string") {
        URL.revokeObjectURL(img); // Liberar URLs de vistas previas
      }
    });
    setForm({ title: "", author: "", paragraphs: [""], images: [] });
    setEditingId(null);
    setPreviewImages([]);
    setImagesToDelete([]);
    setIsUploading(false);
    setUploadProgress(null);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (
      !form.title.trim() ||
      !form.author.trim() ||
      form.paragraphs.some((p) => !p.trim())
    ) {
      Swal.fire("Campos incompletos", "Completa todos los campos", "warning");
      return;
    }

    // Validar que haya al menos una imagen activa tanto al crear como al editar
    const activeImages = previewImages.filter(
      (img) => !imagesToDelete.includes(img)
    );
    if (activeImages.length === 0) {
      Swal.fire("Error", "Debes incluir al menos una imagen", "error");
      return;
    }

    if (!token) {
      Swal.fire(
        "Error",
        "Debes iniciar sesión para realizar esta acción",
        "error"
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("paragraphs", JSON.stringify(form.paragraphs));

      // Adjuntar imágenes nuevas
      if (form.images.length > 0) {
        form.images.forEach((file) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });
      }

      // Adjuntar imágenes a eliminar (URLs de Cloudinary)
      if (imagesToDelete.length > 0) {
        console.log("Imágenes a eliminar:", imagesToDelete);
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      // Configuración de la petición
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        timeout: 180000, // 180 segundos
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      };

      // Enviar la petición
      if (editingId && editingId !== "new") {
        const response = await clientAxios.put(
          `/stories/${editingId}`,
          formData,
          config
        );
        Swal.fire("Actualizado", "Historia actualizada", "success");
        console.log("Respuesta del servidor (PUT):", response.data);
      } else {
        const response = await clientAxios.post("/stories", formData, config);
        Swal.fire("Creado", "Historia creada", "success");
        console.log("Respuesta del servidor (POST):", response.data);
      }

      await fetchHistorias();
      resetForm();
    } catch (error) {
      console.error("Error al guardar historia:", error);
      if (error.code === "ECONNABORTED") {
        Swal.fire(
          "Tiempo de espera agotado",
          "La subida está tomando más tiempo del esperado. Por favor, verifica si la historia se creó correctamente recargando la página.",
          "warning"
        );
      } else if (error.response?.status === 401) {
        Swal.fire(
          "Error de autenticación",
          error.response.data.msg ||
            "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
          "error"
        );
      } else if (error.response?.status === 403) {
        Swal.fire(
          "Acceso denegado",
          "No tienes permisos para realizar esta acción.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.msg || "No se pudo guardar la historia",
          "error"
        );
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Eliminar historia
  const handleDelete = async (id) => {
    if (!token) {
      Swal.fire(
        "Error",
        "Debes iniciar sesión para realizar esta acción",
        "error"
      );
      return;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await clientAxios.delete(`/stories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Eliminado", "La historia fue eliminada", "success");
        await fetchHistorias();
        if (editingId === id) resetForm();
      } catch (error) {
        console.error("Error al eliminar historia:", error);
        if (error.response?.status === 401) {
          Swal.fire(
            "Error de autenticación",
            error.response.data.msg ||
              "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
            "error"
          );
        } else if (error.response?.status === 403) {
          Swal.fire(
            "Acceso denegado",
            "No tienes permisos para realizar esta acción.",
            "error"
          );
        } else {
          Swal.fire(
            "Error",
            error.response?.data?.msg || "No se pudo eliminar la historia",
            "error"
          );
        }
      }
    }
  };

  // Editar historia
  const handleEdit = (historia) => {
    setEditingId(historia._id);
    setForm({
      title: historia.title || "",
      author: historia.author || "",
      paragraphs: historia.paragraphs?.length ? historia.paragraphs : [""],
      images: [],
    });
    setPreviewImages(historia.images || []);
    setImagesToDelete([]);
  };

  // Manejar clic en el ícono de agregar imágenes
  const handleAddImagesClick = () => {
    document.getElementById("imageInput").click();
  };

  const historiasToShow =
    showAll || historias.length <= 2 ? historias : [historias[0]];

  return (
    <div className="p-6">
      {historias.length > 0 && editingId === null && (
        <div className="flex my-2 ml-0">
          <div className="p-2">
            <button
              onClick={() => setEditingId("new")}
              className="btn-action p-2 text-white bg-blue-600 rounded"
            >
              <IoIosAddCircle className="text-2xl mr-2" />
              Agregar Historias
            </button>
          </div>
        </div>
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
              className="mt-4 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800"
            >
              {showAll ? "Ver menos" : `Ver más (${historias.length - 1} más)`}
            </button>
          )}
        </>
      )}

      {historias.length === 0 && editingId === null && (
        <div className="flex my-2 ml-0">
          <div className="p-2">
            <button
              onClick={() => setEditingId("new")}
              className="btn-action p-2 text-white bg-blue-600 rounded hover:bg-green-700 flex items-center"
            >
              <IoIosAddCircle className="text-2xl mr-2" />
              Agregar Historia
            </button>
          </div>
        </div>
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
            <label className="block mb-1 font-medium">Imágenes</label>
            <div className="flex items-center gap-2">
              {previewImages.length > 0 && (
                <button
                  type="button"
                  onClick={handleAddImagesClick}
                  className="text-green-800 hover:text-green-900"
                  title="Agregar más imágenes"
                  disabled={isUploading}
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              )}
              <input
                type="file"
                id="imageInput"
                name="images"
                accept="image/*"
                multiple
                onChange={handleInputChange}
                disabled={isUploading}
                className="w-full"
              />
            </div>

            {(editingId === "new" || editingId) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${i}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                      title="Quitar imagen"
                    >
                      <AiOutlineClose className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isUploading}
              className={`px-4 py-2 rounded text-white ${
                isUploading ? "bg-green-800" : "bg-green-900 hover:bg-green-800"
              } ${isUploading ? "cursor-wait" : ""}`}
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
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
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
