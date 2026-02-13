import React, { useEffect, useRef, useState } from "react";
import clientAxios from "../../../config/clientAxios";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";

function Multimediainscripciones() {
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [replacingVideo, setReplacingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const replaceImageInputRef = useRef(null);
  const [imageToReplacePublicId, setImageToReplacePublicId] = useState(null);
  const { token } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [imgsRes, vidRes] = await Promise.all([
        clientAxios.get("/inscripciones-images"),
        clientAxios.get("/inscripciones-video"),
      ]);
      setImages(Array.isArray(imgsRes.data) ? imgsRes.data : []);
      setVideo(vidRes.data || null);
    } catch (e) {
      Swal.fire("Error", "Error al cargar multimedia", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVideoInputChange = async (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowed = ["video/mp4", "video/webm", "video/x-matroska"];
      const maxSize = 30 * 1024 * 1024;
      if (!allowed.includes(file.type)) {
        Swal.fire(
          "Error",
          "Formato de video no permitido. Usa MP4, WebM o MKV.",
          "error"
        );
        e.target.value = "";
        return;
      }
      if (file.size > maxSize) {
        Swal.fire("Error", "El video no debe exceder 30MB.", "error");
        e.target.value = "";
        return;
      }
    }
    await handleUploadVideoFile(file);
    e.target.value = "";
  };

  // ===========================
  //     IMÁGENES (MODIFICADO)
  // ===========================
  const handleImagesInputChange = async (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      Swal.fire("Aviso", "Selecciona una imagen", "info");
      return;
    }

    if (files.length > 1) {
      Swal.fire("Error", "Solo puedes subir UNA imagen a la vez.", "error");
      e.target.value = "";
      return;
    }

    await handleUploadSingleImage(files[0]);
    e.target.value = "";
  };

  const handleUploadSingleImage = async (file) => {
    if (!file) {
      Swal.fire("Aviso", "Selecciona una imagen", "info");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("images", file);

      await clientAxios.post("/inscripciones-images", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire("Éxito", "Imagen agregada", "success");
      await fetchData();
    } catch (e) {
      Swal.fire("Error", "Error al subir la imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar imagen?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("imagesToDelete", JSON.stringify([publicId]));
      await clientAxios.put("/inscripciones-images", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      Swal.fire("Eliminado", "Imagen eliminada", "success");
      await fetchData();
    } catch (e) {
      Swal.fire("Error", "Error al eliminar imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAllImages = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar todas las imágenes?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    setUploading(true);
    try {
      await clientAxios.delete("/inscripciones-images", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      Swal.fire("Eliminado", "Todas las imágenes eliminadas", "success");
      await fetchData();
    } catch (e) {
      Swal.fire("Error", "Error al eliminar imágenes", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (file) => {
    if (!file || !imageToReplacePublicId) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("imagesToDelete", JSON.stringify([imageToReplacePublicId]));
      await clientAxios.put("/inscripciones-images", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      Swal.fire("Éxito", "Imagen reemplazada", "success");
      setImageToReplacePublicId(null);
      await fetchData();
    } catch (e) {
      Swal.fire("Error", "Error al reemplazar imagen", "error");
    } finally {
      setUploading(false);
    }
  };

  // ===========================
  //     VIDEO (SIN CAMBIOS)
  // ===========================

  const handleUploadVideoFile = async (file) => {
    if (!file) {
      Swal.fire("Aviso", "Selecciona un video", "info");
      return;
    }
    setReplacingVideo(true);
    try {
      const form = new FormData();
      form.append("video", file);
      try {
        await clientAxios.put("/inscripciones-video", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          timeout: 300000,
          onUploadProgress: (pe) => {
            if (pe.total) {
              setVideoProgress(Math.round((pe.loaded * 100) / pe.total));
            }
          },
        });
        Swal.fire("Éxito", "Video reemplazado", "success");
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.error || "Error al subir video";
        if (status === 404) {
          await clientAxios.post("/inscripciones-video", form, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 300000,
            onUploadProgress: (pe) => {
              if (pe.total) {
                setVideoProgress(Math.round((pe.loaded * 100) / pe.total));
              }
            },
          });
          Swal.fire("Éxito", "Video agregado", "success");
        } else {
          throw new Error(msg);
        }
      }
      await fetchData();
    } catch (e) {
      Swal.fire("Error", e.message || "Error al subir video", "error");
    } finally {
      setReplacingVideo(false);
      setVideoProgress(0);
    }
  };

  const handleDeleteVideo = async () => {
    if (!video) return;
    const confirm = await Swal.fire({
      title: "¿Eliminar video?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    setReplacingVideo(true);
    try {
      await clientAxios.delete("/inscripciones-video", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      Swal.fire("Eliminado", "Video eliminado", "success");
      await fetchData();
    } catch (e) {
      Swal.fire("Error", "Error al eliminar video", "error");
    } finally {
      setReplacingVideo(false);
    }
  };

  return (
    <section className="container mx-auto bg-slate-50 p-4">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Administrar Multimedia de Inscripciones
      </h1>
      <p className="text-center my-4 mx-2">
        Aquí puedes gestionar las imágenes y el video de la sección
        Inscripciones
      </p>

      <div className="flex my-2 mx-10">
        <div className="p-2">
          <button
            className="btn-action p-2 inline-flex items-center gap-2 relative overflow-hidden"
            onClick={() => videoInputRef.current?.click()}
            disabled={replacingVideo}
          >
            {replacingVideo && (
              <div
                className="absolute left-0 top-0 h-full bg-green-700/30"
                style={{ width: `${videoProgress}%` }}
              />
            )}
            <IoIosAddCircle className="text-2xl" />
            {replacingVideo
              ? "Subiendo..."
              : video
              ? "Reemplazar video"
              : "Agregar video"}
          </button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/x-matroska"
            className="hidden"
            onChange={handleVideoInputChange}
          />
        </div>
      </div>

      {/* Tabla Video */}
      <div className="overflow-x-auto">
        <table className="table-auto border w-full my-2 text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-gray-600 w-16">No.</th>
              <th className="px-8 py-2 border text-gray-600 w-80">Video</th>
              <th className="px-4 py-2 border text-gray-600 w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : !video ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Sin video
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">1</td>
                <td className="px-8 py-6 border">
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full rounded"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={handleDeleteVideo} title="Eliminar">
                      <RiDeleteBin6Line className="text-3xl text-red-600 hover:text-red-800 cursor-pointer transition-colors" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Imágenes */}
      <div className="flex my-8 mx-10">
        <div className="p-2">
          <button
            className="btn-action p-2 inline-flex items-center gap-2"
            onClick={() => imageInputRef.current?.click()}
          >
            <IoIosAddCircle className="text-2xl" />
            Agregar imagen
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagesInputChange}
          />
        </div>
      </div>

      {/* Input oculto para reemplazar imagen */}
      <input
        ref={replaceImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0] || null;
          await handleReplaceImage(file);
          e.target.value = "";
        }}
      />

      {/* Tabla Imágenes */}
      <div className="overflow-x-auto">
        <table className="table-auto border w-full my-2 text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-gray-600 w-16">No.</th>
              <th className="px-8 py-2 border text-gray-600 w-80">Foto</th>
              <th className="px-4 py-2 border text-gray-600 w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : images.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Sin imágenes
                </td>
              </tr>
            ) : (
              images.map((img, index) => (
                <tr key={img.publicId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-8 py-6 border">
                    <div className="flex items-center justify-center">
                      <img
                        src={img.url}
                        alt=""
                        className="w-60 h-60 object-cover shadow-lg rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleDeleteImage(img.publicId)}
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
}

export default Multimediainscripciones;
