import React, { useState, useEffect } from "react";
import clientAxios from "../../config/clientAxios";

const Inscripciones = () => {
  const [slogan, setSlogan] = useState("");
  const [media, setMedia] = useState({ images: [], videoUrl: null });

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

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [imgsRes, vidRes] = await Promise.all([
          clientAxios.get("/inscripciones-images"),
          clientAxios.get("/inscripciones-video"),
        ]);
        const images = Array.isArray(imgsRes.data) ? imgsRes.data : [];
        const videoUrl = vidRes.data?.videoUrl || null;
        setMedia({ images, videoUrl });
      } catch (_) {}
    };
    fetchMedia();
  }, []);

  return (
    <section className="max-w-[1300px] mx-auto mt-5">
      <h4 className="bg-gradient-to-tr from-green-600 to-indigo-600 text-transparent bg-clip-text font-black text-center text-7xl leading-relaxed pt-4">
        {slogan}
      </h4>
      <div className="mt-20 grid md:grid-cols-2 shadow rounded-lg grid-cols-1">
        {media.images.map((img, idx) => (
          <div key={idx} className="flex justify-center items-center">
            <img src={img.url} alt="Promoción" />
          </div>
        ))}
        {media.videoUrl && (
          <div className="flex justify-center items-center bg-gradient-to-tr from-fuchsia-200 to-indigo-600">
            <video className="w-auto rounded-sm" src={media.videoUrl} controls />
          </div>
        )}
      </div>
    </section>
  );
};

export default Inscripciones;
