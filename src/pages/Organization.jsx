import React, { useEffect, useState } from "react";
import clientAxios from "../config/clientAxios";
import Breadcrumbs from "../components/navbar/Breadcrumbs";
import { motion } from "framer-motion";
import Zonas from "./Zonas";

const Organization = () => {
  const breadcrumbs = ["Organización"];
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para agrupar en filas con lógica especial
  const groupIntoRows = (staffData) => {
    if (staffData.length === 0) return [];

    const rows = [];

    // Primera fila: solo el order 1 (Rector) - centrado
    if (staffData.length > 0) {
      rows.push([staffData[0]]);
    }

    // Resto de filas: de 3 en 3
    for (let i = 1; i < staffData.length; i += 3) {
      rows.push(staffData.slice(i, i + 3));
    }

    return rows;
  };

  // Variantes de animación para las filas
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  // Variantes de animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await clientAxios.get("/getstaff");
        setStaff(data);
      } catch (err) {
        console.error("Error al obtener autoridades:", err);
        setError("No se pudo cargar la información del personal.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mb-4"></div>
          <p className="text-slate-700 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const rows = groupIntoRows(staff);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="flex justify-center my-5">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>

      <div className="max-w-6xl container mx-auto mt-10 px-4 pb-10">
        {staff.length > 0 ? (
          <div className="flex flex-col items-center gap-0">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative w-full">
                {/* Líneas de conexión - SOLO en pantallas grandes (sm y superiores) y SOLO entre fila 0 (Rector) y fila 1 */}
                {rowIndex === 1 && row.length > 0 && (
                  <div className="hidden sm:block absolute w-full h-12 -top-12 left-0 z-0">
                    {/* Línea vertical desde el centro superior */}
                    <div className="absolute left-1/2 top-0 w-0.5 h-6 bg-teal-400 -translate-x-1/2"></div>

                    {/* Línea horizontal que conecta los puntos */}
                    {row.length === 3 && (
                      <div
                        className="absolute top-6 h-0.5 bg-teal-400"
                        style={{
                          left: "16.66%",
                          width: "66.68%",
                        }}
                      ></div>
                    )}
                    {row.length === 2 && (
                      <div
                        className="absolute top-6 h-0.5 bg-teal-400"
                        style={{
                          left: "25%",
                          width: "50%",
                        }}
                      ></div>
                    )}
                    {row.length === 1 && (
                      <div
                        className="absolute top-6 h-0.5 bg-teal-400"
                        style={{
                          left: "50%",
                          width: "0%",
                        }}
                      ></div>
                    )}

                    {/* Líneas verticales hacia cada tarjeta */}
                    {row.map((_, personIndex) => {
                      const totalInRow = row.length;
                      let leftPosition;

                      if (totalInRow === 1) {
                        leftPosition = "50%";
                      } else if (totalInRow === 2) {
                        leftPosition = personIndex === 0 ? "25%" : "75%";
                      } else {
                        // Para 3 elementos
                        if (personIndex === 0) leftPosition = "16.66%";
                        else if (personIndex === 1) leftPosition = "50%";
                        else leftPosition = "83.34%";
                      }

                      return (
                        <div
                          key={personIndex}
                          className="absolute w-0.5 h-6 bg-teal-400"
                          style={{
                            left: leftPosition,
                            top: "24px",
                            transform: "translateX(-50%)",
                          }}
                        ></div>
                      );
                    })}
                  </div>
                )}

                <motion.div
                  custom={rowIndex}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`grid gap-6 w-full justify-items-center items-stretch relative z-10 ${
                    rowIndex === 0
                      ? "grid-cols-1 mb-12"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12"
                  }`}
                  style={{
                    alignItems: "stretch",
                  }}
                >
                  {row.map((person) => (
                    <motion.div
                      key={person._id}
                      variants={cardVariants}
                      className="w-full max-w-sm flex h-full"
                    >
                      {/* Tarjeta con diseño horizontal: círculo sobresaliendo + texto */}
                      {/* En móvil: centrado con imagen arriba del card */}
                      <div className="relative w-full">
                        {/* Versión MÓVIL - imagen centrada arriba */}
                        <div className="sm:hidden flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400 bg-gradient-to-br from-teal-100 to-blue-100 shadow-lg">
                              <img
                                src={
                                  person.photo ||
                                  "https://via.placeholder.com/120"
                                }
                                alt={`${person.name} ${person.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Badge memorial si aplica */}
                            {person.isMemorial && (
                              <div className="absolute -top-1 -right-1 w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                <span className="text-white text-sm">🕊️</span>
                              </div>
                            )}
                          </div>

                          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 w-full min-h-[200px] h-full text-center whitespace-normal break-all flex flex-col justify-center">
                            <h3 className="text-base font-bold text-slate-800 leading-tight">
                              {person.name}
                            </h3>
                            <h4 className="text-base font-semibold text-slate-700 leading-tight mt-0.5">
                              {person.lastName}
                            </h4>
                            <p className="text-sm text-teal-600 font-medium mt-1 leading-tight">
                              {person.position}
                            </p>
                            {person.isMemorial && person.memorialText && (
                              <p className="text-xs text-slate-500 italic mt-1">
                                {person.memorialText}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Versión ESCRITORIO - imagen sobresaliendo a la izquierda */}
                        <div className="hidden sm:flex items-stretch pl-16 h-full">
                          <div className="absolute left-0 z-10">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-400 bg-gradient-to-br from-teal-100 to-blue-100 shadow-lg">
                                <img
                                  src={
                                    person.photo ||
                                    "https://via.placeholder.com/120"
                                  }
                                  alt={`${person.name} ${person.lastName}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {person.isMemorial && (
                                <div className="absolute -top-1 -right-1 w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                                  <span className="text-white text-sm">🕊️</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 pl-20 w-full min-h-[200px] h-full flex items-start whitespace-normal break-all">
                            <div className="flex-grow text-left whitespace-normal break-all">
                              <h3 className="text-base font-bold text-slate-800 leading-tight">
                                {person.name}
                              </h3>
                              <h4 className="text-base font-semibold text-slate-700 leading-tight mt-0.5">
                                {person.lastName}
                              </h4>
                              <p className="text-sm text-teal-600 font-medium mt-1 leading-tight">
                                {person.position}
                              </p>
                              {person.isMemorial && person.memorialText && (
                                <p className="text-xs text-slate-500 italic mt-1">
                                  {person.memorialText}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg
              className="w-20 h-20 text-slate-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-slate-600 text-lg">
              No hay autoridades registradas.
            </p>
          </div>
        )}
      </div>
      {/* Zonas: sección al final */}
      <Zonas />
    </div>
  );
};

export default Organization;
