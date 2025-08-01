import React, { useEffect, useState } from "react";
import { SiOnlyoffice } from "react-icons/si";
import { logos } from "../../data/Data.jsx";
import clientAxios from "../../config/clientAxios";

const Welcome = () => {
  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const response = await clientAxios.get("/institucional");
        setContenido(response.data); // ya devuelve un solo objeto
      } catch (err) {
        console.error("Error al cargar contenido:", err);
        setError("Error al cargar el contenido institucional.");
      } finally {
        setLoading(false);
      }
    };

    fetchContenido();
  }, []);

  return (
    <div className="mt-5 bg-gray-200 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="md:col-span-1 border-solid border-white space-y-5 flex flex-col justify-center items-center bg-hero overflow-hidden">
          <div className="text-xl w-full uppercase tracking-wide bg-slate-100 justify-center flex items-center">
            <img src={logos[4]} alt="Logo principal" className="h-24 w-auto" />
          </div>
          {contenido?.videoUrl ? (
            <video
              src={contenido.videoUrl}
              controls
              className="w-full max-w-[600px] h-[500px] rounded-lg shadow-lg object-contain"
            />
          ) : (
            <p className="text-white">No se encontró video institucional.</p>
          )}
        </div>
        <div className="p-10 max-w-full">
          {loading ? (
            <p>Cargando contenido...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : contenido ? (
            <>
              <div className="text-4xl font-bold capitalize lg:text-5xl text-center border-b-4 border-orange-600 p-2">
                {contenido.tituloPrincipal}
              </div>

              <div className="my-5 text-slate-700">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center mb-4"
                    id={`seccion-${i}`}
                  >
                    <div className="w-full">
                      <h2 className="font-bold text-xl">
                        {contenido[`subtitulo${i}`]}
                      </h2>
                      <p className="leading-relaxed mt-5 text-lg text-justify break-words max-w-prose">
                        {contenido[`contenido${i}`]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No hay contenido disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
