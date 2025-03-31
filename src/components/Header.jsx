import React, { useEffect, useState } from "react";
import { navLinks } from "../data/Data.jsx";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import MobileNavLinks from "./navbar/MobileNavLinks";
import NavLink from "./navbar/NavLink";
import { logos } from "../data/Data.jsx";
import { motion } from "framer-motion";
import clientAxios from "../config/clientAxios";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [active, setActive] = useState(true);
  const [logo, setLogo] = useState("");
  const [title, setTitle] = useState(
    "Centro Regional de Educación Superior Paulo Freire"
  ); // Estado para el título dinámico con valor por defecto

  useEffect(() => {
    const scrollActive = () => {
      setActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", scrollActive);
    return () => window.removeEventListener("scroll", scrollActive);
  }, [active]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await clientAxios.get("/logo");
        setLogo(data.url || "sin logo"); // Fallback en caso de no haber logo
      } catch (error) {
        console.error(error);
      }
    };
    fetchLogo();
    const intervalId = setInterval(fetchLogo, 2000); // Llamar a fetchLogo cada 5 segundos
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const { data } = await clientAxios.get("/header-title");
        setTitle(
          data.title || "Centro Regional de Educación Superior Paulo Freire"
        ); // Fallback en caso de no haber título
      } catch (error) {
        // console.error("Error al obtener el título:", error);
      }
    };

    fetchTitle();
    const intervalId = setInterval(fetchTitle, 10000); // Llamar a fetchTitle cada 5 segundos
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sm:mb-0 navbar bg-Teal mb-12">
      <div className={`${active ? "" : ""} `}>
        <div className="flex sm:flex-row flex-col justify-center items-center gap-2">
          <div className="text-xl uppercase justify-center">
            <img
              src={logo || logos[0]} // Logo dinámico
              alt="Logo principal"
              className="h-24 w-28 p-2"
            />
          </div>

          <div className="flex items-center justify-center">
            <p className="text-xl text-slate-200 font-medium uppercase text-center">
              {title} {/* Título dinámico */}
            </p>
          </div>
        </div>
      </div>

      <header
        className={`${
          active ? "top-0" : ""
        } shadow-lg w-full left-0 bg-gray-500`}
      >
        <div>
          <div
            className={`${
              active ? "transition-all duration-300" : "py-2"
            } mx-auto flex items-center justify-between px-2 py-2`}
          >
            <div className="flex items-center gap-4">
              <HiMenuAlt1
                className="text-3xl sm:hidden cursor-pointer text-white"
                onClick={() => setToggle(true)}
              />
            </div>
            <div className="flex">
              <div className="sm:flex justify-end hidden">
                {navLinks.map((navLink) => {
                  return <NavLink key={navLink.id} {...navLink} />;
                })}
              </div>
            </div>
            
            {toggle && (
              <motion.div
                initial={{ x: -500, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="fixed h-full w-96 top-0 left-0 z-20 bg-Teal text-white flex flex-col justify-center items-center shadow-lg gap-8 py-8"
              >
                {navLinks.map((navLink) => {
                  return (
                    <MobileNavLinks
                      key={navLink.id}
                      {...navLink}
                      setToggle={setToggle}
                    />
                  );
                })}
                <HiX
                  className="absolute right-12 top-12 text-3xl cursor-pointer"
                  onClick={() => setToggle(false)}
                />
              </motion.div>
            )}
          </div>
        </div>
        <div className=""></div>
      </header>
    </div>
  );
};

export default Header;
