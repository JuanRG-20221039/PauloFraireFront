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
    <section className="max-w-[1300px] py-16 mx-auto my-20">
      <h4 className="bg-gradient-to-tr from-green-600 to-indigo-600 text-transparent bg-clip-text font-black text-center text-7xl leading-relaxed pt-4">
        {slogan}
      </h4>
      <div className="mt-20 grid md:grid-cols-2 shadow rounded-lg grid-cols-1">
        {/* Imagen Promoción 4 */}
        <div className="flex justify-center items-center">
          <img src={imgPromocion4} alt="Imagen Promocion 4" />
        </div>

        {/* Imagen Promoción 1 */}
        <div className="flex justify-center items-center">
          <img src={imgPromocion5} alt="Imagen Promocion 1" />
        </div>

        {/* Imagen Promoción 2 */}
        <div className="flex justify-center items-center">
          <img src={imgPromocion1} alt="Imagen Promocion 2" />
        </div>

        {/* Imagen Promoción 5 */}
        <div className="flex justify-center items-center">
          <img src={imgPromocion2} alt="Imagen Promocion 5" />
        </div>

        {/* Video */}
        <div className="flex justify-center items-center bg-gradient-to-tr from-fuchsia-200 to-indigo-600">
          <video
            className="w-auto rounded-sm"
            src={videoInscripcionesAbiertas}
            controls
          />
        </div>

        {/* Imagen Promoción 3 */}
        <div className="flex justify-center items-center">
          <img src={imgPromocion3} alt="Imagen Promocion 3" />
        </div>
      </div>
    </section>
  );
};

export default Inscripciones;
