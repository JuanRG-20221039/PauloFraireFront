// src/components/AddEventos.jsx
import React, { useState } from 'react';

const AddEventos = () => {
  const [titulo, setTitulo] = useState("Congreso Internacional de Pedagogía 2025");
  const [imagenes, setImagenes] = useState([]);

  // Manejar subida de imágenes
  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map(file => URL.createObjectURL(file));
    setImagenes([...imagenes, ...preview]);
  };

  // Eliminar imagen del arreglo
  const handleEliminarImagen = (index) => {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    setImagenes(nuevas);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="mt-8 w-11/12 max-w-3xl bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Administrar Evento
        </h2>

        {/* Input título */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Título del evento
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            placeholder="Escribe el título del evento"
          />
        </div>

        {/* Subir imágenes */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Subir imágenes
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagenes}
            className="w-full"
          />
        </div>

        {/* Previsualización de imágenes */}
        {imagenes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Imágenes cargadas:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagenes.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => handleEliminarImagen(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-lg shadow hover:bg-red-700"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón guardar (solo diseño) */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
            Guardar Evento
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventos;
