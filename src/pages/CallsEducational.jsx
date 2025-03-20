//CallsEducational.jsx
import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/navbar/Breadcrumbs";
import { FiCheck } from "react-icons/fi";
import clientAxios from "../config/clientAxios";

const CallsEducational = () => {
  const [becas, setBecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState();
  const [descripcion, setDescripcion] = useState();

  const [updateSection, setUpdateSection] = useState(false); // Control de actualización de la sección
  const breadcrumbs = ["Convocatorias"];

  useEffect(() => {
    const fetchBecas = async () => {
      try {
        const response = await clientAxios.get("/getbecas");
        setBecas(response.data);

        const responseGeneral = await clientAxios.get("/becas");
        if (responseGeneral.data) {
          setTitulo(responseGeneral.data.titulo);
          setDescripcion(responseGeneral.data.descripcion);
        }
      } catch (error) {
        console.error("Error al obtener becas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBecas();
  }, [updateSection]);

  

  if (loading) return <p className="text-center py-5">Cargando becas...</p>;

// Función para detectar y convertir URLs en enlaces clicables
const parseTextWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
};

return (
  <div>
    <Breadcrumbs breadcrumbs={breadcrumbs} />
    <div className="mx-auto">
      <h1 className="font-extrabold text-4xl text-center uppercase mb-10">
        {titulo}
      </h1>
      <div className="p-5">
        <p className="flex justify-center items-center mx-auto mb-4 text-lg leading-relaxed max-w-3xl text-center">
          {parseTextWithLinks(descripcion)}
        </p>

        {becas.map((beca, index) => (
          <div
            key={beca._id}
            className={`pt-20 pb-16 p-4 ${index % 2 === 0 ? "bg-gradient-to-tr from-indigo-500 to-purple-600" : "bg-gradient-to-br from-pink-400 to-rose-600"}`}
          >
            <div className="flex flex-wrap gap-4">
              {index % 2 !== 0 && (
                <div className="flex-1 basis-[20rem]">
                  <div className="relative">
                    <img
                      src={beca.imageUrl}
                      alt={beca.title}
                      className="rounded-lg w-full sm:h-full object-cover object-center"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 basis-[18rem] text-white">
                <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-800 dark:text-white">
                  {beca.title}
                </h1>

                {/* Mostrar descripción con enlaces */}
                <p className="mt-3">{parseTextWithLinks(beca.description)}</p>

                {/* Mostrar requisitos con enlaces o lista */}
                {beca.requisitos && (
      <div className="mt-4">
        {/* 
          Siempre dividimos requisitos en líneas y mostramos cada una 
          en un <li> con el ícono y parseamos enlaces.
        */}
        <ul className="mt-2 ml-5">
          {beca.requisitos.split("\n").map((req, i) => (
            <li key={i} className="flex items-center gap-2">
              <div className="rounded-full p-2 text-orange-600 !bg-orange-400/20">
                <FiCheck />
              </div>
              {/* Con parseTextWithLinks convertimos cualquier URL en enlace */}
              {parseTextWithLinks(req)}
            </li>
          ))}
        </ul>
      </div>
    )}

                {/* Mostrar PDFs */}
                <div className="mt-4">
                  <ul className="mt-2 ml-5 list-disc">
                    {beca.pdfs.map((pdf, i) => (
                      <li key={i}>{pdf.name}</li>
                    ))}
                  </ul>
                </div>

                {beca.pdfs.length > 0 && (
                  <a
                    href={beca.pdfs[0].url}
                    className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300 hover:cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar Formato
                  </a>
                )}
              </div>

              {index % 2 === 0 && (
                <div className="flex-1 basis-[20rem]">
                  <div className="relative">
                    <img
                      src={beca.imageUrl}
                      alt={beca.title}
                      className="rounded-lg w-full sm:h-[400px] object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default CallsEducational;
