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
    videoTitulo: "",
  });

  const [videoFile, setVideoFile] = useState(null);
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
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {
      const res = await clientAxios.post("/institucional", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
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
      setEditMode(false);
    } catch (err) {
      console.error("❌ Error al guardar institucional:", err);
      Swal.fire("Error", err.message, "error");
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
          videoTitulo: "",
        });
      } catch (err) {
        Swal.fire("Error", "No se pudo eliminar", "error");
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
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 duration-150  p-2 cursor-pointer font-bold text-sm"
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
                <label className="font-bold">Titulo Principal:</label>
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
                  <label className="font-bold">{`Subtitulo ${i}`}:</label>
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
                <label className="font-bold">Titulo del Video</label>
                <input
                  required
                  name="videoTitulo"
                  value={form.videoTitulo}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>

              <div className="mb-4">
                <label className="font-bold">Archivo de Video</label>
                <input
                  required
                  type="file"
                  accept="video/mp4,video/webm,video/x-matroska"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className={`bg-green-600 text-white px-4 py-2 rounded mt-4 ${
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
                  <label className="font-bold">{`Subtitulo ${i}:`}</label>
                  <input
                    value={data[`subtitulo${i}`]}
                    readOnly
                    className="w-full border p-2 bg-gray cursor-default"
                  />
                  <label className="font-bold mt-2 block">{`Contenido ${i}:`}</label>
                  <textarea
                    value={data[`contenido${i}`]}
                    readOnly
                    className="w-full border p-2 bg-white cursor-default"
                  />
                </div>
              ))}

              {data.videoTitulo && (
                <div className="mb-4">
                  <label className="font-bold">Título del Video</label>
                  <input
                    value={data.videoTitulo}
                    readOnly
                    className="w-full border p-2 bg-gray cursor-default"
                  />
                </div>
              )}

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
