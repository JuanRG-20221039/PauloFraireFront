import React, { useState, useEffect } from 'react';
import { CiLink } from "react-icons/ci";
import { FaExternalLinkSquareAlt, FaRegFilePdf } from "react-icons/fa";
import clientAxios from '../config/clientAxios';

const ContextContemporaneo = () => {
  const [contextData, setContextData] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const [contextRes, pdfsRes] = await Promise.all([
          clientAxios.get('/contexto-contemporaneo', { signal: controller.signal }),
          clientAxios.get('/pdfs-cc', { signal: controller.signal })
        ]);
        setContextData(contextRes.data[0] || null);
        setPdfs(pdfsRes.data || []);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Fetch error:', err);
          setError('No se pudo cargar el contenido.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!contextData) {
    return (
      <div className="text-center p-4">
        No hay contenido disponible.
      </div>
    );
  }

  const pdfsTipo1 = pdfs.filter(pdf => pdf.tipo === 1);
  const pdfsTipo0 = pdfs.filter(pdf => pdf.tipo === 0);

  const gradientClasses = [
    'bg-gradient-to-tr from-purple-300 to-blue-200',
    'bg-gradient-to-tr from-orange-300 to-yellow-200',
    'bg-gradient-to-tr from-pink-300 to-yellow-100',
    'bg-gradient-to-tr from-blue-300 to-sky-100',
    'bg-gradient-to-tr from-green-300 to-yellow-100',
    'bg-gradient-to-tr from-red-200 to-red-300'
  ];

  return (
    <section className="md:container mx-auto my-10 p-2">
      {/* Título */}
      <h1 className="text-center text-5xl font-extrabold uppercase text-slate-700 m-2">
        {contextData.title}
      </h1>

      {/* Frase principal */}
      <div className="container mx-auto max-w-4xl my-10">
        <p className="text-center text-lg font-bold uppercase text-slate-700 mx-2">
          {contextData.mainSection}
          <br />
          <span className="font-bold flex justify-center p-2 sm:justify-end">
            {contextData.author}
          </span>
        </p>
      </div>

      <hr />

      {/* Tarjeta principal */}
      <div className="flex justify-center my-10">
        <div className="p-6 rounded-lg bg-gradient-to-tr from-green-300 to-red-300 via-yellow-300 shadow-lg w-full max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            {contextData.article}
          </h2>
          <p className="mb-4">{contextData.articleDescription}</p>
          <a
            href={contextData.mainLink}
            className="inline-flex items-center gap-2 text-base font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CiLink className="h-6 w-6" />
            {contextData.mainLinkAutor}
            <FaExternalLinkSquareAlt className="h-6 w-6" />
          </a>
        </div>
      </div>

      {/* PDFs Tipo 1 */}
      {pdfsTipo1.length > 0 && (
        <div className="container mx-auto max-w-5xl my-10">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pdfsTipo1.map(pdf => (
              <a
                key={pdf._id}
                href={pdf.archivo}
                className="block p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:scale-105 transform transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {pdf.imagen && (
                  <img
                    src={pdf.imagen}
                    alt={pdf.nombre}
                    className="mb-4 w-full h-48 object-cover rounded"
                  />
                )}
                <h3 className="text-2xl font-bold mb-2">{pdf.nombre}</h3>
                <p className="text-sm">{pdf.descripcion}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <hr />

      {/* Links Secundarios */}
      <div className="container mx-auto my-10">
        <div className="grid md:grid-cols-2 gap-4">
          {contextData.secondaryLinks?.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className="flex items-center p-4 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiLink className="h-6 w-6 text-blue-400 mr-2" />
              <span className="flex-grow font-medium">{link.name}</span>
              <FaExternalLinkSquareAlt className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>

      {/* PDFs Tipo 0 */}
      {pdfsTipo0.length > 0 && (
        <div className="container mx-auto max-w-5xl my-10">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pdfsTipo0.map((pdf, idx) => (
              <a
                key={pdf._id}
                href={pdf.archivo}
                className={`flex flex-col items-center p-6 rounded-lg shadow-lg transform hover:scale-105 transition ${gradientClasses[idx % gradientClasses.length]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaRegFilePdf className="text-4xl text-red-600 mb-2" />
                <h3 className="text-2xl font-bold mb-2">{pdf.nombre}</h3>
                <p className="text-sm text-center">{pdf.descripcion}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Imagen final */}
      <div className="container mx-auto my-10 max-w-5xl flex justify-center">
        <img
          src="https://assets.isu.pub/document-structure/221022193407-97668cb58b1c5b49c96732ab70a64e6c/v1/d3330072c89656bc5ad6e65908a5638e.jpeg"
          alt="Imagen descriptiva"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    </section>
  );
};

export default ContextContemporaneo;
