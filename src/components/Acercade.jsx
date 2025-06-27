// src/pages/Acercade.jsx
import React, { useState } from "react";
import TarjetaPolitica from "./TarjetaPolitica";
import TarjetaTermino from "./TarjetaTermino";
import TarjetaDeslinde from "./TarjetaDeslinde";

const Acercade = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpand = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Información sobre la Empresa
      </h1>

      <div className={`grid grid-cols-1 ${!expandedCard ? 'sm:grid-cols-2 lg:grid-cols-3' : ''} gap-6 p-4 max-w-full`}>
        {/* Tarjeta Política */}
        <div
          className={`
            ${expandedCard === 'politica' ? 'col-span-full' : ''}
            ${expandedCard && expandedCard !== 'politica' ? 'hidden' : ''}
          `}
        >
          <TarjetaPolitica 
            expanded={expandedCard === 'politica'}
            onExpand={() => handleExpand('politica')} 
          />
        </div>

        {/* Tarjeta Términos */}
        <div
          className={`
            ${expandedCard === 'termino' ? 'col-span-full' : ''}
            ${expandedCard && expandedCard !== 'termino' ? 'hidden' : ''}
          `}
        >
          <TarjetaTermino 
            expanded={expandedCard === 'termino'}
            onExpand={() => handleExpand('termino')} 
          />
        </div>

        {/* Tarjeta Deslinde */}
        <div
          className={`
            ${expandedCard === 'deslinde' ? 'col-span-full' : ''}
            ${expandedCard && expandedCard !== 'deslinde' ? 'hidden' : ''}
          `}
        >
          <TarjetaDeslinde 
            expanded={expandedCard === 'deslinde'}
            onExpand={() => handleExpand('deslinde')} 
          />
        </div>
      </div>
    </div>
  );
};

export default Acercade;
