import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const AddBeca = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [image, setImage] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePdfChange = (e) => {
    setPdfs([...pdfs, ...Array.from(e.target.files)]);
  };

  const removePdf = (index) => {
    setPdfs(pdfs.filter((_, i) => i !== index));
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
    formData.append("requisitos", requisitos);
    formData.append("image", image);
    pdfs.forEach((pdf) => formData.append("pdfs", pdf));

    try {
      await clientAxios.post("/createbeca", formData, config);
      Swal.fire("Éxito", "Beca creada correctamente", "success");
      navigate("/admin/becas");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al crear la beca", "error");
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h1 className="text-center text-3xl font-bold text-slate-600 mb-6">Crear Beca</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-slate-700 font-semibold">Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-auth" />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold">Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-auth"></textarea>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold">Requisitos</label>
          <textarea value={requisitos} onChange={(e) => setRequisitos(e.target.value)} className="input-auth"></textarea>
        </div>
        <div>
          <label className="block text-slate-700 font-semibold">Imagen</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input-auth" />
        </div>
        <div>
          <label className="block text-slate-700 font-semibold">PDFs</label>
          <input type="file" accept=".pdf" multiple onChange={handlePdfChange} className="input-auth" />
          <div className="mt-2 space-y-2">
            {pdfs.map((pdf, index) => (
              <div key={index} className="flex justify-between bg-gray-100 p-2 rounded-lg">
                <span className="text-gray-700">{pdf.name}</span>
                <button type="button" onClick={() => removePdf(index)} className="text-red-500 hover:text-red-700">Eliminar</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-action w-full" disabled={isLoading}>{isLoading ? "Enviando..." : "Guardar"}</button>
      </form>
    </section>
  );
};

export default AddBeca;
