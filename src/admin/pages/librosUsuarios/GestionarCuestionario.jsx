// admin/pages/GestionarCuestionario.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clientAxios from "../../../config/clientAxios";

const GestionarCuestionario = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado del cuestionario
  const [hasQuiz, setHasQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Estado de la insignia
  const [badgeConfig, setBadgeConfig] = useState({
    badgeName: "Guerrero Lector",
    badgeDescription:
      "Insignia otorgada a los verdaderos Guerreros Lectores que han demostrado su dedicación",
    badgeIcon: "🏆",
  });

  useEffect(() => {
    fetchLibro();
  }, [id]);

  const fetchLibro = async () => {
    try {
      const { data } = await clientAxios.get(`/pdfs-cc/${id}`);
      console.log("Datos del libro cargados:", data);
      setLibro(data);

      // Cargar configuración existente de BadgeConfig
      try {
        const configResponse = await clientAxios.get(`/badge-config/${id}`);

        if (configResponse.data.hasConfig) {
          const config = configResponse.data.badgeConfig;
          setHasQuiz(config.hasQuiz);
          setQuestions(config.questions || []);
          setBadgeConfig({
            badgeName: config.badgeName || "Guerrero Lector",
            badgeDescription:
              config.badgeDescription ||
              "Insignia otorgada por completar el cuestionario perfectamente",
            badgeIcon: config.badgeIcon || "🏆",
          });
        }
      } catch (configError) {
        console.log("No hay configuración previa, usando valores por defecto");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar libro:", error);
      Swal.fire("Error", "No se pudieron cargar los datos del libro", "error");
      setLoading(false);
    }
  };

  // Agregar nueva pregunta
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ]);
  };

  // Actualizar pregunta
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Actualizar opción de pregunta
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  // Eliminar pregunta
  const handleDeleteQuestion = (index) => {
    Swal.fire({
      title: "¿Eliminar pregunta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
      }
    });
  };

  // Actualizar configuración de insignia
  const handleBadgeChange = (field, value) => {
    setBadgeConfig({ ...badgeConfig, [field]: value });
  };

  // Guardar todo
  const handleSave = async () => {
    // Validaciones
    if (hasQuiz && questions.length === 0) {
      Swal.fire(
        "Error",
        "Debes agregar al menos una pregunta si activas el cuestionario",
        "warning"
      );
      return;
    }

    if (hasQuiz) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim() || q.options.some((opt) => !opt.trim())) {
          Swal.fire("Error", `La pregunta ${i + 1} está incompleta`, "warning");
          return;
        }
      }
    }

    // Verificar token
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Sesión requerida",
        text: "Debes iniciar sesión para realizar esta acción",
        icon: "warning",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    setSaving(true);

    try {
      const dataToSend = {
        libroId: id,
        badgeName: badgeConfig.badgeName,
        badgeDescription: badgeConfig.badgeDescription,
        badgeIcon: badgeConfig.badgeIcon,
        hasQuiz: hasQuiz,
        questions: hasQuiz ? questions : [],
      };

      console.log("Enviando datos:", dataToSend);

      await clientAxios.post("/badge-config", dataToSend);

      Swal.fire(
        "Guardado",
        "Cuestionario e insignia guardados correctamente",
        "success"
      );

      navigate("/admin/libros");
    } catch (error) {
      console.error("Error al guardar:", error);

      if (error.response?.status === 401) {
        Swal.fire(
          "Error de autenticación",
          error.response.data.msg ||
            "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
          "error"
        ).then(() => {
          navigate("/login");
        });
      } else if (error.response?.status === 403) {
        Swal.fire(
          "Acceso denegado",
          "No tienes permisos para realizar esta acción.",
          "error"
        );
      } else {
        Swal.fire(
          "Error",
          error.response?.data?.message || "Error al guardar el cuestionario",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (!libro) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          No se pudo cargar el libro
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/libros")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            ← Volver a Libros
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Gestionar Cuestionario
          </h1>
          <p className="text-gray-600">
            Libro: <span className="font-semibold">{libro?.nombre}</span>
          </p>
        </div>

        {/* Activar/Desactivar Cuestionario */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Estado del Cuestionario
              </h3>
              <p className="text-gray-600">
                Activa o desactiva el cuestionario para este libro
              </p>
            </div>
            <button
              onClick={() => setHasQuiz(!hasQuiz)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                hasQuiz
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              {hasQuiz ? "✓ Activado" : "Desactivado"}
            </button>
          </div>
        </div>

        {hasQuiz && (
          <>
            {/* Configuración de Insignia */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🏆 Configuración de Insignia
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Icono de la Insignia
                  </label>
                  <input
                    type="text"
                    value={badgeConfig.badgeIcon}
                    onChange={(e) =>
                      handleBadgeChange("badgeIcon", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="🏆"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Puedes usar cualquier emoji como icono
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nombre de la Insignia
                  </label>
                  <input
                    type="text"
                    value={badgeConfig.badgeName}
                    onChange={(e) =>
                      handleBadgeChange("badgeName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Guerrero Lector"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Descripción de la Insignia
                  </label>
                  <textarea
                    value={badgeConfig.badgeDescription}
                    onChange={(e) =>
                      handleBadgeChange("badgeDescription", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción de la insignia..."
                  />
                </div>

                {/* Preview de la insignia */}
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{badgeConfig.badgeIcon}</span>
                    <div>
                      <p className="font-bold text-yellow-700">
                        {badgeConfig.badgeName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {badgeConfig.badgeDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preguntas */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Preguntas ({questions.length})
                </h3>
                <button
                  onClick={handleAddQuestion}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  + Agregar Pregunta
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-600">
                    No hay preguntas aún. Agrega la primera pregunta.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-bold text-gray-700">
                          Pregunta {qIndex + 1}
                        </h4>
                        <button
                          onClick={() => handleDeleteQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>

                      {/* Pregunta */}
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Texto de la pregunta
                        </label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Escribe la pregunta..."
                        />
                      </div>

                      {/* Opciones */}
                      <div className="space-y-2 mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Opciones de respuesta
                        </label>
                        {q.options.map((opt, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center gap-3"
                          >
                            <span className="font-bold text-gray-600 w-6">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) =>
                                handleOptionChange(
                                  qIndex,
                                  optIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={`Opción ${String.fromCharCode(
                                65 + optIndex
                              )}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Respuesta correcta */}
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Respuesta correcta
                        </label>
                        <select
                          value={q.correct}
                          onChange={(e) =>
                            handleQuestionChange(
                              qIndex,
                              "correct",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={0}>
                            A - {q.options[0] || "(vacío)"}
                          </option>
                          <option value={1}>
                            B - {q.options[1] || "(vacío)"}
                          </option>
                          <option value={2}>
                            C - {q.options[2] || "(vacío)"}
                          </option>
                          <option value={3}>
                            D - {q.options[3] || "(vacío)"}
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "💾 Guardar Cambios"}
          </button>
          <button
            onClick={() => navigate("/admin/libros")}
            disabled={saving}
            className="flex-1 bg-gray-300 text-gray-700 px-6 py-4 rounded-lg hover:bg-gray-400 transition font-semibold text-lg disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default GestionarCuestionario;
