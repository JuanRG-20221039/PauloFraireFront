import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import clientAxios from "../../../config/clientAxios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiEdit } from "react-icons/ti";
import Swal from "sweetalert2";

const Organizacion = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getStaff = async () => {
      try {
        const response = await clientAxios.get("/getstaff");
        setStaff(response.data);
      } catch (error) {
        console.error(error);
        setError("No se pudo cargar el personal");
      } finally {
        setLoading(false);
      }
    };
    getStaff();
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este miembro del personal",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete(`/delete-staff/${id}`);
          setStaff(staff.filter((member) => member._id !== id));
          Swal.fire(
            "Eliminado!",
            "El miembro del personal ha sido eliminado",
            "success"
          );
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            "No se pudo eliminar el miembro del personal",
            "error"
          );
        }
      }
    });
  };

  return (
    <section className="container mx-auto bg-slate-50 p-4">
      <h1 className="text-center text-3xl font-bold text-slate-600 mt-10">
        Administrar Personal
      </h1>
      <p className="text-center my-4 mx-2">
        Aquí puedes gestionar el personal de la organización
      </p>
      <div className="flex my-2 mx-10">
        <div className="p-2">
          <Link to="/admin/add-staff" className="btn-action p-2">
            <IoIosAddCircle className="text-2xl" />
            Agregar miembro del personal
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border w-full my-2 text-sm md:text-base">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-gray-600 w-16">No.</th>
              <th className="px-8 py-2 border text-gray-600 w-80">Foto</th>
              <th className="px-4 py-2 border text-gray-600">Nombre</th>
              <th className="px-4 py-2 border text-gray-600">Apellido</th>
              <th className="px-4 py-2 border text-gray-600">Posición</th>
              <th className="px-4 py-2 border text-gray-600 w-24">Orden</th>
              <th className="px-4 py-2 border text-gray-600 w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Cargando...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-red-600">
                  {error}
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No hay personal registrado
                </td>
              </tr>
            ) : (
              staff.map((member, index) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-8 py-6 border">
                    <div className="flex items-center justify-center">
                      <img
                        src={member.photo}
                        alt={`${member.name ?? ""} ${member.lastName ?? ""}`}
                        className="w-60 h-60 object-cover  shadow-lg rounded-lg"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2 border text-center text-base font-medium">
                    {member.name || ""}
                  </td>
                  <td className="px-4 py-2 border text-center text-base font-medium">
                    {member.lastName || ""}
                  </td>
                  <td className="px-4 py-2 border text-center text-base">
                    {member.position || ""}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                      #{member.order ?? ""}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex items-center justify-center gap-3">
                      <Link to={`/admin/edit-staff/${member._id}`}>
                        <TiEdit className="text-3xl text-blue-600 hover:text-blue-800 cursor-pointer transition-colors" />
                      </Link>
                      <button onClick={() => handleDelete(member._id)}>
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
};

export default Organizacion;
