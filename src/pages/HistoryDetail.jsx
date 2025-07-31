import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import clientAxios from "../config/clientAxios";

const HistoryDetail = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const { data } = await clientAxios.get("/stories");
        setStories(data);
      } catch (error) {
        console.error("Error al obtener las historias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (!stories.length) {
    return (
      <div className="text-center text-red-600 font-semibold">
        No hay historias disponibles para mostrar.
      </div>
    );
  }

  return (
    <div className="container mx-auto bg-gray-50">
      <div className="max-w-5xl mx-auto mt-20 p-5">
        <div className="grid grid-cols-1 gap-6">
          <div className="md:col-span-3">
            {stories.map((story) => (
              <div key={story._id || story.title} className="mb-20">
                <h1 className="text-center mb-8 text-4xl text-slate-700 font-bold">
                  {story.title}
                </h1>
                <h3 className="text-center mb-8 text-2xl text-slate-700 font-bold">
                  {story.author}
                </h3>

                {/* Mostrar todas las imágenes */}
                {story.images?.length > 0 && (
                  <div className="flex flex-col gap-6 mb-10">
                    {story.images.map((img, index) => (
                      <img
                        key={index}
                        src={typeof img === "string" ? img : img.secure_url}
                        alt={`imagen-${index}`}
                        className="w-full max-h-96 object-cover rounded-lg shadow-md my-4"
                      />
                    ))}
                  </div>
                )}

                {/* Mostrar párrafos */}
                <div className="mt-3 max-w-5xl mx-auto text-lg leading-relaxed mb-5 text-slate-500 break-words overflow-wrap-break-word">
                  {" "}
                  {story.paragraphs.map((para, index) => (
                    <p key={index} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetail;
