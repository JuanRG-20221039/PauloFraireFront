import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaNewspaper,
  FaAngleDoubleDown,
  FaCog,
  FaBook,
  FaUsers,
  FaLandmark,
} from "react-icons/fa";
import { TiThMenuOutline } from "react-icons/ti";
import { BiHomeAlt, BiSelectMultiple } from "react-icons/bi";
import { SiGoogleclassroom, SiInstructure } from "react-icons/si";
import { GiThink } from "react-icons/gi";
import { AiFillAlert, AiFillDollarCircle } from "react-icons/ai";
import { TbLogin } from "react-icons/tb";
import useAuth from "../../hooks/useAuth";

const adminNavItems = [
  {
    to: "/admin/home",
    icon: <BiHomeAlt className="text-2xl" />,
    label: "Inicio",
  },
  {
    to: "/admin/users",
    icon: <SiGoogleclassroom className="text-2xl" />,
    label: "Usuarios",
  },
  {
    to: "/admin/news",
    icon: <FaNewspaper className="text-2xl" />,
    label: "Noticias",
  },
  {
    to: "/admin/academy-activities",
    icon: <BiSelectMultiple className="text-2xl" />,
    label: "Actividades Académicas",
  },
  {
    to: "/admin/contexto-contemporaneo-admin",
    icon: <GiThink className="text-2xl" />,
    label: "Contexto Contemporáneo",
  },
  {
    to: "/admin/ofertaeducativa",
    icon: <SiInstructure className="text-2xl" />,
    label: "Oferta Educativa",
  },
  {
    to: "/admin/becas",
    icon: <AiFillDollarCircle className="text-2xl" />,
    label: "Becas",
  },
  {
    to: "/admin/historiacultura",
    icon: <FaLandmark className="text-2xl" />,
    label: "Historia y Cultura",
  },
  {
    to: "/admin/add-evento",
    icon: <AiFillAlert className="text-2xl" />,
    label: "Eventos",
  },
  {
    to: "/admin/QuienesSomos",
    icon: <FaUsers className="text-2xl" />,
    label: "Quienes somos",
  },
  {
    to: "/admin/configempresa",
    icon: <FaCog className="text-2xl" />,
    label: "Configuración datos de la empresa",
  },
  {
    to: "/admin/about",
    icon: <FaBook className="text-2xl" />,
    label: "Acerca de",
    subItems: [
      { to: "/admin/about/deslinde", label: "Deslinde legal" },
      { to: "/admin/about/terminos", label: "Términos y condiciones" },
      { to: "/admin/about/politicas", label: "Políticas de privacidad" },
    ],
  },
];

const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [filteredNavItems, setFilteredNavItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Obtener el rol del usuario desde localStorage
    const userRole = localStorage.getItem("token") 
      ? JSON.parse(localStorage.getItem("token")).role 
      : null;
    
    // Filtrar elementos del menú según el rol
    if (userRole === 2) { // Si es editor
      // Excluir los módulos de Usuarios y Configuración datos de la empresa
      const filtered = adminNavItems.filter(item => 
        item.to !== "/admin/users" && item.to !== "/admin/configempresa"
      );
      setFilteredNavItems(filtered);
    } else {
      // Para administradores y otros roles, mostrar todos los elementos
      setFilteredNavItems(adminNavItems);
    }
  }, []);

  const handleSubmit = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`${
        open ? "w-72 overflow-y-auto" : "w-[90px] overflow-auto"
      } p-5 md:block hidden pt-8 relative duration-300 shadow-xl bg-slate-200`}
    >
      <div className="flex gap-x-4 items-center">
        <div
          onClick={() => setOpen(!open)}
          className={`cursor-pointer h-6 w-6 duration-500 ${
            open && "rotate-[360deg]"
          }`}
        >
          <TiThMenuOutline className="h-6 w-6" />
        </div>
        <h1
          onClick={() => setOpen(!open)}
          className={`text-slate-700 cursor-pointer font-bold origin-left duration-200 ${
            !open && "scale-0"
          }`}
        >
          Administrador
        </h1>
      </div>

      <ul className="pt-6">
        <p
          className={`text-gray-600 ${
            !open && "hidden"
          } text-sm text-center mb-2`}
        >
          Menu
        </p>
        {filteredNavItems.map((item, index) => (
          <li key={index} className="space-y-2">
            {item.subItems ? (
              <div className="flex items-center">
                <NavLink
                  className={({ isActive }) =>
                    `flex items-center gap-2 w-full ${
                      isActive ? "bg-yellow-400 text-black" : "text-[#413f44]"
                    } duration-150 rounded-md p-2 cursor-pointer hover:bg-Teal hover:text-white font-bold text-sm`
                  }
                  to={item.to}
                >
                  {item.icon}
                  <span
                    className={`${
                      !open ? "hidden" : "block"
                    } duration-200 flex-1`}
                  >
                    {item.label}
                  </span>
                  {open && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setAboutOpen(!aboutOpen);
                      }}
                      className="p-2 focus:outline-none"
                    >
                      <FaAngleDoubleDown
                        className={`text-2xl transition-transform ${
                          aboutOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </NavLink>
              </div>
            ) : (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 ${
                    isActive ? "bg-yellow-400 text-black" : "text-[#413f44]"
                  } duration-150 rounded-md p-2 cursor-pointer hover:bg-Teal hover:text-white font-bold text-sm`
                }
                to={item.to}
              >
                {item.icon}
                <span className={`${!open ? "hidden" : "block"} duration-200`}>
                  {item.label}
                </span>
              </NavLink>
            )}

            {item.subItems && aboutOpen && open && (
              <ul className="ml-6">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex} className="space-y-2">
                    <NavLink
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${
                          isActive
                            ? "bg-yellow-400 text-black"
                            : "text-[#413f44]"
                        } duration-150 rounded-md p-2 cursor-pointer hover:bg-Teal hover:text-white font-bold text-sm`
                      }
                      to={subItem.to}
                    >
                      <span
                        className={`${!open ? "hidden" : "block"} duration-200`}
                      >
                        {subItem.label}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}

        {/* Cerrar sesión */}
        <li className="space-y-2">
          <button
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 duration-150 rounded-md p-2 cursor-pointer font-bold text-sm"
            onClick={handleSubmit}
          >
            <TbLogin className="text-2xl" />
            {open && <span className="duration-200">Cerrar sesión</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
