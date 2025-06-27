import React, { useEffect, useState } from "react";
import clientAxios from "../config/clientAxios";

const TarjetaDeslinde = ({ expanded, onExpand }) => {
  const [deslindes, setDeslindes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  useEffect(() => {
    const fetchDeslindes = async () => {
      try {
        const response = await clientAxios.get("/deslindes/vigente");
        if (response.data) {
          setDeslindes([response.data]);
        } else {
          setDeslindes([]);
        }
      } catch (err) {
        setError("Error al cargar los deslindes");
      } finally {
        setLoading(false);
      }
    };

    fetchDeslindes();
    const interval = setInterval(fetchDeslindes, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando deslindes...</p>;
  if (error) return <p>{error}</p>;
  if (deslindes.length === 0 || !deslindes.some(d => d.isActive)) {
    return <p className="text-center text-xl text-gray-500">Pronto subiremos el deslinde!</p>;
  }

  const deslinde = deslindes[0]; // solo mostramos uno vigente

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between transition duration-200 transform hover:scale-105 overflow-hidden max-w-full break-words ${expanded ? 'w-full' : ''}`}
    >
      <h3 className="text-lg font-bold text-blue-600 mb-2">{deslinde.title}</h3>
      <p className="text-gray-600 mb-2 break-words overflow-auto max-h-96">
        {expanded ? deslinde.content : `${deslinde.content.substring(0, 100)}...`}
      </p>
      <p className="text-gray-500 text-sm">{formatDate(deslinde.createdAt)}</p>
      <button
        onClick={onExpand}
        className="mt-auto bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {expanded ? "Ver menos" : "Ver detalles"}
      </button>
    </div>
  );
};

export default TarjetaDeslinde;
