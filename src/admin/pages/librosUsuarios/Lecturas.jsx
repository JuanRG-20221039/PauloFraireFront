// admin/pages/Lecturas.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clientAxios from "../../../config/clientAxios";

const Lecturas = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const { data } = await clientAxios.get("/pdfs-cc");
      setLibros(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar libros:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    // Verificar token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire(
        "Error",
        "Debes iniciar sesión para realizar esta acción",
        "error"
      );
      return;
    }

    // Confirmar eliminación
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el libro "${nombre}" permanentemente`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await clientAxios.delete(`/pdfs-cc/${id}`);

        Swal.fire(
          "Eliminado",
          "El libro fue eliminado correctamente",
          "success"
        );

        // Recargar la lista de libros
        await fetchLibros();
      } catch (error) {
        console.error("Error al eliminar libro:", error);

        if (error.response?.status === 401) {
          Swal.fire(
            "Error de autenticación",
            error.response.data.msg ||
              "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
            "error"
          );
        } else if (error.response?.status === 403) {
          Swal.fire(
            "Acceso denegado",
            "No tienes permisos para realizar esta acción.",
            "error"
          );
        } else {
          Swal.fire(
            "Error",
            error.response?.data?.message || "No se pudo eliminar el libro",
            "error"
          );
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error al cargar libros: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Gestión de Lecturas
          </h1>
          <p className="text-gray-600">
            Administra los libros, cuestionarios e insignias del sistema
          </p>
        </div>
        <Link
          to="/admin/lecturas/agregar"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Agregar Libro
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Libros</p>
              <p className="text-3xl font-bold text-blue-600">
                {libros.length}
              </p>
            </div>
            <div className="text-4xl">📖</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Con Cuestionario</p>
              <p className="text-3xl font-bold text-green-600">
                {libros.filter((l) => l.hasQuiz).length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sin Cuestionario</p>
              <p className="text-3xl font-bold text-orange-600">
                {libros.filter((l) => !l.hasQuiz).length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Lista de libros */}
      {libros.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No hay libros disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primer libro al sistema
          </p>
          <Link
            to="/admin/libros/agregar"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
          >
            Agregar Primer Libro
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libros.map((libro) => (
            <div
              key={libro._id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Imagen del libro */}
              <div className="relative h-48 bg-gray-200">
                {libro.imagen ? (
                  <img
                    src={libro.imagen}
                    alt={libro.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📖
                  </div>
                )}

                {/* Badge de cuestionario */}
                {libro.hasQuiz && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                    <span>✓</span>
                    {libro.questions?.length || 0} preguntas
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {libro.nombre}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {libro.descripcion}
                </p>

                {/* Info de insignia */}
                {libro.hasQuiz && libro.badgeConfig && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {libro.badgeConfig.badgeIcon || "🏆"}
                      </span>
                      <div>
                        <p className="text-xs text-gray-600">Insignia:</p>
                        <p className="text-sm font-semibold text-yellow-700">
                          {libro.badgeConfig.badgeName || "Guerrero Lector"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/lecturas/editar/${libro._id}`}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-center font-semibold"
                    >
                      ✏️ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(libro._id, libro.nombre)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                  {/* Botón para gestionar cuestionario */}
                  <Link
                    to={`/admin/lecturas/cuestionario/${libro._id}`}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition text-center font-semibold"
                  >
                    {libro.hasQuiz
                      ? "📝 Editar Cuestionario"
                      : "➕ Agregar Cuestionario"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Lecturas;
