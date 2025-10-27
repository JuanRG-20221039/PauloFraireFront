import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:8000";

const Libros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewer, setViewer] = useState({ url: "", titulo: "" });
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const location = useLocation();

  // Preguntas del cuestionario
  const quizQuestions = [
    {
      question: "¿Cuál es el tema principal del documento?",
      options: ["Gramática inglesa", "Matemáticas", "Historia", "Ciencias"],
      correct: 0,
    },
    {
      question: "¿Qué estructura gramatical se enseña en el PDF?",
      options: ["Presente simple", "Voz pasiva", "Futuro continuo", "Presente perfecto"],
      correct: 1,
    },
    {
      question: "¿Cuántos ejercicios se presentan en el documento?",
      options: ["5", "7", "10", "15"],
      correct: 1,
    },
    {
      question: "¿En qué tiempo verbal se enfoca principalmente?",
      options: ["Presente", "Pasado", "Futuro", "Condicional"],
      correct: 1,
    },
    {
      question: "¿El documento incluye ejemplos prácticos?",
      options: ["Sí", "No", "Solo algunos", "No se especifica"],
      correct: 0,
    },
    {
      question: "¿Qué tipo de oraciones se practican?",
      options: ["Afirmativas", "Negativas", "Interrogativas", "Todas las anteriores"],
      correct: 3,
    },
    {
      question: "¿El PDF menciona la estructura sujeto-verbo-objeto?",
      options: ["Sí", "No", "Parcialmente", "No es relevante"],
      correct: 0,
    },
    {
      question: "¿Cuál es el objetivo del ejercicio?",
      options: ["Leer", "Escribir", "Reescribir oraciones", "Traducir"],
      correct: 2,
    },
    {
      question: "¿El documento tiene respuestas incluidas?",
      options: ["Sí", "No", "Solo algunas", "Al final"],
      correct: 1,
    },
    {
      question: "¿Para qué nivel educativo está diseñado?",
      options: ["Básico", "Intermedio", "Avanzado", "Todos los niveles"],
      correct: 1,
    },
  ];

  useEffect(() => {
    fetch(`${API}/api/pdfs-cc`)
      .then((r) => r.json())
      .then((data) => {
        setLibros(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Error al obtener libros");
        setLoading(false);
      });
  }, [location.pathname]);

  const handleLeerMas = async (libro) => {
    const id = libro?._id || libro?.id;
    if (!id) return alert("No se encontró el ID del libro");

    try {
      const res = await fetch(`${API}/api/pdfs-cc/${id}`, {
        headers: { Accept: "application/pdf, application/json" },
      });
      const ct = res.headers.get("content-type")?.toLowerCase() || "";

      if (ct.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setViewer({ url, titulo: libro.titulo || "Lectura" });
        return;
      }

      const json = await res.json();
      const direct =
        json?.pdfUrl || json?.link || json?.url || json?.archivo || json?.path;
      if (direct) {
        setViewer({
          url: direct.startsWith("http") ? direct : API + direct,
          titulo: libro.titulo || "Lectura",
        });
      } else {
        alert("Este libro no tiene PDF disponible");
      }
    } catch (e) {
      alert("No fue posible abrir el PDF");
    }
  };

  const handleCerrar = () => {
    setViewer({ url: "", titulo: "" });
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setShowBadgeModal(false);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let correctCount = 0;
      quizQuestions.forEach((q, index) => {
        if (answers[index] === q.correct) {
          correctCount++;
        }
      });
      setScore(correctCount);
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };

  if (loading) return <div className="p-4">Cargando libros...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  // Si hay PDF abierto
  if (viewer.url) {
    return (
      <>
        <div className="w-full h-full flex gap-4">
          {/* Columna izquierda - Visor PDF */}
          <div className={`flex flex-col ${showQuiz ? "w-2/3" : "w-full"} transition-all duration-300`}>
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

          {/* Columna derecha - Cuestionario */}
          {showQuiz && (
            <div className="w-1/3 bg-white rounded-lg shadow-xl p-6 overflow-y-auto h-[90vh]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-700">Cuestionario</h3>
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
                      <span>Pregunta {currentQuestion + 1} de {quizQuestions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Pregunta */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-4">
                      {quizQuestions[currentQuestion].question}
                    </h4>
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          className={`w-full text-left p-3 rounded-lg border-2 transition ${
                            answers[currentQuestion] === index
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                        >
                          <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Botones de navegación */}
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
                      disabled={answers[currentQuestion] === undefined}
                    >
                      {currentQuestion === quizQuestions.length - 1 ? "Finalizar" : "Siguiente →"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {/* Resultados */}
                  {score === 10 ? (
                    <div className="mb-6">
                      <div className="text-6xl mb-4 animate-bounce">🎉</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">
                        ¡Felicidades!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Has respondido correctamente las 10 preguntas. ¡Excelente trabajo!
                      </p>
                      <div className="bg-green-100 border-2 border-green-600 rounded-lg p-4 mb-4">
                        <p className="text-4xl font-bold text-green-600">{score}/10</p>
                        <p className="text-sm text-gray-600">Puntuación perfecta</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-2xl font-bold text-orange-600 mb-2">
                        Sigue intentando
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Necesitas responder las 10 preguntas correctamente para aprobar.
                      </p>
                      <div className="bg-orange-100 border-2 border-orange-600 rounded-lg p-4 mb-4">
                        <p className="text-4xl font-bold text-orange-600">{score}/10</p>
                        <p className="text-sm text-gray-600">Preguntas correctas</p>
                      </div>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="space-y-2">
                    <button
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      onClick={handleRestartQuiz}
                    >
                      Intentar de nuevo
                    </button>
                    {score === 10 && (
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
              <div className="text-center">
                {/* Cerrar */}
                <button
                  className="float-right text-gray-400 hover:text-gray-600"
                  onClick={() => setShowBadgeModal(false)}
                >
                  ✕
                </button>

                {/* Trofeo animado */}
                <div className="text-8xl mb-4 animate-pulse">
                  🏆
                </div>

                {/* Título */}
                <h2 className="text-3xl font-bold text-yellow-600 mb-2">
                  ¡Insignia Desbloqueada!
                </h2>

                {/* Nombre de la insignia */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 px-6 rounded-lg mb-4 shadow-lg">
                  <p className="text-xl font-bold">Guerrero Lector</p>
                </div>

                {/* Descripción */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Felicidades, esta insignia es otorgada a los verdaderos <span className="font-bold text-yellow-600">Guerreros Lectores</span> que han demostrado su dedicación y conocimiento al completar perfectamente el cuestionario. ¡Sigue así!
                </p>

                {/* Estadísticas */}
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">10/10</p>
                      <p className="text-sm text-gray-600">Respuestas correctas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">100%</p>
                      <p className="text-sm text-gray-600">Precisión</p>
                    </div>
                  </div>
                </div>

                {/* Botón cerrar */}
                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition font-semibold shadow-lg"
                  onClick={() => setShowBadgeModal(false)}
                >
                  ¡Genial!
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Cuadrícula de libros
  if (!libros.length)
    return <div className="p-4 text-gray-600">No hay libros disponibles.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {libros.map((libro, index) => (
        <div
          key={libro?._id || libro?.id || index}
          className="bg-white rounded-xl shadow-xl p-5 flex flex-col items-center hover:shadow-2xl transition"
        >
          <h3 className="text-lg font-bold text-blue-700 mb-2 text-center">
            {libro.titulo}
          </h3>
          {libro.imagen && (
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="w-full h-48 object-cover rounded mb-4"
            />
          )}
          <p className="text-gray-600 mb-4 text-center">
            {libro.descripcion?.length > 200
              ? `${libro.descripcion.slice(0, 200)}...`
              : libro.descripcion}
          </p>
          <button
            className="mt-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition active:scale-95"
            onClick={() => handleLeerMas(libro)}
          >
            Leer más
          </button>
        </div>
      ))}
    </div>
  );
};

export default Libros;
