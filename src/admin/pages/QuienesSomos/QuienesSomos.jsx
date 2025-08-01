import { useEffect, useState } from "react";
import { FiEdit, FiXCircle } from "react-icons/fi";
import Swal from "sweetalert2";
import { RiDeleteBin6Line } from "react-icons/ri";
import clientAxios from "../../../config/clientAxios";
import useAuth from "../../../hooks/useAuth";

const QuienesSomos = () => {
  const [form, setForm] = useState({
    tituloPrincipal: "",
    subtitulo1: "",
    contenido1: "",
    subtitulo2: "",
    contenido2: "",
    subtitulo3: "",
    contenido3: "",
    subtitulo4: "",
    contenido4: "",
  });

  const [videoFile, setVideoFile] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await clientAxios.get("/institucional", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
        setForm({ ...res.data });
      } catch (error) {
        console.error("❌ No se encontró contenido institucional.", error);
        Swal.fire(
          "Error",
          "No se pudo cargar el contenido institucional",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedFormats = ["video/mp4", "video/webm", "video/x-matroska"];
    const maxSize = 30 * 1024 * 1024; // 30MB

    if (!allowedFormats.includes(file.type)) {
      Swal.fire(
        "Error",
        "Formato de video no permitido. Usa MP4, WebM o MKV.",
        "error"
      );
      return;
    }

    if (file.size > maxSize) {
      Swal.fire("Error", "El video no debe exceder 30MB.", "error");
      return;
    }

    setVideoFile(file);
    setRemoveVideo(false); // Si se sube un nuevo video, no eliminamos el actual
  };

  const handleRemoveVideo = () => {
    setRemoveVideo(true);
    setVideoFile(null); // Limpiamos el nuevo video si el usuario decide eliminar el actual
    Swal.fire(
      "Video eliminado",
      "El video actual será eliminado al guardar.",
      "info"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    // Validar campos de texto
    if (
      !form.tituloPrincipal.trim() ||
      !form.subtitulo1.trim() ||
      !form.contenido1.trim() ||
      !form.subtitulo2.trim() ||
      !form.contenido2.trim() ||
      !form.subtitulo3.trim() ||
      !form.contenido3.trim() ||
      !form.subtitulo4.trim() ||
      !form.contenido4.trim()
    ) {
      Swal.fire(
        "Campos incompletos",
        "Completa todos los campos de texto",
        "warning"
      );
      setIsSubmitting(false);
      return;
    }

    // Validar video al crear nuevo contenido
    if (!data && !videoFile) {
      Swal.fire("Error", "Debes incluir un video al crear contenido", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (videoFile) {
      formData.append("video", videoFile);
    }
    formData.append("removeVideo", removeVideo);

    const method = data ? "put" : "post";
    try {
      const res = await clientAxios[method]("/institucional", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 300 segundos (5 minutos)
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      Swal.fire("Éxito", "Contenido guardado correctamente", "success");
      setData(res.data.data);
      setForm({ ...res.data.data });
      setVideoFile(null);
      setRemoveVideo(false);
      setEditMode(false);
    } catch (err) {
      console.error("❌ Error al guardar institucional:", err);
      let errorMessage = "Error al guardar el contenido.";
      if (err.code === "ECONNABORTED") {
        errorMessage =
          "Tiempo de espera agotado. Verifica si el contenido se guardó correctamente recargando la página.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data.error || "Verifica el formato y tamaño del video.";
      } else if (err.response?.status === 401) {
        errorMessage =
          "Token inválido o expirado. Por favor, inicia sesión nuevamente.";
      } else if (err.response?.status === 403) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      } else if (
        err.response?.data?.error?.includes(
          "Tiempo de espera agotado al subir el video"
        )
      ) {
        errorMessage = err.response.data.error;
      }
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar contenido?",
      text: "Esta acción eliminará texto y video.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      try {
        await clientAxios.delete("/institucional", {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Eliminado", "Contenido eliminado", "success");
        setData(null);
        setForm({
          tituloPrincipal: "",
          subtitulo1: "",
          contenido1: "",
          subtitulo2: "",
          contenido2: "",
          subtitulo3: "",
          contenido3: "",
          subtitulo4: "",
          contenido4: "",
        });
      } catch (err) {
        console.error("❌ Error al eliminar institucional:", err);
        let errorMessage = "No se pudo eliminar el contenido.";
        if (err.response?.status === 401) {
          errorMessage =
            "Token inválido o expirado. Por favor, inicia sesión nuevamente.";
        } else if (err.response?.status === 403) {
          errorMessage = "No tienes permisos para realizar esta acción.";
        }
        Swal.fire("Error", errorMessage, "error");
      }
    }
  };

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-slate-700 mb-4">
        Administración - Quiénes Somos
      </h1>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <>
          <div className="flex my-2 mx-10 gap-4">
            <div className="p-2">
              <button
                className="btn-action p-2 flex items-center gap-2"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <>
                    <FiXCircle className="text-xl" />
                    Cancelar edición
                  </>
                ) : (
                  <>
                    <FiEdit className="text-xl" />
                    {data ? "Editar Contenido" : "Agregar Contenido"}
                  </>
                )}
              </button>
            </div>
            {data && (
              <div className="flex my-2 mx-100 gap-4">
                <button
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 duration-150 p-2 cursor-pointer font-bold text-sm"
                  onClick={handleDelete}
                >
                  <RiDeleteBin6Line className="text-xl" />
                  Eliminar Contenido
                </button>
              </div>
            )}
          </div>

          {editMode ? (
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow p-4 rounded"
            >
              <div className="mb-4">
                <label className="font-bold">Título Principal:</label>
                <input
                  required
                  name="tituloPrincipal"
                  value={form.tituloPrincipal}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-4">
                  <label className="font-bold">{`Subtítulo ${i}`}:</label>
                  <input
                    required
                    name={`subtitulo${i}`}
                    value={form[`subtitulo${i}`]}
                    onChange={handleChange}
                    className="w-full border p-2"
                  />
                  <label className="font-bold mt-2">{`Contenido ${i}`}:</label>
                  <textarea
                    required
                    name={`contenido${i}`}
                    value={form[`contenido${i}`]}
                    onChange={handleChange}
                    className="w-full border p-2"
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="font-bold">
                  Video Actual{" "}
                  {data && !removeVideo && data.videoUrl && !videoFile
                    ? ""
                    : "(Opcional)"}
                </label>
                {videoFile ? (
                  <div className="flex items-center gap-4 mb-2">
                    <video
                      src={URL.createObjectURL(videoFile)}
                      controls
                      className="w-full md:w-1/2 rounded shadow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        Swal.fire(
                          "Video nuevo eliminado",
                          "Selecciona otro video si lo deseas.",
                          "info"
                        );
                      }}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      title="Eliminar video nuevo"
                    >
                      <FiXCircle className="text-xl" />
                    </button>
                  </div>
                ) : (
                  data &&
                  !removeVideo &&
                  data.videoUrl && (
                    <div className="flex items-center gap-4 mb-2">
                      <video
                        src={data.videoUrl}
                        controls
                        className="w-full md:w-1/2 rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        title="Eliminar video actual"
                      >
                        <FiXCircle className="text-xl" />
                      </button>
                    </div>
                  )
                )}
                <label className="font-bold">
                  Subir Nuevo Video {data ? "(Opcional)" : "(Requerido)"}
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/x-matroska"
                  onChange={handleVideoChange}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className={`bg-green-800 hover:bg-green-900 text-white px-4 py-2  ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar Contenido"}
              </button>
            </form>
          ) : data ? (
            <form className="bg-white shadow p-4 rounded">
              <div className="mb-4">
                <label className="font-bold">Título Principal:</label>
                <input
                  value={data.tituloPrincipal}
                  readOnly
                  className="w-full border p-2 bg-white cursor-default"
                />
              </div>

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="mb-4">
                  <label className="font-bold">{`Subtítulo ${i}:`}</label>
                  <input
                    value={data[`subtitulo${i}`]}
                    readOnly
                    className="w-full border p-2 bg-gray-100 cursor-default"
                  />
                  <label className="font-bold mt-2 block">{`Contenido ${i}:`}</label>
                  <textarea
                    value={data[`contenido${i}`]}
                    readOnly
                    className="w-full border p-2 bg-white cursor-default"
                  />
                </div>
              ))}

              {data.videoUrl && (
                <div className="flex justify-center mt-4">
                  <video
                    src={data.videoUrl}
                    controls
                    className="w-full md:w-1/2 rounded shadow"
                  />
                </div>
              )}
            </form>
          ) : (
            <p className="text-red-600 text-center">
              No hay contenido institucional disponible.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default QuienesSomos;
