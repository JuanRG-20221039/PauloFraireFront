import React, { useEffect, useState } from "react";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { logos } from "../data/Data";
import { Link } from "react-router-dom";
import clientAxios from "../config/clientAxios"; // Asegúrate de que esta ruta es correcta

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
  });
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await clientAxios.get("/social-links");
        if (response.data) {
          setSocialLinks(response.data);
        }
      } catch (error) {
        console.error("Error al obtener los enlaces de redes sociales:", error);
      }
    };

    fetchSocialLinks();
  }, []);
  return (
    <motion.div
      initial={{ height: 0 }}
      whileInView={{ height: "auto" }}
      transition={{ duration: 1 }}
      className="border-t-2 border-slate-500 bg-[#201E1E] p-5"
    >
      <div className="grid md:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 place-items-start gap-8 text-white font-semibold">
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold mb-6 text-center">
            CENTRO REGIONAL DE EDUCACIÓN SUPERIOR PAULO FREIRE
          </p>
          <img src={logo} alt="logo" className="h-36 w-40" />
        </div>
        <div>
          <div className="font-bold mb-6">Inicio</div>
          <div className="flex flex-col gap-4">
            <a href="#quienes-somos" className="text-sm hover:underline">
              ¿Quiénes Somos?
            </a>
            <a href="#mision" className="text-sm hover:underline">
              {" "}
              Misión
            </a>
            <a href="#vision" className="text-sm hover:underline">
              Visión
            </a>
            <a href="#valores" className="text-sm hover:underline">
              Valores Institucionales
            </a>
            <Link to="/login" className="text-sm hover:underline">
              Iniciar Sesión
            </Link>
            {/* <Link to="/registro" className="text-sm hover:underline">
              Registrarse
            </Link> */}
            <Link to="/acercade" className="text-sm hover:underline">
              Acerca de
            </Link>
            <Link to="/contacto" className="text-sm hover:underline">
              Contacto
            </Link>
          </div>
        </div>

        <div>
          <div className="font-bold mb-6">Organización</div>
          <div className="flex flex-col gap-4">
            <Link to={`/organization`} className="text-sm hover:underline">
              Directorio
            </Link>
            <Link to={`/organization`} className="text-sm hover:underline">
              Organigrama
            </Link>
          </div>
        </div>
        <div>
          <div className="font-bold mb-6">Oferta Educativa</div>
          <div className="flex flex-col gap-4">
            <Link to={`/educational-offer`} className="text-sm hover:underline">
              Maestría en Tecnologías Aplicadas a la Educación
            </Link>
            <Link to={`/educational-offer`} className="text-sm hover:underline">
              Doctorado en Educación y Cultura Digital Pedagógica
            </Link>
          </div>
        </div>
        <div>
          <div className="font-bold mb-6">Siguenos</div>
          <div className="text-sm mb-4">
            centrodeeducacionsuperiorpaulo@gmail.com
          </div>
          <div className="flex gap-4 mt-4">
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                className="hover:scale-110 text-xl"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <BsFacebook className="text-blue-500 h-6 w-6" />
              </a>
            )}
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                className="hover:scale-110 text-xl"
                target="_blank"
                rel="noopener noreferrer"
                title="X"
              >
                <BsTwitter className="text-blue-400 h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>
      <p className="font-bold text-center text-white">
        Todos los derechos reservados 2024
      </p>
    </motion.div>
  );
};

export default Footer;
