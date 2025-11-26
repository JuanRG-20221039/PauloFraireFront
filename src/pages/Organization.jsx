import React from "react";
import Breadcrumbs from "../components/navbar/Breadcrumbs";
import CardProfile from "../components/organization/CardProfile";
import CardContact from "../components/organization/CardContact";

import { authorities, contactInfo } from "../data/Data";
import { motion } from "framer-motion";

const Organization = () => {
  const breadcrumbs = ["Organización"];

  const container = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="bg-white w-full overflow-x-hidden">
      <div className="flex justify-center my-5 px-4 sm:px-6">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>

      <div className="container mx-auto max-w-6xl mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8">
        <section className="py-2 sm:py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-5">
            <CardProfile profile={authorities[1]} />
            <CardProfile profile={authorities[0]} />
            <CardProfile profile={authorities[2]} />
            <CardProfile profile={authorities[3]} />
            <CardProfile profile={authorities[4]} />
            <CardProfile profile={authorities[5]} />
            <CardProfile profile={authorities[6]} />
          </div>
        </section>

        <div className="mt-8 sm:mt-10">
          <h2 className="font-semibold text-center text-xl sm:text-2xl md:text-3xl uppercase mb-8 sm:mb-10 text-slate-900 underline decoration-teal-800">
            Circulos de estudio zona norte de ver.
          </h2>

          <div className="px-2 sm:px-0">
            <CardContact contactInfo={contactInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;
