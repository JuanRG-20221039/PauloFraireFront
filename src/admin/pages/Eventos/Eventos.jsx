import React, { useState, useEffect } from "react";
import Spinner from "../../../components/Spinner";
import clientAxios from "../../../config/clientAxios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const AddEventos = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [evento, setEvento] = useState(null); // null si no existe aún
  const [imagenes, setImagenes] = useState([]);

  // Cargar evento existente
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        const { data } = await clientAxios.get("/getEventos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.length > 0) {
          setEvento(data[0]); // siempre tomamos el único evento
        } else {
          setEvento({ title: "", description: "", images: [] });
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el evento");
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [token]);

  // Manejar inputs texto
  const updateState = (e) => {
    setEvento({
      ...evento,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar subida de imágenes nuevas
  const handleImagenes = (e) => {
    setImagenes([...e.target.files]);
  };

  // Guardar (crear o actualizar evento)
  const saveEvento = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!evento.title.trim() || !evento.description.trim()) {
      toast.error("Título y descripción son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", evento.title);
      formData.append("description", evento.description);
      // Agregar imágenes existentes al FormData
      evento.images.forEach((img) => formData.append("existingImages", img));
      imagenes.forEach((img) => formData.append("images", img));

      let response;
      if (evento._id) {
        response = await clientAxios.put(`/updateEvento/${evento._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await clientAxios.post("/createEvento", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success("Evento guardado correctamente");
      setEvento(response.data);
      setImagenes([]);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el evento");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar imagen individual
  const deleteImage = async (imgUrl) => {
    if (!evento._id) return;
    try {
      await clientAxios.put(
        `/deleteImageEvento/${evento._id}`,
        { imageUrl: imgUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvento({
        ...evento,
        images: evento.images.filter((img) => img.url !== imgUrl),
      });
      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      toast.error("Error al eliminar la imagen");
    }
  };

  // Eliminar todo el evento
  const deleteEvento = async () => {
    if (!evento._id) return;
    if (!confirm("¿Seguro que deseas eliminar todo el evento?")) return;

    try {
      await clientAxios.delete(`/deleteEvento/${evento._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvento({ title: "", description: "", images: [] });
      toast.success("Evento eliminado");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar evento");
    }
  };

  if (loading || !evento) return <Spinner />;

  return (
    <section className="container mx-auto">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Administrar Evento
      </h1>

      <div className="p-3 max-w-4xl mx-auto min-h-screen">
        <form className="flex flex-col gap-4" onSubmit={saveEvento}>
          {/* Título */}
          <div className="w-full">
            <label className="font-semibold text-slate-700 pb-2">Título:</label>
            <input
              type="text"
              name="title"
              value={evento.title}
              onChange={updateState}
              className="input-auth"
              placeholder="Ej. Congreso Internacional 2025"
            />
          </div>

          {/* Descripción */}
          <div className="w-full">
            <label className="font-semibold text-slate-700 pb-2">
              Descripción:
            </label>
            <textarea
              name="description"
              value={evento.description}
              onChange={updateState}
              rows="6"
              className="input-auth"
              placeholder="Breve descripción..."
            />
          </div>

          {/* Subir imágenes nuevas */}
          <div className="w-full">
            <label className="font-semibold text-slate-700 pb-2">
              Agregar imágenes:
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagenes}
              className="input-auth"
            />
          </div>

          {/* Preview imágenes nuevas */}
          {imagenes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {imagenes.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Imágenes actuales */}
          {evento.images && evento.images.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mt-6">Imágenes actuales</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {evento.images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url}
                      alt={`evento-${index}`}
                      className="w-full h-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImage(img.url)}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-lg shadow hover:bg-red-700"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <button type="submit" className="btn-action flex-1">
                  {evento._id ? "Actualizar Evento" : "Guardar Evento"}
                </button>
                {evento._id && (
                  <button
                    type="button"
                    onClick={deleteEvento}
                    className="btn-danger flex-1 bg-red-600 text-white"
                  >
                    Eliminar Evento
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddEventos;
