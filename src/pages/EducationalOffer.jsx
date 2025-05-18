import React, { useEffect, useState } from "react";
import Breadcrumbs from "../components/navbar/Breadcrumbs";
import CardOffer from "../components/educational/CardOffer";
import clientAxios from "../config/clientAxios";

const EducationalOffer = () => {
  const breadcrumbs = ["Oferta Educativa"];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOffers = async () => {
      try {
        const { data } = await clientAxios.get("/getoffter");
        if (isMounted) setOffers(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Error al cargar las ofertas educativas");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOffers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-gray-500">Cargando ofertas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="my-20 container mx-auto">
      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="container mx-auto mt-10">
        <h1 className="font-extrabold text-4xl text-center uppercase mb-10">
          Oferta Académica
        </h1>

        <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-2 gap-4 mx-5 mt-5">
          {offers.map((offer, index) => (
            <CardOffer key={offer._id} offer={offer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationalOffer;
