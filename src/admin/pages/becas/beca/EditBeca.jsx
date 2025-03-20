// EditBeca.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clientAxios from "../../../../config/clientAxios";
import { IoIosArrowBack, IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";


const EditBeca = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState(null);
  const [existingPdfs, setExistingPdfs] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBeca = async () => {
      try {
        const { data } = await clientAxios.get(`/getbeca/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(data.title);
        setDescription(data.description);
        setRequisitos(data.requisitos);
        setCurrentImage(data.imageUrl);
        setExistingPdfs(data.pdfs);
      } catch (error) {
        Swal.fire("Error", "No se pudo cargar la beca", "error");
      }
    };
    fetchBeca();
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

    // Actualizar existingPdfs con los nuevos PDFs
    const newExistingPdfs = newPdfs.map((file) => ({
      url: URL.createObjectURL(file), // URL temporal para previsualización
      name: file.name,
    }));
    setExistingPdfs([...existingPdfs, ...newExistingPdfs]);
  };

  const removePdf = (index) => {
    setPdfs(pdfs.filter((_, i) => i !== index));
  };

  const removeExistingPdf = async (pdfUrl) => {
    try {
      await clientAxios.put(
        `/updateBeca/${id}`,
        { pdfsToDelete: [pdfUrl] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingPdfs(existingPdfs.filter((pdf) => pdf.url !== pdfUrl));
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el PDF", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || (!currentImage && !image) || (existingPdfs.length === 0 && pdfs.length === 0)) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("requisitos", requisitos);
    if (image) {
      formData.append("image", image);
    } else if (currentImage) {
      formData.append("imageUrl", currentImage);
    }
    existingPdfs.forEach((pdf) => formData.append("existingPdfs[]", JSON.stringify(pdf)));
    pdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      await clientAxios.put(`/updateBeca/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      Swal.fire("Éxito", "Beca actualizada correctamente", "success");
      navigate("/admin/becas");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar la beca", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-center text-3xl font-bold">Editar Beca</h1>
      <div className="flex my-4">
        <Link
          to="/admin/becas"
          className="btn-action p-2 flex items-center"
        >
          <IoIosArrowBack className="text-2xl" /> Regresar
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg">
        <div>
          <label>Título:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded"></textarea>
        </div>

        <div>
          <label>Requisitos:</label>
          <textarea value={requisitos} onChange={(e) => setRequisitos(e.target.value)} className="w-full p-2 border rounded"></textarea>
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
              {pdfs.length > 0
                ? `Se han agregado ${pdfs.length} archivos`
                : "No se ha seleccionado ningún PDF"}
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

        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? "Actualizando..." : "Actualizar"}
        </button>
      </form>
    </section>
  );
};

export default EditBeca;
