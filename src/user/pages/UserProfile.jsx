import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../../config/clientAxios";
import useAuth from "../../hooks/useAuth";
import StudentSidebar from "../components/StudentSidebar";
import { IoIosAddCircle } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthProvider";

const UserProfile = () => {
  const { logout, token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [educationalOffers, setEducationalOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [changingOffer, setChangingOffer] = useState(false);

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

  const handleDocChange = (e) => {
    setDocs([...docs, ...Array.from(e.target.files)]);
  };

  const removeDoc = (index) => {
    setDocs(docs.filter((_, i) => i !== index));
  };

  const handleUploadDocs = async () => {
    if (!docs.length) {
      toast.error("Seleccione al menos un documento para subir");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      docs.forEach((doc) => {
        formData.append("docs", doc);
      });

      const response = await clientAxios.post(
        `/user/${userData._id}/docs`,
        formData,
        {
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
        }
      );

      setUserData(response.data);
      setDocs([]);
      toast.success("Documentos subidos correctamente");
    } catch (error) {
      console.error("Error al subir documentos:", error);
      toast.error(error.response?.data?.message || "Error al subir documentos");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Función para eliminar un documento cargado
  const handleDeleteDocument = async (docIndex) => {
    try {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará el documento seleccionado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Crear una copia de los documentos actuales sin el documento a eliminar
            const updatedDocs = [...userData.docsAspirante];
            updatedDocs.splice(docIndex, 1);

            const response = await clientAxios.put(
              `/user/${userData._id}/docs`,
              { docsAspirante: updatedDocs },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.status === 200) {
              setUserData((prev) => ({
                ...prev,
                docsAspirante: updatedDocs,
              }));

              toast.success("Documento eliminado correctamente");
            } else {
              throw new Error("Error al eliminar el documento");
            }
          } catch (error) {
            console.error("Error al eliminar documento:", error);
            toast.error(
              error.response?.data?.message || "Error al eliminar el documento"
            );
          }
        }
      });
    } catch (error) {
      console.error("Error al mostrar confirmación:", error);
      toast.error("Error al procesar la solicitud");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchEducationalOffers();
    }
  }, [userData]);

  const fetchUserData = async () => {
    try {
      // Obtener el email del usuario del localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        const email = parsedToken.email;

        // Obtener los datos completos del usuario
        const response = await clientAxios.get(`/user/email/${email}`, {
          headers: {
            Authorization: `Bearer ${parsedToken.token}`,
          },
        });

        setUserData(response.data);
        if (response.data.selectedEducationalOffer) {
          setSelectedOfferId(response.data.selectedEducationalOffer);
        }
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      toast.error("No se pudo cargar la información del usuario");
    } finally {
      setLoading(false);
    }
  };

  const fetchEducationalOffers = async () => {
    try {
      setLoadingOffers(true);
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No hay token de autenticación");
      }

      const parsedToken = JSON.parse(storedToken);

      // Corregir la ruta para que incluya el prefijo 'offer'
      const response = await clientAxios.get("/available", {
        headers: {
          Authorization: `Bearer ${parsedToken.token}`,
        },
      });

      if (!response.data || response.data.length === 0) {
        setEducationalOffers([]);
        return;
      }

      const validOffers = response.data.map((offer) => ({
        _id: offer._id,
        title: offer.title,
        description: offer.description,
        availableSpots: offer.availableSpots,
        maxCapacity: offer.maxCapacity,
        isFull: offer.isFull,
        imageUrl: offer.imageUrl,
      }));

      setEducationalOffers(validOffers);
    } catch (error) {
      console.error("Error detallado al obtener ofertas educativas:", error);
      console.error("Mensaje de error:", error.message);
      console.error("Respuesta del servidor:", error.response?.data);
      toast.error("No se pudieron cargar las ofertas educativas");
      setEducationalOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleSelectOffer = async (offerId) => {
    if (!offerId) return;

    try {
      setChangingOffer(true);
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No hay token de autenticación");
      }

      const parsedToken = JSON.parse(storedToken);

      // Corregir la ruta eliminando el prefijo '/api' ya que clientAxios ya lo incluye en baseURL
      const response = await clientAxios.post(
        `/enroll/${offerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${parsedToken.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedOfferId(offerId);
      Swal.fire(
        "Éxito",
        "Oferta educativa seleccionada correctamente",
        "success"
      );
      await fetchUserData();
      await fetchEducationalOffers();
    } catch (error) {
      console.error("Error al inscribir en oferta:", error);
      console.error("Detalles del error:", error.response?.data);
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "No se pudo seleccionar la oferta educativa",
        "error"
      );
    } finally {
      setChangingOffer(false);
    }
  };

  const handleChangeOffer = async () => {
    try {
      setChangingOffer(true);
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No hay token de autenticación");
      }

      const parsedToken = JSON.parse(storedToken);
      const response = await clientAxios.post(
        `/unenroll/${userData.selectedEducationalOffer}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${parsedToken.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedOfferId("");
      Swal.fire(
        "Éxito",
        "Se ha cancelado la selección de oferta educativa",
        "success"
      );
      await fetchUserData();
      await fetchEducationalOffers();
    } catch (error) {
      console.error("Error al desinscribir de oferta:", error);
      console.error("Detalles del error:", error.response?.data);
      Swal.fire("Error", "No se pudo cambiar la oferta educativa", "error");
    } finally {
      setChangingOffer(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">Cargando información del usuario...</div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <StudentSidebar />

      <div className="flex-1 p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6 md:mt-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Perfil de Usuario
        </h1>

        {userData ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-medium">Nombre:</p>
                  <p className="text-gray-800">{userData.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Apellido:</p>
                  <p className="text-gray-800">{userData.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    Correo Electrónico:
                  </p>
                  <p className="text-gray-800">{userData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    Fecha de Registro:
                  </p>
                  <p className="text-gray-800">
                    {new Date(userData.createdAt).toLocaleDateString("es-MX")}
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de Selección de Oferta Educativa */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Oferta Educativa</h2>

              {userData.selectedEducationalOffer ? (
                <div className="mb-4">
                  <p className="text-gray-600 font-medium">
                    Oferta Educativa Seleccionada:
                  </p>
                  <div className="flex items-center justify-between mt-1 p-2 border rounded bg-blue-50">
                    <p className="text-gray-800 font-semibold">
                      {educationalOffers.find(
                        (offer) =>
                          offer._id === userData.selectedEducationalOffer
                      )?.title || "Cargando..."}
                    </p>
                    <button
                      onClick={handleChangeOffer}
                      disabled={changingOffer}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-yellow-600 transition-colors disabled:bg-yellow-300"
                    >
                      {changingOffer ? "Cambiando..." : "Cambiar"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-gray-600 font-medium mb-2">
                    Seleccione una Oferta Educativa:
                  </p>
                  {loadingOffers ? (
                    <p className="text-gray-600 italic">
                      Cargando ofertas educativas...
                    </p>
                  ) : educationalOffers && educationalOffers.length > 0 ? (
                    <div className="space-y-4">
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => handleSelectOffer(e.target.value)}
                        disabled={changingOffer}
                        value={selectedOfferId}
                      >
                        <option value="">
                          -- Seleccione una oferta educativa --
                        </option>
                        {educationalOffers.map((offer) => (
                          <option
                            key={offer._id}
                            value={offer._id}
                            disabled={offer.isFull}
                          >
                            {offer.title} - Cupos: {offer.availableSpots}/
                            {offer.maxCapacity}{" "}
                            {offer.isFull ? "(Sin cupo)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">
                      No hay ofertas educativas disponibles.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Documentos del Aspirante
              </h2>
              <div className="mb-4">
                <p className="text-gray-600 font-medium">
                  Estado de Documentos:
                </p>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-block w-3 h-3 rounded-full mr-2 ${
                      userData.docsStatus === 1
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <p className="text-gray-800">
                    {userData.docsStatus === 1
                      ? "Aprobados"
                      : "Pendientes de aprobación"}
                  </p>
                </div>
              </div>

              {userData.docsAspirante && userData.docsAspirante.length > 0 ? (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Documentos Cargados:
                  </h3>
                  <ul className="border p-2 rounded-lg bg-gray-100">
                    {userData.docsAspirante.map((doc, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 border-b"
                      >
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            Subido el:{" "}
                            {new Date(doc.uploadDate).toLocaleDateString(
                              "es-MX"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Ver
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar documento"
                            disabled={userData.docsStatus === 1}
                          >
                            <RiDeleteBin6Line className="text-xl" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600 italic">
                  No hay documentos cargados.
                </p>
              )}

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">
                  Cargar Nuevos Documentos:
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Por favor, suba su certificado, CURP, ficha de inscripción y
                  carta compromiso.
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleDocChange}
                  className="hidden"
                  id="docsInput"
                />
                <div className="flex items-center gap-2 border p-2 rounded-lg cursor-pointer">
                  <label
                    htmlFor="docsInput"
                    className="w-full text-gray-500 cursor-pointer"
                  >
                    {docs.length > 0
                      ? `Se han agregado ${docs.length} archivos`
                      : "No se ha seleccionado ningún documento"}
                  </label>
                  <button
                    type="button"
                    onClick={() => document.getElementById("docsInput").click()}
                    className={`p-1 rounded-full ${
                      docs.length > 0 ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    <IoIosAddCircle className="text-2xl" />
                  </button>
                </div>

                {docs.length > 0 && (
                  <>
                    <ul className="mt-2 border p-2 rounded-lg bg-gray-100">
                      {docs.map((doc, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-1 border-b"
                        >
                          {doc.name}
                          <button
                            type="button"
                            onClick={() => removeDoc(index)}
                          >
                            <RiDeleteBin6Line className="text-red-600 text-xl" />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleUploadDocs}
                      disabled={
                        isUploading || !userData.selectedEducationalOffer
                      }
                      className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                      {isUploading
                        ? `Subiendo... ${uploadProgress}%`
                        : userData.selectedEducationalOffer
                        ? "Subir Documentos"
                        : "Seleccione una oferta educativa primero"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No se pudo cargar la información del usuario.
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
