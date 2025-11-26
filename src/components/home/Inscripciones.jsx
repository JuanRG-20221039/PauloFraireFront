import React, { useState, useEffect } from "react";
import imgPromocion1 from "../../assets/img/promocion 1.jpeg";
import imgPromocion2 from "../../assets/img/promocion 2.jpeg";
import imgPromocion3 from "../../assets/img/promocion 3.jpeg";
import imgPromocion4 from "../../assets/img/promocion 4.jpeg";
import imgPromocion5 from "../../assets/img/promocion 5.jpeg";
import videoInscripcionesAbiertas from "../../assets/img/Inscripciones-abiertas.mp4";
import clientAxios from "../../config/clientAxios";

const Inscripciones = () => {
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const fetchSlogan = async () => {
        try {
          const { data } = await clientAxios.get("/slogan");
          setSlogan(data.text || "");
        } catch (error) {
          console.error("Error al obtener el eslogan:", error);
        }
      };
      fetchSlogan();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="container mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 my-12 sm:my-16 lg:my-20">
      <h4 className="bg-gradient-to-tr from-green-600 to-indigo-600 text-transparent bg-clip-text font-black text-center text-3xl sm:text-5xl md:text-6xl leading-tight break-words pt-2 sm:pt-4">
        {slogan}
      </h4>
      <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 shadow rounded-lg">
        {/* Imagen Promoción 4 */}
        <div className="flex justify-center items-center p-2 sm:p-4">
          <img
            src={imgPromocion4}
            alt="Imagen Promocion 4"
            className="w-full h-auto rounded-md object-contain"
          />
        </div>

        {/* Imagen Promoción 1 */}
        <div className="flex justify-center items-center p-2 sm:p-4">
          <img
            src={imgPromocion5}
            alt="Imagen Promocion 1"
            className="w-full h-auto rounded-md object-contain"
          />
        </div>

        {/* Imagen Promoción 2 */}
        <div className="flex justify-center items-center p-2 sm:p-4">
          <img
            src={imgPromocion1}
            alt="Imagen Promocion 2"
            className="w-full h-auto rounded-md object-contain"
          />
        </div>

        {/* Imagen Promoción 5 */}
        <div className="flex justify-center items-center p-2 sm:p-4">
          <img
            src={imgPromocion2}
            alt="Imagen Promocion 5"
            className="w-full h-auto rounded-md object-contain"
          />
        </div>

        {/* Video */}
        <div className="flex justify-center items-center bg-gradient-to-tr from-fuchsia-200 to-indigo-600 p-2 sm:p-4">
          <video
            className="w-full h-auto rounded-md"
            src={videoInscripcionesAbiertas}
            controls
            playsInline
          />
        </div>

        {/* Imagen Promoción 3 */}
        <div className="flex justify-center items-center p-2 sm:p-4">
          <img
            src={imgPromocion3}
            alt="Imagen Promocion 3"
            className="w-full h-auto rounded-md object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Inscripciones;
