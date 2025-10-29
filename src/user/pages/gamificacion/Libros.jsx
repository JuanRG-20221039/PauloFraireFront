import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:8000";

/**
 * Helper: detectar si un string parece URL de imagen (http/https/data) o Cloudinary /image/upload
 */
const looksLikeImageUrl = (val) =>
  typeof val === "string" &&
  (/^https?:\/\//i.test(val) || val.startsWith("data:image")) &&
  (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(val) ||
    val.includes("/image/upload/"));

/**
 * Confetti/serpentina simple sin dependencias
 */
const ConfettiBurst = () => {
  const COLORS = [
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
  ];
  const PIECES = 80;

  const pieces = Array.from({ length: PIECES }).map((_, i) => {
    const left = Math.random() * 100; // %
    const delay = Math.random() * 0.6; // s
    const duration = 1.2 + Math.random() * 0.9; // s
    const size = 6 + Math.random() * 8; // px
    const rotate = Math.random() * 360;
    const color = COLORS[i % COLORS.length];
    const shape = Math.random() < 0.5 ? "square" : "circle";
    const borderRadius = shape === "circle" ? "999px" : "2px";

    return (
      <span
        key={i}
        style={{
          position: "absolute",
          top: "-10vh",
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius,
          transform: `rotate(${rotate}deg)`,
          animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    );
  });

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.9; }
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.35);
          }
          50% {
            box-shadow: 0 0 45px rgba(250, 204, 21, 0.75), 0 0 90px rgba(250, 204, 21, 0.5);
          }
        }
      `}</style>
      <div className="pointer-events-none fixed inset-0 z-[60]">{pieces}</div>
    </>
  );
};

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Visor
  const [viewer, setViewer] = useState({ url: "", titulo: "", id: "" });

  // Quiz (config del libro)
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    hasQuiz: false,
    questions: [],
    badgeIcon: "🏆",
    badgeName: "Guerrero Lector",
    badgeDescription:
      "Insignia otorgada por completar el cuestionario perfectamente",
  });

  // Progreso
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Insignias del usuario
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [userBadges, setUserBadges] = useState([]);

  // Cache opcional de configs por libro (para mostrar cuando no hay UserBadge)
  const [badgeConfigsCache, setBadgeConfigsCache] = useState({});

  const location = useLocation();

  // Cargar libros
  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch(`${API}/api/pdfs-cc`);
        const data = await response.json();
        setLibros(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err?.message || "Error al obtener libros");
        setLoading(false);
      }
    };
    fetchLibros();
  }, [location.pathname]);

  // Cargar insignias del usuario desde BD
  useEffect(() => {
    const fetchUserBadges = async () => {
      const tokenRaw = localStorage.getItem("token");
      if (!tokenRaw) return;

      let jwt = null;
      try {
        const parsed = JSON.parse(tokenRaw);
        jwt = parsed?.token || null;
      } catch {
        jwt = tokenRaw && tokenRaw.split(".").length === 3 ? tokenRaw : null;
      }
      if (!jwt) return;

      try {
        const response = await fetch(`${API}/api/badges`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUserBadges(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error al cargar insignias:", err);
      }
    };
    fetchUserBadges();
  }, []);

  // Mapa libroId -> UserBadge
  const badgesMap = useMemo(() => {
    const map = {};
    (userBadges || []).forEach((b) => {
      const bid = typeof b.libroId === "string" ? b.libroId : b.libroId?._id;
      if (bid) map[bid] = b;
    });
    return map;
  }, [userBadges]);

  // Guardar insignia al aprobar con score perfecto
  const saveBadge = async (libroId) => {
    const tokenRaw = localStorage.getItem("token");
    if (!tokenRaw) {
      alert("Debes iniciar sesión para guardar tu insignia");
      return;
    }

    let jwt = null;
    try {
      const parsed = JSON.parse(tokenRaw);
      jwt = parsed?.token || null;
    } catch {
      jwt = tokenRaw && tokenRaw.split(".").length === 3 ? tokenRaw : null;
    }
    if (!jwt) {
      alert("No fue posible validar la sesión");
      return;
    }

    try {
      const response = await fetch(`${API}/api/badges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          libroId,
          badgeName: quizConfig.badgeName || "Guerrero Lector",
          badgeDescription:
            quizConfig.badgeDescription ||
            "Insignia otorgada por completar el cuestionario perfectamente",
          score: quizConfig.questions.length, // perfecto
          badgeIcon: quizConfig.badgeIcon, // persistir icono para listados
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Reflejar inmediatamente la insignia ganada desde BD
        setUserBadges((prev) => [...prev, data.badge]);
      } else {
        const errorData = await response.json();
        console.log(errorData.message || "No fue posible guardar la insignia");
      }
    } catch (error) {
      console.error("Error al guardar insignia:", error);
    }
  };

  // Abrir libro y cargar configuración del cuestionario
  const handleLeerMas = async (libro) => {
    const id = libro?._id || libro?.id;
    if (!id) return alert("No se encontró el ID del libro");

    try {
      const cfgRes = await fetch(`${API}/api/badge-config/${id}`);
      if (cfgRes.ok) {
        const cfgJson = await cfgRes.json();
        if (cfgJson?.hasConfig && cfgJson.badgeConfig) {
          const { hasQuiz, questions, badgeIcon, badgeName, badgeDescription } =
            cfgJson.badgeConfig;

          const cfg = {
            hasQuiz: !!hasQuiz,
            questions: Array.isArray(questions) ? questions : [],
            badgeIcon: badgeIcon || "🏆",
            badgeName: badgeName || "Guerrero Lector",
            badgeDescription:
              badgeDescription ||
              "Insignia otorgada por completar el cuestionario perfectamente",
          };

          setQuizConfig(cfg);
          setBadgeConfigsCache((prev) => ({
            ...prev,
            [id]: cfgJson.badgeConfig,
          }));
        } else {
          setQuizConfig({
            hasQuiz: false,
            questions: [],
            badgeIcon: "🏆",
            badgeName: "Guerrero Lector",
            badgeDescription:
              "Insignia otorgada por completar el cuestionario perfectamente",
          });
        }
      } else {
        setQuizConfig((p) => ({ ...p, hasQuiz: false, questions: [] }));
      }
    } catch {
      setQuizConfig((p) => ({ ...p, hasQuiz: false, questions: [] }));
    }

    // Abrir PDF
    try {
      const res = await fetch(`${API}/api/pdfs-cc/${id}`, {
        headers: { Accept: "application/pdf, application/json" },
      });
      const ct = res.headers.get("content-type")?.toLowerCase() || "";

      if (ct.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setViewer({ url, titulo: libro.nombre || "Lectura", id });
        return;
      }

      const json = await res.json();
      const direct = json?.archivo;
      if (direct) {
        setViewer({
          url: direct.startsWith("http") ? direct : API + direct,
          titulo: libro.nombre || "Lectura",
          id,
        });
      } else {
        alert("Este libro no tiene PDF disponible");
      }
    } catch {
      alert("No fue posible abrir el PDF");
    }
  };

  // Reset visor
  const handleCerrar = () => {
    setViewer({ url: "", titulo: "", id: "" });
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setShowBadgeModal(false);
  };

  // Iniciar quiz
  const handleStartQuiz = () => {
    if (!quizConfig.hasQuiz || quizConfig.questions.length === 0) {
      alert("Este libro no tiene cuestionario disponible");
      return;
    }
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const currentQ = useMemo(
    () => quizConfig.questions[currentQuestion],
    [quizConfig.questions, currentQuestion]
  );

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    const total = quizConfig.questions.length;
    if (currentQuestion < total - 1) {
      setCurrentQuestion((p) => p + 1);
      return;
    }
    // Finalizar
    let correctCount = 0;
    quizConfig.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correctCount++;
    });
    setScore(correctCount);
    setQuizCompleted(true);

    if (correctCount === total && total > 0 && viewer.id) {
      saveBadge(viewer.id);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  if (loading) return <div className="p-4">Cargando libros...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  // Visor con quiz
  if (viewer.url) {
    const total = quizConfig.questions.length || 0;
    const progressPct =
      total > 0 ? Math.round(((currentQuestion + 1) / total) * 100) : 0;

    const badgeIconVal = quizConfig.badgeIcon || "🏆";
    const isModalIconImg = looksLikeImageUrl(badgeIconVal);

    return (
      <>
        <div className="w-full h-full flex gap-4">
          {/* PDF */}
          <div
            className={`flex flex-col ${
              showQuiz ? "w-2/3" : "w-full"
            } transition-all duration-300`}
          >
            <div className="w-full flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">{viewer.titulo}</h2>
              <div className="flex gap-2">
                {!showQuiz && (
                  <button
                    className="text-white bg-green-600 hover:bg-green-700 rounded px-4 py-2 font-semibold border transition"
                    onClick={handleStartQuiz}
                  >
                    📝 Realizar Cuestionario
                  </button>
                )}
                <button
                  className="text-red-600 bg-white rounded px-4 py-2 hover:underline font-semibold border"
                  onClick={handleCerrar}
                >
                  Regresar
                </button>
              </div>
            </div>
            <div className="w-full h-[80vh] bg-gray-100 rounded-lg overflow-hidden shadow-xl">
              <iframe
                src={viewer.url}
                title="Lector PDF"
                className="w-full h-full"
                frameBorder="0"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={viewer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Abrir en pestaña nueva
              </a>
            </div>
          </div>

          {/* Quiz */}
          {showQuiz && (
            <div className="w-1/3 bg-white rounded-lg shadow-xl p-6 overflow-y-auto h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-700">
                  Cuestionario
                </h3>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setShowQuiz(false)}
                >
                  ✕
                </button>
              </div>

              {!quizCompleted ? (
                <div>
                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        Pregunta {currentQuestion + 1} de{" "}
                        {quizConfig.questions.length || 0}
                      </span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Pregunta */}
                  {currentQ ? (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-4">
                        {currentQ.question}
                      </h4>
                      <div className="space-y-3">
                        {currentQ.options.map((option, index) => (
                          <button
                            key={index}
                            className={`w-full text-left p-3 rounded-lg border-2 transition ${
                              answers[currentQuestion] === index
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-300 hover:border-blue-400"
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <span className="font-semibold">
                              {String.fromCharCode(65 + index)}.
                            </span>{" "}
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      No hay preguntas disponibles.
                    </div>
                  )}

                  {/* Navegación */}
                  <div className="flex justify-between gap-2">
                    <button
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                    >
                      ← Anterior
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                      onClick={handleNextQuestion}
                      disabled={
                        quizConfig.questions.length === 0 ||
                        answers[currentQuestion] === undefined
                      }
                    >
                      {currentQuestion ===
                      (quizConfig.questions.length || 0) - 1
                        ? "Finalizar"
                        : "Siguiente →"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {score === (quizConfig.questions.length || 0) &&
                  (quizConfig.questions.length || 0) > 0 ? (
                    <div className="mb-6">
                      <div className="text-6xl mb-4 animate-bounce">🎉</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">
                        ¡Felicidades!
                      </h3>
                      <p className="text-gray-700 mb-4">Puntuación perfecta.</p>
                      <div className="bg-green-100 border-2 border-green-600 rounded-lg p-4 mb-4">
                        <p className="text-4xl font-bold text-green-600">
                          {score}/{quizConfig.questions.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">¡Excelente!</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-2xl font-bold text-orange-600 mb-2">
                        Sigue intentando
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Necesitas responder correctamente todas.
                      </p>
                      <div className="bg-orange-100 border-2 border-orange-600 rounded-lg p-4 mb-4">
                        <p className="text-4xl font-bold text-orange-600">
                          {score}/{quizConfig.questions.length || 0}
                        </p>
                        <p className="text-sm text-gray-600">
                          Inténtalo de nuevo
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      onClick={handleRestartQuiz}
                    >
                      Intentar de nuevo
                    </button>
                    {score === (quizConfig.questions.length || 0) &&
                      (quizConfig.questions.length || 0) > 0 && (
                        <button
                          className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold"
                          onClick={() => setShowBadgeModal(true)}
                        >
                          🏆 Ver Insignia
                        </button>
                      )}
                    <button
                      className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                      onClick={() => setShowQuiz(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de Insignia */}
        {showBadgeModal && (
          <div className="fixed inset-0 z-50">
            {/* Fondo oscurecido */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowBadgeModal(false)}
            />
            {/* Confetti */}
            <ConfettiBurst />
            {/* Contenedor modal */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Header con degradado */}
                <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 h-20" />
                {/* Glow detrás de la insignia */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />
                <div className="p-6 pt-0 text-center">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowBadgeModal(false)}
                  >
                    ✕
                  </button>
                  {/* Insignia con glow */}
                  <div className="relative -mt-12 mx-auto w-28 h-28 rounded-full bg-white flex items-center justify-center border-4 border-yellow-400 animate-[pulse-glow_2s_ease-in-out_infinite] overflow-hidden">
                    {isModalIconImg ? (
                      <img
                        src={badgeIconVal}
                        alt="Insignia"
                        className="w-24 h-24 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const s = document.createElement("span");
                          s.textContent = "🏆";
                          s.style.fontSize = "56px";
                          e.currentTarget.parentElement?.appendChild(s);
                        }}
                      />
                    ) : (
                      <span className="text-6xl">{badgeIconVal}</span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-yellow-700">
                    ¡Insignia Desbloqueada!
                  </h2>
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-6 rounded-lg mb-4 shadow-lg inline-block">
                    <p className="text-xl font-bold">{quizConfig.badgeName}</p>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {quizConfig.badgeDescription}
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {quizConfig.questions.length}/
                          {quizConfig.questions.length}
                        </p>
                        <p className="text-sm text-gray-600">
                          Respuestas correctas
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">100%</p>
                        <p className="text-sm text-gray-600">Precisión</p>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition font-semibold shadow-lg"
                    onClick={() => setShowBadgeModal(false)}
                  >
                    ¡Genial!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Tarjetas
  if (!libros.length)
    return <div className="p-4 text-gray-600">No hay libros disponibles.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {libros.map((libro, index) => {
        const libroId = libro?._id || libro?.id;

        // Insignia ganada por usuario (desde BD) o config cache
        const userBadge = badgesMap[libroId];
        const cfg = badgeConfigsCache[libroId];

        // Decide qué icono/etiqueta mostrar
        const iconToShow = userBadge?.badgeIcon || cfg?.badgeIcon || null;
        const isBadgeImg = looksLikeImageUrl(iconToShow);

        // Portada: usa libro.imagen; si no existe y la descripción es URL de imagen, úsala
        const coverSrc =
          (typeof libro.imagen === "string" && libro.imagen) ||
          (looksLikeImageUrl(libro.descripcion) ? libro.descripcion : null);

        // Descripción solo si NO es URL
        const safeDescripcion =
          typeof libro.descripcion === "string" &&
          !looksLikeImageUrl(libro.descripcion)
            ? libro.descripcion
            : "";

        return (
          <div
            key={libroId || index}
            className="bg-white rounded-xl shadow-xl p-5 flex flex-col hover:shadow-2xl transition"
          >
            {/* Título */}
            <h3 className="text-lg font-bold text-yellow-600 mb-2 text-center">
              {libro.nombre}
            </h3>

            {/* Imagen de portada */}
            {coverSrc && (
              <img
                src={coverSrc}
                alt={libro.nombre}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            {/* Descripción (solo texto) */}
            {safeDescripcion ? (
              <p className="text-gray-600 mb-4 text-center break-words">
                {safeDescripcion.length > 200
                  ? `${safeDescripcion.slice(0, 200)}...`
                  : safeDescripcion}
              </p>
            ) : (
              <div className="mb-4" />
            )}

            {/* Pie: insignia (BD/config) a la izquierda, botón a la derecha */}
            <div className="mt-auto w-full flex items-center justify-between">
              {iconToShow ? (
                <div className="flex items-center gap-2">
                  {isBadgeImg ? (
                    <img
                      src={iconToShow}
                      alt="Insignia"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-yellow-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const s = document.createElement("span");
                        s.textContent = "🏆";
                        s.className = "text-2xl";
                        e.currentTarget.parentElement?.appendChild(s);
                      }}
                    />
                  ) : (
                    <span className="text-2xl">{iconToShow}</span>
                  )}
                </div>
              ) : (
                <div />
              )}

              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition active:scale-95"
                onClick={() => handleLeerMas(libro)}
              >
                Leer más
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Libros;
