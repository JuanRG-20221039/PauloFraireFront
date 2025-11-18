import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Layout from "./Layout/Layout.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import ErrorHandler from "./components/ErrorHandler.jsx"; // Importamos el ErrorHandler
import { ErrorProvider } from "./components/ErrorContext.jsx"; // Importa el ErrorProvider

// Pages
import Home from "./pages/Home.jsx";
import Organization from "./pages/Organization.jsx";
import EducationalOffer from "./pages/EducationalOffer";
import AcademyActivities from "./pages/AcademyActivities.jsx";
import CallsEducational from "./pages/CallsEducational.jsx";
import Bibloteca from "./pages/Bibloteca.jsx";
import Login from "./auth/pages/Login.jsx";
// import Registro from "./auth/pages/Registro.jsx";
import Recuperar from "./auth/pages/Recuperar.jsx";
import NewItemPage from "./admin/pages/news/NewItemPage.jsx";
import HistoryDetail from "./pages/HistoryDetail.jsx";
import Acercade from "./components/Acercade.jsx";
import Contacto from "./components/Contacto.jsx";

// Admin
import PrivateRoute from "./pages/PrivateRoute.jsx";
import DashboardLayout from "./admin/pages/DashboardLayout.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import AcademyActivitiesAdmin from "./admin/pages/academy/AcademyActivitiesAdmin.jsx";
import AdminNews from "./admin/pages/news/AdminNews.jsx";
import AddNews from "./admin/pages/news/AddNews.jsx";
import EditNews from "./admin/pages/news/EditNews.jsx";
import AdminUsers from "./admin/pages/users/AdminUsers.jsx";
import AddUser from "./admin/pages/users/AddUser.jsx";
import About from "./admin/pages/about/About.jsx";
import Terminos from "./admin/pages/about/Terminos.tsx";
import Deslinde from "./admin/pages/about/Deslinde.tsx";
import ContextContemporaneoAdmin from "./admin/pages/contextoContemporaneo/ContextoContemporaneoAdmin.jsx";
import OfertaEducativa from "./admin/pages/ofertaseducativas/OfertaEdtucativa.jsx";
import AddOfertaEducativa from "./admin/pages/ofertaseducativas/AddOfertaEducativa.jsx";
import EditOfertaEducativa from "./admin/pages/ofertaseducativas/EditOfertaEducativa.jsx";
import Becas from "./admin/pages/beca/Becas.jsx";
import AddBeca from "./admin/pages/beca/AddBeca.jsx";
import EditBeca from "./admin/pages/beca/EditBeca.jsx";
import QuienesSomos from "./admin/pages/QuienesSomos/QuienesSomos.jsx";
import HistoriaCultura from "./admin/pages/historiaCultura/HistoriaCultura.jsx";
// Configuración de la empresa
import Empresa from "./admin/pages/Empresa/Configempresa.jsx";

// Contexto Contemporáneo
import ContextContemporaneo from "./contexto-comtemporaneo/ContextContemporaneo.jsx";

// User
import UserLayout from "./user/pages/UserLayout.jsx";
import UserProfile from "./user/pages/UserProfile.jsx";
import Politicas from "./admin/pages/about/Politicas.tsx";

// ErrorPage
import ErrorPage404 from "./pages/error/ERROR404page.jsx"; // Página para errores 404
import ErrorPage400 from "./pages/error/ERROR400page.jsx"; // Página para errores 400
import ErrorPage500 from "./pages/error/ERROR500page.jsx"; // Página para errores 500
import clientAxios from "./config/clientAxios.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />, // Usamos ErrorHandler para capturar errores
    children: [
      { index: true, element: <Home /> },
      { path: "/organization", element: <Organization /> },
      { path: "/educational-offer", element: <EducationalOffer /> },
      { path: "/calls", element: <CallsEducational /> },
      { path: "/academy-activities", element: <AcademyActivities /> },
      { path: "/biblioteca", element: <Bibloteca /> },
      { path: "/login", element: <Login /> },
      // { path: "/registro", element: <Registro /> },
      { path: "/new-item/:id", element: <NewItemPage /> },
      { path: "/contexto-contemporaneo", element: <ContextContemporaneo /> },
      { path: "/historia", element: <HistoryDetail /> },
      { path: "/olvide-password", element: <Recuperar /> },
      { path: "/acercade", element: <Acercade /> },
      { path: "/contacto", element: <Contacto /> },

      { path: "/error-500", element: <ErrorPage500 /> },
      { path: "/error-400", element: <ErrorPage400 /> },
      { path: "*", element: <ErrorPage404 /> }, // Ruta explícita para errores 404
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />, // Manejo de errores para rutas de admin
    children: [
      { path: "/admin/home", element: <Dashboard /> },
      {
        path: "/admin/academy-activities",
        element: <AcademyActivitiesAdmin />,
      },
      { path: "/admin/news", element: <AdminNews /> },
      { path: "/admin/add-news", element: <AddNews /> },
      { path: "/admin/edit-news/:id", element: <EditNews /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/add-user", element: <AddUser /> },
      { path: "/admin/about", element: <About /> },
      { path: "/admin/about/deslinde", element: <Deslinde /> },
      { path: "/admin/about/politicas", element: <Politicas /> },
      { path: "/admin/about/terminos", element: <Terminos /> },
      { path: "/admin/configempresa", element: <Empresa /> },
      { path: "/admin/ofertaeducativa", element: <OfertaEducativa /> },
      { path: "/admin/add-oferta", element: <AddOfertaEducativa /> },
      { path: "/admin/edit-oferta/:id", element: <EditOfertaEducativa /> },
      { path: "/admin/becas", element: <Becas /> },
      { path: "/admin/add-beca", element: <AddBeca /> },
      { path: "/admin/edit-beca/:id", element: <EditBeca /> },
      { path: "/admin/quienesSomos", element: <QuienesSomos /> },
      { path: "/admin/historiacultura", element: <HistoriaCultura /> },

      {
        path: "/admin/contexto-contemporaneo-admin",
        element: <ContextContemporaneoAdmin />,
      },
      { path: "*", element: <ErrorPage404 /> }, // Ruta explícita para errores 404
    ],
  },
  {
    path: "/user",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />, // Manejo de errores para rutas de usuario
    children: [
      { path: "/user/profile", element: <UserProfile /> },
      { path: "*", element: <ErrorPage404 /> }, // Ruta explícita para errores 404
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorProvider>
      {" "}
      {/* Envuelve la aplicación con el ErrorProvider */}
      <RouterProvider router={router} />
    </ErrorProvider>
  </React.StrictMode>
);

if (typeof window !== "undefined") {
  (async () => {
    try {
      if ("serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.ready;
          if (!navigator.serviceWorker.controller) {
            await new Promise((resolve) => {
              const onChange = () => {
                navigator.serviceWorker.removeEventListener(
                  "controllerchange",
                  onChange
                );
                resolve();
              };
              navigator.serviceWorker.addEventListener(
                "controllerchange",
                onChange
              );
            });
          }
        } catch (_) {}
      }

      if (!navigator.onLine) return;
      const endpoints = [
        "/getoffter",
        "/getbecas",
        "/institucional",
        "/customsize",
        "/slogan",
        "/introduction",
        "/academy-activities",
        "/blog/published",
        "/logo",
        "/header-title",
        "/social-links",
        "/contexto-contemporaneo",
        "/pdfs-cc",
        "/image-activity",
        "/politicas/vigente",
        "/Terminos/vigente",
        "/deslindes/vigente",
      ];
      const responses = await Promise.allSettled(
        endpoints.map((p) => clientAxios.get(p))
      );

      try {
        await import("./components/home/Galery");
      } catch (_) {}

      const academyResp = responses.find(
        (r, i) => i === endpoints.indexOf("/academy-activities")
      );
      if (academyResp && academyResp.status === "fulfilled") {
        const list = Array.isArray(academyResp.value.data)
          ? academyResp.value.data
          : [];
        const ids = list.slice(0, 8).map((a) => a._id).filter(Boolean);
        await Promise.allSettled(
          ids.map((id) => clientAxios.get(`/image-activity/${id}`))
        );
      }

      const becasResp = responses.find(
        (r, i) => i === endpoints.indexOf("/getbecas")
      );
      if (becasResp && becasResp.status === "fulfilled") {
        const becas = Array.isArray(becasResp.value.data)
          ? becasResp.value.data
          : [];
        for (const b of becas) {
          if (b?.imageUrl) await fetchUrl(b.imageUrl);
          if (Array.isArray(b?.pdfs)) {
            for (const p of b.pdfs) {
              if (p?.url) await fetchUrl(p.url);
            }
          }
        }
      }
      const urlRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|svg|webp|pdf|mp4|webm|ogg))$/i;
      const fetchUrl = async (url) => {
        try {
          await fetch(url, { mode: "cors" });
        } catch (_) {}
      };
      const scan = async (value) => {
        if (!value) return;
        if (typeof value === "string" && urlRegex.test(value)) {
          await fetchUrl(value);
        } else if (Array.isArray(value)) {
          for (const v of value) await scan(v);
        } else if (typeof value === "object") {
          for (const k in value) await scan(value[k]);
        }
      };
      for (const r of responses) {
        if (r.status === "fulfilled") await scan(r.value.data);
      }

      const institucionalResp = responses.find(
        (r, i) => i === endpoints.indexOf("/institucional")
      );
      if (institucionalResp && institucionalResp.status === "fulfilled") {
        const contenido = institucionalResp.value?.data;
        const videoUrl = contenido?.videoUrl;
        if (videoUrl) await fetchUrl(videoUrl);
      }

      const offersResp = responses.find(
        (r, i) => i === endpoints.indexOf("/getoffter")
      );
      if (offersResp && offersResp.status === "fulfilled") {
        const list = Array.isArray(offersResp.value.data)
          ? offersResp.value.data
          : [];
        const ids = list.slice(0, 6).map((o) => o._id).filter(Boolean);
        await Promise.allSettled(
          ids.map((id) => clientAxios.get(`/getoffterid/${id}`))
        );
      }
    } catch (_) {}
  })();
}
