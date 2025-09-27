import React, { useEffect, useState } from 'react';
import { logos } from "../../data/Data";
import clientAxios from '../../config/clientAxios';
import inscripciones2025 from '../../assets/img/inscripciones2025.jpeg';

const Hero = () => {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(inscripciones2025);
  const [isFirstImage, setIsFirstImage] = useState(true);

  useEffect(() => {
    const getHero = async () => {
      try {
        const response = await clientAxios.get('/customsize');
        const imagenes = response.data.map(item => item.slideImg);
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

  return (
    <div className="w-full mx-auto home bg-gradient-to-t to-green-100 from-white py-16 -mb-32">
      <div className="md:flex items-center justify-center">
        <div className='flex-1 basis-[20rem]'>
          <div className="flex justify-center space-y-5 flex-col items-center sm:flex-row mx-auto p-4 item gap-4">
            <img src={logos[0]} className='w-40' loading='lazy' />
          </div>
          <div className="text-center">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <p className="uppercase text-3xl font-black text-gray-600">
                  Posgrados Validados <span className="text-teal-700">ante la usicamm</span>
                </p>
              </div>
              <img src={logos[6]} className="w-32 inline-block" loading="lazy" />
            </div>
            <div className='justify-center flex sm:flex-row'>
              <p className='uppercase text-3xl font-black text-gray-600'>RVOE de la SEP y SEV</p>
            </div>
            <div className='flex justify-center'>
              <img src={logos[5]} className='w-32' loading='lazy' />
              <img src={logos[7]} className='w-32' loading='lazy' />
            </div>
            <div className='mt-5 mx-4 text-slate-600 space-y-3'>
              <p className='sm:text-xl text-xl font-semibold leading-relaxed'>
                CLAVE DEL CENTRO DE TRABAJO:
                <span className='font-normal'> 30PSU0029L</span>
              </p>
              <p className='sm:text-xl text-2xl font-semibold leading-snug'>
                Clave de la Institución
                <span className='font-normal'> 30MSU0027Q</span>
              </p>
              <p className='sm:text-xl text-2xl font-semibold leading-snug'>
                Acuerdo NO.
                <span className='font-normal'> ES139/2005</span>
              </p>
              <p className='sm:text-xl text-2xl font-semibold leading-snug'>
                Modalidad:
                <span className='font-normal'>No Escolarizada</span>
              </p>
              <p className="text-lg text-gray font-bold mt-5 mx-4 text-center uppercase text-orange-600">
                "En esta vida no solo los talentos son los que triunfan, también las voluntades".
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 basis-[20rem] justify-center items-center mt-2 animate-fade lg:mx-4 sm:mx-8">
          {currentImage && <img src={currentImage} alt="imagen hero" className='w-[800px] h-[500px] sm:w-[600px] sm:h-[400px] xs:w-[400px] xs:h-[300px] object-cover object-top shadow-sm rounded-sm' />}
        </div>
      </div>
    </div>
  );
};

export default Hero;