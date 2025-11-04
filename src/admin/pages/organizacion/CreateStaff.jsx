import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clientAxios from "../../../config/clientAxios.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
// Eliminamos useAuth; clientAxios agrega el token desde localStorage

const CreateStaff = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [order, setOrder] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Config para multipart; Authorization se añade vía interceptor
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const resetForm = () => {
    setName("");
    setLastName("");
    setPosition("");
    setOrder("");
    setPhoto(null);
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !lastName || !position || !order || !photo) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("position", position);
    formData.append("order", order);
    formData.append("photo", photo);

    try {
      await clientAxios.post("/add-staff", formData, config);
      Swal.fire(
        "Éxito",
        "Miembro del personal creado correctamente",
        "success"
      );
      resetForm();
      navigate("/admin/organizacion");
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Hubo un problema al crear el miembro";
      Swal.fire("Error", errorMsg, "error");
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto bg-slate-50 p-6 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold text-slate-700 mt-4 mb-6">
        Agregar Miembro del Personal
      </h1>
      <div className="w-full max-w-2xl">
        <div className="flex my-4">
          <Link
            to="/admin/organizacion"
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
            <label className="block text-gray-700 font-semibold">Nombre:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Apellido:
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ingrese el apellido"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Posición:
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Ej: Director, Coordinador, etc."
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Orden:</label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Ingrese el orden de visualización"
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              El orden determina la posición en la lista
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Fotografía:
            </label>
            {photo ? (
              <div className="relative flex justify-center">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Previsualización"
                  className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removePhoto}
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
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photoInput"
                />
                <label
                  htmlFor="photoInput"
                  className="w-full block border p-2 rounded-lg text-gray-500 cursor-pointer"
                >
                  No se ha seleccionado ninguna imagen
                </label>
              </>
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

export default CreateStaff;
