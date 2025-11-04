import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clientAxios from "../../../config/clientAxios.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
// Eliminamos useAuth; clientAxios agrega el token desde localStorage

const EditStaff = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [order, setOrder] = useState("");
  const [currentPhoto, setCurrentPhoto] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const { data } = await clientAxios.get(`/getstaff/${id}`);
        setName(data.name);
        setLastName(data.lastName);
        setPosition(data.position);
        setOrder(data.order);
        setCurrentPhoto(data.photo);
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo cargar el miembro del personal",
          "error"
        );
      }
    };
    fetchMember();
  }, [id]);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const removePhoto = () => {
    setCurrentPhoto("");
    setPhoto(null);
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
    setCurrentPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !lastName ||
      !position ||
      !order ||
      (!currentPhoto && !photo)
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("position", position);
    formData.append("order", order);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await clientAxios.put(`/edit-staff/${id}`, formData, config);
      Swal.fire(
        "Éxito",
        "Miembro del personal actualizado correctamente",
        "success"
      );
      navigate("/admin/organizacion");
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Hubo un problema al actualizar el miembro";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto bg-slate-50 p-6 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl font-bold text-slate-700 mt-4 mb-6">
        Editar Miembro del Personal
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
            {currentPhoto || photo ? (
              <div className="relative flex justify-center">
                <img
                  src={photo ? URL.createObjectURL(photo) : currentPhoto}
                  alt="Imagen actual"
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
                  {photo ? photo.name : "No se ha seleccionado ninguna imagen"}
                </label>
              </>
            )}
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

export default EditStaff;
