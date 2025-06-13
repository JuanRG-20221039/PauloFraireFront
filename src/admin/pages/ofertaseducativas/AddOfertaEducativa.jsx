import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import { IoIosArrowBack, IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const CreateEducationalOffer = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [maxCapacity, setMaxCapacity] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { token } = useAuth();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handlePdfChange = (e) => {
    setPdfs([...pdfs, ...Array.from(e.target.files)]);
  };

  const removePdf = (index) => {
    setPdfs(pdfs.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setPdfs([]);
    setMaxCapacity(30);
    setIsLoading(false);
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !image || pdfs.length === 0) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("maxCapacity", maxCapacity);
    pdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      await clientAxios.post("/createoffter", formData, config);
      Swal.fire("Éxito", "Oferta educativa creada correctamente", "success");
      resetForm();
      navigate("/admin/ofertaeducativa");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema al crear la oferta", "error");
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto bg-slate-50 p-6 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold text-slate-700 mt-4 mb-6">
        Crear Oferta Educativa
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
              placeholder="Ingrese el título de la oferta educativa"
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
              placeholder="Ingrese una descripción detallada"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Cupo Máximo:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
              placeholder="Ingrese el cupo máximo de alumnos"
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">Número máximo de alumnos que pueden inscribirse</p>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">Imagen:</label>
            {image ? (
              <div className="relative flex justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Previsualización"
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
                  No se ha seleccionado ninguna imagen
                </label>
              </>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold">PDFs:</label>
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
                className={`p-1 rounded-full ${
                  pdfs.length > 0 ? " text-green-600" : "text-white"
                }`}
              >
                <IoIosAddCircle className="text-2xl" />
              </button>
            </div>
            {pdfs.length > 0 && (
              <ul className="mt-2 border p-2 rounded-lg bg-gray-100">
                {pdfs.map((pdf, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-1 border-b"
                  >
                    {pdf.name}
                    <button type="button" onClick={() => removePdf(index)}>
                      <RiDeleteBin6Line className="text-red-600 text-xl" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="btn-action w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? "En proceso..." : "Guardar"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateEducationalOffer;
