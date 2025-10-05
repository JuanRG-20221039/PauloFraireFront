import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { logos } from "../../data/Data";
import clientAxios from "../../config/clientAxios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import inscripciones2025 from "../../assets/img/inscripciones2025.jpeg";
import CongresoLaHabana2025 from "../../assets/img/CongresoLaHabana2025.png";
// Importa las imágenes de la carpeta
import imagen1 from "../../assets/img/pedagogia2025/1.jpg";
import imagen2 from "../../assets/img/pedagogia2025/2.jpg";
import imagen3 from "../../assets/img/pedagogia2025/3.jpg";
import imagen4 from "../../assets/img/pedagogia2025/4.jpg";
import imagen5 from "../../assets/img/pedagogia2025/5.jpg";
import imagen6 from "../../assets/img/pedagogia2025/6.jpg";
import imagen7 from "../../assets/img/pedagogia2025/7.jpg";
import imagen8 from "../../assets/img/pedagogia2025/8.jpg";
import imagen9 from "../../assets/img/pedagogia2025/9.jpg";

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(inscripciones2025);
  const [isFirstImage, setIsFirstImage] = useState(true);

  // Array de imágenes importadas
  const importedImages = [
    imagen1,
    imagen2,
    imagen3,
    imagen4,
    imagen5,
    imagen6,
    imagen7,
    imagen8,
    imagen9,
  ];

  useEffect(() => {
    const getHero = async () => {
      try {
        const response = await clientAxios.get("/customsize");
        const imagenes = response.data.map((item) => item.slideImg);
        setImages(imagenes);
      } catch (error) {
        console.log(error);
      }
    };
    getHero();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFirstImage && images.length > 0) {
        setCurrentImage(images[0]);
        setIsFirstImage(false);
      } else {
        const index = images.indexOf(currentImage);
        setCurrentImage(images[(index + 1) % images.length]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImage, images, isFirstImage]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Mejor UX en móvil
  };

  return (
    <div className="w-full mx-auto home bg-gradient-to-t to-green-100 from-white py-8 md:py-16">
      {/* Primer bloque - Logotipo y título principal */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Columna info */}
        <div className="flex-1 min-w-[250px] max-w-xl w-full px-4">
          <div className="flex justify-center items-center mb-4">
            <img
              src={logos[0]}
              className="w-24 sm:w-32 md:w-40"
              alt="logo"
              loading="lazy"
            />
          </div>
          <div className="text-center space-y-2 mb-5">
            <p className="uppercase text-xl sm:text-2xl md:text-3xl font-black text-gray-600">
              Posgrados Validados{" "}
              <span className="text-teal-700">ante la usicamm</span>
            </p>
            <div className="my-2 flex justify-center">
              <img
                src={logos[6]}
                className="w-20 sm:w-24 md:w-32"
                alt="usicamm"
                loading="lazy"
              />
            </div>
            <p className="uppercase text-lg sm:text-xl md:text-2xl font-black text-gray-600">
              RVOE de la SEP y SEV
            </p>
            <div className="flex justify-center gap-3">
              <img
                src={logos[5]}
                className="w-20 sm:w-24 md:w-32"
                alt="SEP"
                loading="lazy"
              />
              <img
                src={logos[7]}
                className="w-20 sm:w-24 md:w-32"
                alt="SEV"
                loading="lazy"
              />
            </div>
          </div>
          <div className="mt-4 mx-2 text-slate-600 space-y-2 text-left sm:text-center">
            <p className="text-lg sm:text-xl font-semibold">
              CLAVE DEL CENTRO DE TRABAJO:
              <span className="font-normal"> 30PSU0029L</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold">
              Clave de la Institución
              <span className="font-normal"> 30MSU0027Q</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold">
              Acuerdo NO.
              <span className="font-normal"> ES139/2005</span>
            </p>
            <p className="text-lg sm:text-xl font-semibold">
              Modalidad:
              <span className="font-normal"> No Escolarizada</span>
            </p>
            <p className="text-base text-orange-600 font-bold mt-3">
              "En esta vida no solo los talentos son los que triunfan, también
              las voluntades".
            </p>
          </div>
        </div>
        {/* Columna imagen hero */}
        <div className="flex-1 flex justify-center items-center w-full min-w-[220px] px-2 mt-4 md:mt-0">
          {currentImage && (
            <img
              src={currentImage}
              alt="imagen hero"
              className="w-full max-w-[450px] h-auto max-h-[350px] sm:max-w-[600px] sm:max-h-[400px] md:max-w-[800px] md:max-h-[500px] object-cover rounded-md shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Imagen Congreso La Habana */}
      <div className="flex w-full justify-center mt-8 sm:mt-12">
        <img
          src={CongresoLaHabana2025}
          alt="Congreso La Habana 2025"
          className="w-11/12 max-w-3xl rounded-2xl shadow"
        />
      </div>

      {/* Bloque del slider/carrusel y descripción */}
      <div className="w-full flex justify-center">
        <div className="mt-6 w-full max-w-4xl px-2">
          <h1 className="text-center mt-4 mb-3 font-bold text-3xl sm:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
            Congreso Internacional de Pedagogía 2025
          </h1>
          <Slider {...carouselSettings}>
            {importedImages.map((image, index) => (
              <div key={index} className="px-1 sm:px-2">
                <img
                  src={image}
                  alt={`pedagogia2025-${index}`}
                  className="w-full h-[200px] sm:h-[350px] md:h-[400px] object-cover rounded-lg shadow-lg"
                />
              </div>
            ))}
          </Slider>
          <p className="text-center mt-8 text-md sm:text-lg md:text-xl font-semibold text-gray-700">
            El Centro Regional de Educación Superior Paulo Freire, presente en
            la inauguración del Congreso Internacional de Pedagogía 2025, en la
            Habana, Cuba. Participan 32 países con el objetivo de intercambiar
            políticas públicas, estrategias y recomendaciones para mejorar la
            práctica educativa en el mundo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
