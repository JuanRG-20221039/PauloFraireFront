// EditBeca.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import { IoIosArrowBack, IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const EditBeca = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBeca = async () => {
      try {
        const response = await clientAxios.get(`/beca/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching beca data:", error);
      }
    };

    fetchBeca();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await clientAxios.put(
        `/beca/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Actualizado", "La beca ha sido actualizada", "success");
      navigate("/admin/becas");
    } catch (error) {
      console.error("Error updating beca:", error);
      Swal.fire("Error", "No se pudo actualizar la beca", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Editar Beca
      </h1>

      <div className="p-3 max-w-5xl mx-auto min-h-screen">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 justify-between">
            <div className="w-full">
              <label htmlFor="title" className="font-semibold text-slate-700 pb-2">
                Título:
              </label>
              <input
                type="text"
                id="title"
                className="input-auth"
                placeholder="Ej. Beca de excelencia"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="description"
                className="font-semibold text-slate-700 pb-2"
              >
                Descripción:
              </label>
              <textarea
                id="description"
                className="input-auth h-36"
                placeholder="Ej. Descripción de la beca"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {loading ? (
              <button
                type="button"
                className="btn-action bg-gray-400 cursor-not-allowed"
                disabled
              >
                Actualizando...
              </button>
            ) : (
              <button type="submit" className="btn-action">
                Actualizar Beca
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditBeca;
