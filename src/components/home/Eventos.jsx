// src/pages/Eventos.jsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import clientAxios from "../../config/clientAxios";

const Eventos = () => {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const { data } = await clientAxios.get("/geteventos"); // <-- ruta del backend
        if (data && data.length > 0) {
          setEvento(data[data.length - 1]); // tomar el último evento registrado
        }
      } catch (error) {
        console.error("Error al cargar eventos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center mt-20">
        <p className="text-xl text-gray-600">Cargando evento...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="w-full flex justify-center mt-20">
        <p className="text-xl text-gray-600">
          No hay eventos registrados por el momento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center mt-11">
      <div className="mt-8 w-11/12">
        {/* Título */}
        <h1 className="text-center mt-8 mb-3 font-bold text-6xl leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
          {evento?.title || "Agregar un Evento"}
        </h1>

        {/* Carrusel */}
        {evento.images && evento.images.length > 1 && (
          <Slider {...carouselSettings}>
            {evento.images.map((image, index) => (
              <div key={index} className="px-4">
                <img
                  src={image.url} // revisa si tu backend manda { url } o directamente la ruta
                  alt={`${evento.title}-${index}`}
                  className="w-full h-[600px] object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Slider>
        )}

        {/* Descripción */}
        <p className="text-center mt-[32px] text-[25px] font-semibold text-gray-700">
          {evento.description}
        </p>
      </div>
    </div>
  );
};

export default Eventos;
