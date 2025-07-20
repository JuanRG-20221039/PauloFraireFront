import { useEffect, useState, useMemo } from "react";
import clientAxios from "../../config/clientAxios";
import useAuth from "../../hooks/useAuth";

const BuscarEstudiante = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [predDesercion, setPredDesercion] = useState(null);
  const [predDesempeno, setPredDesempeno] = useState(null);
  const { token } = useAuth();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    clientAxios
      .get("/estudiantes", config)
      .then(res => setEstudiantes(res.data))
      .catch(err => console.error("Error cargando estudiantes:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEstudiantes = useMemo(() => {
    return searchTerm
      ? estudiantes.filter(est => est.correo.toLowerCase().includes(searchTerm.toLowerCase()))
      : estudiantes;
  }, [searchTerm, estudiantes]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);
  const paginatedEstudiantes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEstudiantes.slice(start, start + itemsPerPage);
  }, [currentPage, filteredEstudiantes]);

  const handleSelectEstudiante = (est) => {
    setSelectedEstudiante(est);
    setPredDesercion(null);
    setPredDesempeno(null);
  };

  const API_URL = import.meta.env.VITE_PRED_URL;

  const handlePredict = async () => {
    if (!selectedEstudiante) return;

    const deserPayload = {
      "PROMEDIO FINAL": selectedEstudiante.promedioFinal,
      "PROMEDIO FINAL REDONDEADO": selectedEstudiante.promedioRedondeado,
      "DESEMPEÑO DEL ALUMNO": selectedEstudiante.desempeno,
      "ASISTENCIAS A PSICOLOGIA": selectedEstudiante.asistenciasPsicologia,
      "ESTADO EMOCIONAL": selectedEstudiante.estadoEmocional,
      "ES RECURSADOR": selectedEstudiante.esRecursador ? 1 : 0
    };

    try {
      const res = await fetch(`${API_URL}/predict_desercion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deserPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`Status ${res.status}: ${JSON.stringify(data)}`);
      setPredDesercion(data);
    } catch (err) {
      console.error("Error al predecir deserción:", err);
      setPredDesercion({ interpretation: 'Error', prediction: null, message: err.message });
    }

    const m = selectedEstudiante.materias;
    const desempenoPayload = {
      "Elementos de Computacion y Logica": m.elementosComputacion,
      "Programacion": m.programacion,
      "Algoritmos y Estructuras de Datos": m.algoritmos,
      "Conceptos de Bases de Datos": m.basesDatos,
      "Arquitectura y Organizacion de Computadoras": m.arquitecturaComputadoras,
      "Paradigmas de Programacion": m.paradigmas,
      "Conceptos de Bases de Datos.1": m.basesDatos,
      "Sistemas Operativos": m.sistemasOperativos,
      "PROMEDIO FINAL": selectedEstudiante.promedioFinal,
      "PROMEDIO FINAL REDONDEADO": selectedEstudiante.promedioRedondeado
    };

    try {
      const res2 = await fetch(`${API_URL}/predict_desempeno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(desempenoPayload)
      });
      const data2 = await res2.json();
      if (!res2.ok) throw new Error(`Status ${res2.status}: ${JSON.stringify(data2)}`);
      setPredDesempeno(data2);
    } catch (err) {
      console.error("Error al predecir desempeño:", err);
      setPredDesempeno({ interpretation: 'Error', prediction: null, message: err.message });
    }
  };

  return (
    <section className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Buscar Estudiante</h1>

      {/* Búsqueda */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar por correo..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="border rounded p-2 w-full max-w-md"
        />
      </div>

      {/* Tabla de estudiantes */}
      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Correo</th>
                <th className="px-4 py-2 border">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEstudiantes.map(est => (
                <tr
                  key={est._id}
                  onClick={() => handleSelectEstudiante(est)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedEstudiante?._id === est._id ? 'bg-green-100' : ''
                  }`}
                >
                  <td className="px-4 py-2 border">{est.nombre}</td>
                  <td className="px-4 py-2 border">{est.correo}</td>
                  <td className="px-4 py-2 border">{est.promedioFinal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-2 gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages || 1}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Detalles del estudiante */}
      {selectedEstudiante && (
        <div className="overflow-x-auto bg-gray-100 p-4 rounded max-w-3xl mx-auto mb-4">
          <h2 className="font-semibold mb-2">Detalles del Estudiante</h2>
          <table className="table-auto w-full text-sm border">
            <tbody>
              {Object.entries(selectedEstudiante).map(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                  return (
                    <tr key={key}>
                      <td className="px-4 py-2 font-medium border align-top">{key}</td>
                      <td className="px-4 py-2 border">
                        <table className="table-auto text-xs w-full">
                          <tbody>
                            {Object.entries(value).map(([subKey, subVal]) => (
                              <tr key={subKey}>
                                <td className="px-2 py-1 border font-medium">{subKey}</td>
                                <td className="px-2 py-1 border">{subVal?.toString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={key}>
                      <td className="px-4 py-2 font-medium border">{key}</td>
                      <td className="px-4 py-2 border">{value?.toString()}</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón de predicción */}
      {selectedEstudiante && (
        <div className="text-center mb-4">
          <button
            onClick={handlePredict}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Generar Predicción
          </button>
        </div>
      )}

      {/* Resultados */}
      {(predDesercion || predDesempeno) && (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Resultados de Predicción</h3>
          {predDesercion && (
            <p>
              Deserción: {predDesercion.interpretation} {predDesercion.prediction !== null ? `(${predDesercion.prediction})` : ''}
              {predDesercion.message && <span className="text-sm text-gray-500"> - {predDesercion.message}</span>}
            </p>
          )}
          {predDesempeno && (
            <p>Desempeño: {predDesempeno.interpretation} ({predDesempeno.prediction})</p>
          )}
        </div>
      )}
    </section>
  );
};

export default BuscarEstudiante;
