import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BiHomeAlt, BiSelectMultiple } from "react-icons/bi";
import { IoDocumentText } from "react-icons/io5";
import { TbLogin } from "react-icons/tb";

const studentNavItems = [
  /*   { to: "/", icon: <BiHomeAlt className="text-2xl" />, label: "Inicio" }, */
  {
    to: "/user/profile",
    icon: <BiSelectMultiple className="text-2xl" />,
    label: "Mi perfil",
  },
  {
    to: "/user/libros",
    icon: <BiSelectMultiple className="text-2xl" />,
    label: "Libros",
  },
  /*   {
    to: "/user/docs",
    icon: <IoDocumentText className="text-2xl" />,
    label: "Mis documentos",
  }, */
];

const StudentSidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
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
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1
          className={`text-slate-700 cursor-pointer font-bold origin-left duration-200 ${
            !open && "scale-0"
          }`}
        >
          Alumno
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
        {studentNavItems.map((item, index) => (
          <li key={index} className="space-y-2">
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
          </li>
        ))}

        <li className="space-y-2 mt-4">
          <button
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 duration-150 rounded-md p-2 cursor-pointer font-bold text-sm"
            onClick={handleLogout}
          >
            <TbLogin className="text-2xl" />
            {open && <span className="duration-200">Cerrar sesión</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
