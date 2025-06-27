import React, { useEffect, useState } from "react";
import clientAxios from "../config/clientAxios";

const TarjetaTermino = ({ expanded, onExpand }) => {
  const [terminos, setTerminos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const response = await clientAxios.get("/Terminos/vigente");
        if (response.data) {
          setTerminos([response.data]);
        } else {
          setTerminos([]);
        }
      } catch (err) {
        setError("Error al cargar los términos");
      } finally {
        setLoading(false);
      }
    };

    fetchTerminos();
    const interval = setInterval(fetchTerminos, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando términos...</p>;
  if (error) return <p>{error}</p>;
  if (terminos.length === 0 || !terminos.some(t => t.isActive)) {
    return <p className="text-center text-xl text-gray-500">Pronto subiremos los términos!</p>;
  }

  const termino = terminos[0]; // solo uno vigente

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition duration-200 transform hover:scale-105 overflow-hidden max-w-full break-words ${expanded ? "w-full" : ""}`}
    >
      <h3 className="text-lg font-bold text-blue-600 mb-2">{termino.title}</h3>
      <p className="text-gray-600 mb-2 break-words overflow-auto max-h-96">
        {expanded ? termino.content : `${termino.content.substring(0, 100)}...`}
      </p>
      <p className="text-gray-500 text-sm">{formatDate(termino.createdAt)}</p>
      <button
        onClick={onExpand}
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {expanded ? "Ver menos" : "Ver detalles"}
      </button>
    </div>
  );
};

export default TarjetaTermino;
