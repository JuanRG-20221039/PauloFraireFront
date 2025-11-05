import React, { useEffect, useState } from "react";
import clientAxios from "../config/clientAxios";

const Zonas = () => {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const { data } = await clientAxios.get("/zonas");
        setZonas(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar las zonas");
      } finally {
        setLoading(false);
      }
    };
    fetchZonas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 mt-6 mb-12">
      <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-slate-800 mb-8">
        CIRCULOS DE ESTUDIO ZONA NORTE DE VER.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {zonas.map((z) => (
          <div
            key={z._id}
            className="relative bg-white shadow-sm rounded-md p-6 border border-slate-200"
          >
            {/* línea decorativa en el borde izquierdo */}
            <span className="absolute left-4 top-6 bottom-6 w-1 bg-slate-800"></span>

            <div className="pl-6 whitespace-normal break-words">
              <p className="text-slate-700 font-bold uppercase tracking-wide mb-2 whitespace-normal break-words">
                {z.lugar}
              </p>
              <p className="text-slate-900 font-extrabold text-lg whitespace-normal break-words">
                Dr. ECDP: {z.encargado}
              </p>
              <p className="text-slate-800 font-bold mt-1 whitespace-normal break-words">
                Cel.: {z.telefono}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Zonas;
