import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CongresoLaHabana2025 from '../../assets/img/CongresoLaHabana2025.png';
import imagen1 from '../../assets/img/pedagogia2025/1.jpg';
import imagen2 from '../../assets/img/pedagogia2025/2.jpg';
import imagen3 from '../../assets/img/pedagogia2025/3.jpg';
import imagen4 from '../../assets/img/pedagogia2025/4.jpg';
import imagen5 from '../../assets/img/pedagogia2025/5.jpg';
import imagen6 from '../../assets/img/pedagogia2025/6.jpg';
import imagen7 from '../../assets/img/pedagogia2025/7.jpg';
import imagen8 from '../../assets/img/pedagogia2025/8.jpg';
import imagen9 from '../../assets/img/pedagogia2025/9.jpg';

const Eventos = () => {
  const importedImages = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7, imagen8, imagen9];

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full flex justify-center">
      <div className="mt-8 w-11/12">
        <div className='flex w-full justify-center mt-10'>
          <img 
            src={CongresoLaHabana2025} 
            alt="Congreso La Habana 2025" 
            className='w-11/12 rounded-[20px]'
          />
        </div>
        <h1 className="text-center mt-8 mb-3 font-bold text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
          Congreso Internacional de Pedagogía 2025
        </h1>
        <Slider {...carouselSettings}>
          {importedImages.map((image, index) => (
            <div key={index} className="px-4">
              <img
                src={image}
                alt={`pedagogia2025-${index}`}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </Slider>
        <p className="text-center mt-[32px] text-[25px] font-semibold text-gray-700">
          El Centro Regional de Educación Superior Paulo Freire, presente en la inauguración del Congreso Internacional de Pedagogia 2025, en la Habana, Cuba. Participan 32 países con el objetivo de intercambiar políticas públicas, estrategias y recomendaciones para mejorar la práctica educativa en el mundo.
        </p>
      </div>
    </div>
  );
};

export default Eventos;