import React, { useEffect, useState } from "react";
import clientAxios from "../../config/clientAxios";
import Spinner from "../Spinner";
import CardGalery from "./CardGalery";

const Galery = () => {
  const [academyActivities, setAcademyActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const getAcademyActivities = async () => {
      setLoading(true);
      try {
        const response = await clientAxios.get("/academy-activities");

        // Guardar tal cual vienen desde la base de datos
        setAcademyActivities(response.data);
      } catch (error) {
        console.error("Error cargando actividades:", error);
      } finally {
        setLoading(false);
      }
    };

    getAcademyActivities();
  }, []);

  return (
    <div className="flex flex-col pt-10 pb-10 space-y-8 bg-gray-100 justify-center">
      {loading ? (
        <Spinner />
      ) : (
        // Invertimos el orden
        [...academyActivities].reverse().map((activity) => (
          <CardGalery
            key={activity._id}
            id={activity._id}
            category={activity.title}
            onImageClick={(img) => setSelectedImage(img)}
          />
        ))
      )}

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Imagen ampliada"
            className="max-h-[90%] max-w-[90%] rounded-xl shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Galery;
