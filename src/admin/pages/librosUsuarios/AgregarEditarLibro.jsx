// admin/pages/AgregarEditarLibro.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clientAxios from "../../../config/clientAxios";

const AgregarEditarLibro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "0",
  });
  const [archivoFile, setArchivoFile] = useState(null);
  const [imagenFile, setImagenFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [previewImagen, setPreviewImagen] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchLibro();
    }
  }, [id]);

  const fetchLibro = async () => {
    try {
      const { data } = await clientAxios.get(`/pdfs-cc/${id}`);

      setFormData({
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: String(data.tipo),
      });

      if (data.imagen) {
        setPreviewImagen(data.imagen);
      }
      setLoadingData(false);
    } catch (error) {
      console.error("Error al cargar libro:", error);
      Swal.fire("Error", "No se pudieron cargar los datos del libro", "error");
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setArchivoFile(file);
    } else {
      Swal.fire("Error", "Por favor selecciona un archivo PDF válido", "error");
      e.target.value = "";
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagenFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      Swal.fire("Error", "Por favor selecciona una imagen válida", "error");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      Swal.fire(
        "Campos incompletos",
        "Completa todos los campos obligatorios",
        "warning"
      );
      return;
    }

    if (!isEdit && !archivoFile) {
      Swal.fire(
        "Archivo requerido",
        "Por favor selecciona un archivo PDF",
        "warning"
      );
      return;
    }

    // Verificar si hay token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Sesión requerida",
        text: "Debes iniciar sesión para realizar esta acción",
        icon: "warning",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    setLoading(true);

    try {
      // Determinar si hay archivos para subir
      const hasFiles = archivoFile || imagenFile;

      if (hasFiles || !isEdit) {
        // Usar FormData si hay archivos o es creación
        const formDataToSend = new FormData();
        formDataToSend.append("nombre", formData.nombre.trim());
        formDataToSend.append("descripcion", formData.descripcion.trim());
        formDataToSend.append("tipo", formData.tipo); // Como string "0" o "1"

        if (archivoFile) {
          formDataToSend.append("archivo", archivoFile);
        }

        if (imagenFile) {
          formDataToSend.append("imagen", imagenFile);
        }

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 180000,
        };

        if (isEdit) {
          await clientAxios.put(`/pdfs-cc/${id}`, formDataToSend, config);
          Swal.fire(
            "Actualizado",
            "Libro actualizado correctamente",
            "success"
          );
        } else {
          await clientAxios.post("/pdfs-cc", formDataToSend, config);
          Swal.fire("Creado", "Libro creado correctamente", "success");
        }
      } else {
        // Si es edición SIN archivos, usar JSON
        const jsonData = {
          nombre: formData.nombre.trim(),
          descripcion: formData.descripcion.trim(),
          tipo: parseInt(formData.tipo), // Como número
        };

        await clientAxios.put(`/pdfs-cc/${id}`, jsonData);
        Swal.fire("Actualizado", "Libro actualizado correctamente", "success");
      }

      navigate("/admin/libros");
    } catch (error) {
      console.error("Error al guardar:", error);

      if (error.response?.status === 401) {
        Swal.fire(
          "Error de autenticación",
          error.response.data.msg ||
            "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
          "error"
        ).then(() => {
          navigate("/login");
        });
      } else if (error.response?.status === 403) {
        Swal.fire(
          "Acceso denegado",
          "No tienes permisos para realizar esta acción.",
          "error"
        );
      } else if (error.code === "ECONNABORTED") {
        Swal.fire(
          "Tiempo de espera agotado",
          "La subida está tomando más tiempo del esperado. Verifica si el libro se creó correctamente.",
          "warning"
        );
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.message || "No se pudo guardar el libro",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/libros")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← Volver a Libros
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {isEdit ? "✏️ Editar Libro" : "➕ Agregar Nuevo Libro"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Nombre */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre del Libro *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Gramática Inglesa Básica"
              required
            />
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción detallada del libro..."
              required
            />
          </div>

          {/* Tipo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Tipo *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="0">Tipo 0</option>
              <option value="1">Tipo 1</option>
            </select>
          </div>

          {/* Archivo PDF */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Archivo PDF {!isEdit && "*"}
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleArchivoChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isEdit}
              disabled={loading}
            />
            {archivoFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Archivo seleccionado: {archivoFile.name}
              </p>
            )}
            {isEdit && !archivoFile && (
              <p className="text-sm text-gray-500 mt-2">
                Deja vacío si no deseas cambiar el archivo
              </p>
            )}
          </div>

          {/* Imagen */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Imagen (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            {imagenFile && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Imagen seleccionada: {imagenFile.name}
              </p>
            )}
            {previewImagen && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <img
                  src={previewImagen}
                  alt="Preview"
                  className="w-64 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-blue-400 cursor-wait"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Guardando..."
                : isEdit
                ? "✓ Actualizar Libro"
                : "✓ Crear Libro"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/libros")}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarEditarLibro;
