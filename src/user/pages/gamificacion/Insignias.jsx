import { useState, useEffect } from "react";

const Insignias = () => {
  const [mensaje, setMensaje] = useState("Hola Mundo");

  useEffect(() => {
    console.log("Componente montado");
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{mensaje}</h1>
      <button
        onClick={() => setMensaje("¡Hola desde React!")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Cambiar mensaje
      </button>
    </div>
  );
};

export default Insignias;
