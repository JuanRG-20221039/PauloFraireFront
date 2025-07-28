import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import { IoIosArrowBack, IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const EditEducationalOffer = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState(null);
  const [existingPdfs, setExistingPdfs] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [maxCapacity, setMaxCapacity] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const { data } = await clientAxios.get(`/getoffterid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(data.title);
        setDescription(data.description);
        setCurrentImage(data.imageUrl);
        setExistingPdfs(data.pdfs);
        setMaxCapacity(data.maxCapacity || 30);
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la oferta educativa", "error");
      }
    };
    fetchOffer();
  }, [id, token]);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setUploadProgress(percentCompleted);
    },
  };

  const removeImage = () => {
    setCurrentImage("");
    setImage(null);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setCurrentImage("");
  };

  const handlePdfChange = (e) => {
    const newPdfs = Array.from(e.target.files);
    setPdfs([...pdfs, ...newPdfs]);

    // No actualizamos existingPdfs aquí, ya que estos son PDFs nuevos que aún no están en el servidor
    // Los mostraremos por separado en la interfaz
  };

  const removePdf = (index) => {
    // Eliminar un PDF nuevo (que aún no se ha subido al servidor)
    setPdfs(pdfs.filter((_, i) => i !== index));
  };

  const removeExistingPdf = async (pdfUrl) => {
    try {
      await clientAxios.put(
        `/updateEducationalOffer/${id}`,
        { removePdfs: JSON.stringify([pdfUrl]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingPdfs(existingPdfs.filter((pdf) => pdf.url !== pdfUrl));
    } catch (error) {
      console.error("Error al eliminar PDF:", error);
      Swal.fire("Error", "No se pudo eliminar el PDF", "error");
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validar campos obligatorios
  if (
    !title ||
    !description ||
    (!currentImage && !image) ||
    (existingPdfs.length === 0 && pdfs.length === 0) ||
    !maxCapacity
  ) {
    Swal.fire("Error", "Todos los campos son obligatorios", "error");
    return;
  }

  // Validar tamaño de los nuevos PDFs (máximo 10 MB por archivo)
  const maxPdfSize = 10 * 1024 * 1024; // 10 MB
  const oversizedFiles = pdfs.filter((pdf) => pdf.size > maxPdfSize);

  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles.map((f) => f.name).join(", ");
    Swal.fire(
      "Archivo demasiado grande",
      `Los siguientes archivos superan el límite de 10 MB:\n${fileNames}`,
      "error"
    );
    return;
  }

  setIsLoading(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("maxCapacity", maxCapacity);

  if (image) {
    formData.append("image", image);
  } else if (currentImage) {
    formData.append("imageUrl", currentImage);
  }

  // No es necesario enviar los PDFs existentes, ya que el backend los mantiene
  // a menos que se eliminen específicamente con removePdfs
  pdfs.forEach((pdf) => formData.append("pdfs", pdf));

  try {
    await clientAxios.put(`/updateEducationalOffer/${id}`, formData, config);
    Swal.fire("Éxito", "Oferta educativa actualizada correctamente", "success");
    navigate("/admin/ofertaeducativa");
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Hubo un problema al actualizar la oferta", "error");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <section className="container mx-auto bg-slate-50 p-6 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold text-slate-700 mt-4 mb-6">
        Editar Oferta Educativa
      </h1>
      <div className="w-full max-w-2xl">
        <div className="flex my-4">
          <Link
            to="/admin/ofertaeducativa"
            className="btn-action p-2 flex items-center"
          >
            <IoIosArrowBack className="text-2xl" /> Regresar
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white shadow-lg rounded-lg p-6 space-y-4"
        >
          <div>
            <label className="block text-gray-700 font-semibold">Título:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">
              Descripción:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Cupo Máximo:</label>
            <input
              type="number"
              min="1"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Imagen:</label>
            {currentImage || image ? (
              <div className="relative flex justify-center">
                <img
                  src={image ? URL.createObjectURL(image) : currentImage} // Mostrar la nueva imagen o la existente
                  alt="Imagen actual"
                  className="w-full max-w-2xl max-h-96 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                />
                <label
                  htmlFor="imageInput"
                  className="w-full block border p-2 rounded-lg text-gray-500 cursor-pointer"
                >
                  {image ? image.name : "No se ha seleccionado ninguna imagen"}
                </label>
              </>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">PDFs:</label>
            {existingPdfs.length > 0 && (
              <div className="space-y-2 mb-4">
                {existingPdfs.map((pdf, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {pdf.name}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeExistingPdf(pdf.url)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Mostrar PDFs nuevos que se van a subir */}
            {pdfs.length > 0 && (
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-gray-700">PDFs nuevos a subir:</h3>
                {pdfs.map((pdf, index) => (
                  <div
                    key={`new-${index}`}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600">
                      {pdf.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePdf(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input para agregar más PDFs */}
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handlePdfChange}
              className="hidden"
              id="pdfInput"
            />
            <div className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer">
              <label
                htmlFor="pdfInput"
                className="w-full text-gray-500 cursor-pointer"
              >
                Agregar nuevos PDFs
              </label>
              <button
                type="button"
                onClick={() => document.getElementById("pdfInput").click()}
                className="p-1 rounded-full text-green-600"
              >
                <IoIosAddCircle className="text-2xl" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn-action w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "En proceso..." : "Actualizar"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditEducationalOffer;
