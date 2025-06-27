import React, { useEffect, useState } from "react";
import clientAxios from "../config/clientAxios";

const TarjetaPolitica = ({ expanded, onExpand }) => {
  const [politicas, setPoliticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  useEffect(() => {
    const fetchPoliticas = async () => {
      try {
        const response = await clientAxios.get("/politicas/vigente");
        if (response.data) {
          setPoliticas([response.data]);
        } else {
          setPoliticas([]);
        }
      } catch (err) {
        setError("Error al cargar las políticas");
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticas();
    const interval = setInterval(() => {
      fetchPoliticas();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando políticas...</p>;
  if (error) return <p>{error}</p>;
  if (politicas.length === 0 || !politicas.some((p) => p.isActive)) {
    return <p className="text-center text-xl text-gray-500">Pronto subiremos las política!</p>;
  }

  const politica = politicas[0]; // solo mostramos una vigente

  return (
    <div className={`bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition duration-200 transform hover:scale-105 overflow-hidden max-w-full break-words ${expanded ? 'w-full' : ''}`}>
      <h3 className="text-lg font-bold text-blue-600 mb-2">{politica.title}</h3>

      <p className="text-gray-600 mb-4 break-words overflow-auto max-h-96">
        {expanded ? politica.content : `${politica.content.substring(0, 100)}...`}
      </p>

      <p className="text-gray-500 text-sm">{formatDate(politica.createdAt)}</p>

      <button
        onClick={onExpand}
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {expanded ? "Ver menos" : "Ver detalles"}
      </button>
    </div>
  );
};

export default TarjetaPolitica;
