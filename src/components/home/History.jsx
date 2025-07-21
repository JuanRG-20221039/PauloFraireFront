import React from "react";
import { FiCheck } from "react-icons/fi";
import img14 from "../../assets/img/img14.jpeg";
import img15 from "../../assets/img/img15.jpeg";
import img16 from "../../assets/img/img16.jpeg";

import imgl1 from "../../assets/img/lucio1.jpg";
import imgl2 from "../../assets/img/lucio2.jpg";
import imgl3 from "../../assets/img/lucio3.webp";
import imgl4 from "../../assets/img/lucio4.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import clientAxios from "../../config/clientAxios";
import { Loader2 } from "lucide-react";

const History = () => {
  const [intro, setIntro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        const { data } = await clientAxios.get("/stories");
        setIntro(data);
      } catch (error) {
        console.error("Error al obtener la introducción:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntroduction();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!intro) {
    return (
      <div className="text-center text-red-600 font-semibold">
        No se encontró información para mostrar.
      </div>
    );
  }

  return (
    <section className="history mt-10">
      <h1 className=" text-center mb-8 sm:text-5xl  text-slate-100 font-bold ">
        {intro.mainTitle}
      </h1>
      <div className="flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl w-full px-4 sm:px-6 md:px-8 break-words">
          <p className=" text-center mb-8 text-3xl text-slate-100 font-bold">
            {intro.mainAuthor}
          </p>
          {intro.introduction?.paragraphs?.length > 0 &&
          intro.introduction.paragraphs.some((p) => p.trim()) ? (
            intro.introduction.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="my-6 text-lg mx-auto leading-relaxed text-slate-200"
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="my-6 text-lg mx-auto leading-relaxed text-slate-400 italic">
              Siempre hay algo que saber.
            </p>
          )}

          <div className="mt-10">
            <Link
              to={"/historia"}
              className="w-full py-3 font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-sm border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center transition-all duration-300 ease-in-out"
            >
              Leer más
            </Link>
          </div>
        </div>
      </div>
    </section>

    // <div className='container mx-auto'>
    //     <div className="pt-20 px-[3%] md:px-[6%] shadow border-y-2 border-yellow-800 mb-10">
    //         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
    //             <div className="md:col-span-3">
    //                 <div>
    //                     <h1 className=" text-center mb-8 text-4xl  text-slate-800 font-bold ">
    //                         Historia y Cultura Regional
    //                     </h1>
    //                     <h1 className=" text-center mb-8 text-2xl text-slate-800 font-bold">
    //                         Rafael Lucio Ver.
    //                     </h1>
    //                     <img
    //                         src={imgl2}
    //                         alt=""
    //                         className="w-full h-[500px] object-cover"
    //                     />
    //                     <p className="my-10 text-lg max-w-5xl mx-auto leading-relaxed">
    //                         La sede principal del Centro Regional de Educación Superior Paulo Freire, se encuentra localizada en Rafael Lucio, Ver.

    //                         Y desde esta página de la Institución se quiere enaltecer la riqueza de la cultura del estado de Veracruz, que sea este apartado un centro de difusión, más alla de la cultura en el ámbito educacional.
    //                     </p>
    //                     <p className="my-8 text-lg max-w-5xl mx-auto leading-relaxed">
    //                         El municipio de Rafael Lucio se encuentra en el estado mexicano de Veracruz, es uno de los 212 municipios de la entidad y tiene su ubicación en la zona centro montañosa del estado. Sus coordenadas son 19°35” latitud norte, con una longitud oeste de 96°59” y con una altura de 1,840 m s. n. m.
    //                         El municipio fue nombrado en honor del médico, científico y académico mexicano Rafael Lucio Nájera quien describió la lepra lepromatosa difusa, más tarde conocida como lepra de Lucio y Latapí.6 y fuera médico de Benito Juárez y de Maximiliano I de México

    //                     </p>
    //                     <h2 className="mt-4 text-4xl font-bold text-center">
    //                         Historia
    //                     </h2>
    //                     <p className="mt-4  max-w-5xl mx-auto text-lg flex leading-relaxed">
    //                         En 1586 existía un poblado llamado San Miguel del Soldado, correspondiendo a una venta establecida ahí después de consolidada la conquista.
    //                         El 18 de enero de 1735 el virrey Juan Antonio de Vizarrón y Eguiarreta, autorizó la fundación del pueblo.
    //                         En mayo de 1835 Daniel Thomas Egerton, un paisajista británico, visitó el pueblo de San Miguel del Soldado y realizó dos óleos sobre lienzo del pueblo y su iglesia.9
    //                         Por Decreto del 5 de noviembre de 1932 se crea el municipio de Rafael Lucio y la cabecera se denomina Rafael Lucio, en honor del ilustre médico xalapeño.

    //                     </p>
    //                     <div className="flex-col gap-3 mt-3 flex items-center sm:flex-row">
    //                         <img
    //                             src={imgl1}
    //                             alt=""
    //                             className="w-full h-[250px] object-cover"
    //                         />
    //                         <img
    //                             src={imgl4}
    //                             alt=""
    //                             className="w-full h-[450px] object-cover"
    //                         />
    //                         <img
    //                             src={imgl3}
    //                             alt=""
    //                             className="w-full h-[250px] object-cover"
    //                         />
    //                     </div>
    //                     <p className="mt-3 max-w-5xl mx-auto text-lg leading-relaxed mb-5">
    //                         Al centro se representan las principales características económicas y geográficas del municipio, en el recuadro superior se muestra una mazorca atravesada con dos machetes símbolo de la principal actividad agrícola del lugar, abajo atraviesa la vía del ferrocarril que cruza por casi todo el municipio y en su auge el ferrocarril fue una de las fuentes de empleo más importante dentro del municipio. En los recuadros inferiores se destacan a la izquierda una vaca y un cántaro, ya que la ordeña de la leche es otro de los principales sustentos de los rafaeluciences; y a la derecha se muestra un panorama de las construcciones tradicionales del pueblo rodeado por el Cofre de Perote, toda vez que este municipio pertenece a esa misma sierra.
    //                         La parte superior se destaca por una cruz, que es el símbolo de la principal religión que se profesa en el lugar, la católica, por lo mismo la frase "Quien como Dios", en honor al Santo Patrono del Lugar San Miguel Arcángel y nombre que llevó la cabecera municipal durante varios siglos, San Miguel del Soldado.
    //                         En la parte inferior lleva el nombre oficial del municipio de Rafael Lucio, en honor al ilustre médico mexicano desde el año de 1932.
    //                         Costados: Detalles en Flores que representan la vasta vegetación con la que cuenta el municipio, incluso otra actividad comercial en pequeña escala es vender flores decorativas

    //                     </p>

    //                 </div>

    //             </div>

    //         </div>
    //     </div>
    // </div>
  );
};

export default History;
