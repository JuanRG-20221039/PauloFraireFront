import React from "react";
import GaleryBeforeAndAfter from "../anniversary/GaleryBeforeAndAfter";
import HistoryAnniversary from "../anniversary/HistoryAnniversary";
import Invitations from "../anniversary/Invitations";
import VideoAnniversary from "../anniversary/VideoAnniversary";

const Anniversary = () => {
  return (
    <section className="overflow-x-hidden w-full">
      <div className="container mx-auto w-full max-w-[1400px] mt-6 sm:mt-10 lg:mt-12 mb-6 sm:mb-10 lg:mb-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-500 text-center py-2 sm:py-3 uppercase leading-tight break-words">
          20 Aniversario 🎉🎉
          <span className="text-blue-500 block text-sm sm:text-base md:text-lg mt-1">
            {" "}
            ¡ Gracias por ser parte de esta comunidad !{" "}
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-full py-4 sm:py-8 gap-6 sm:gap-8 overflow-hidden">
          <HistoryAnniversary />
          <GaleryBeforeAndAfter />
          <Invitations />
          <VideoAnniversary />
        </div>

        <div>
          {/* <h3 className='text-3xl font-extrabold text-blue-500 text-center py-4 uppercase '>
                        Mensajes de Felicitaciones  🎉🎉
                    </h3> */}
          {/* link de video  */}
          {/* <div className='flex justify-center items-center mx-auto  grid-cols-1  gap-2 '>
                        <div className='flex justify-center'>
                            <iframe className='' src="https://www.youtube.com/embed/9rqYQtuzx0I?si=zJ-FZVkCEA8VeGjU" title="YouTube video player" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>

                    </div> */}
        </div>
      </div>
    </section>
  );
};

export default Anniversary;
