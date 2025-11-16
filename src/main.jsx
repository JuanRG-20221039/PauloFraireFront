import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Layout from "./Layout/Layout.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import ErrorHandler from "./components/ErrorHandler.jsx";
import { ErrorProvider } from "./components/ErrorContext.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Organization from "./pages/Organization.jsx";
import EducationalOffer from "./pages/EducationalOffer";
import AcademyActivities from "./pages/AcademyActivities.jsx";
import CallsEducational from "./pages/CallsEducational.jsx";
import Bibloteca from "./pages/Bibloteca.jsx";
import Login from "./auth/pages/Login.jsx";
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
import Politicas from "./admin/pages/about/Politicas.tsx";

import ContextContemporaneoAdmin from "./admin/pages/contextoContemporaneo/ContextoContemporaneoAdmin.jsx";
import OfertaEducativa from "./admin/pages/ofertaseducativas/OfertaEdtucativa.jsx";
import AddOfertaEducativa from "./admin/pages/ofertaseducativas/AddOfertaEducativa.jsx";
import EditOfertaEducativa from "./admin/pages/ofertaseducativas/EditOfertaEducativa.jsx";
import Becas from "./admin/pages/beca/Becas.jsx";
import AddBeca from "./admin/pages/beca/AddBeca.jsx";
import EditBeca from "./admin/pages/beca/EditBeca.jsx";
import QuienesSomos from "./admin/pages/QuienesSomos/QuienesSomos.jsx";
import HistoriaCultura from "./admin/pages/historiaCultura/HistoriaCultura.jsx";

// Marvinsh
import Organizacion from "./admin/pages/organizacion/Organizacion.jsx";
import CreateStaff from "./admin/pages/organizacion/CreateStaff.jsx";
import EditStaff from "./admin/pages/organizacion/EditStaff.jsx";
import Zonas from "./admin/pages/organizacion/zonas.jsx";

// TEST-FRONT
import AddEventos from "./admin/pages/Eventos/Eventos.jsx";

// Empresa
import Empresa from "./admin/pages/Empresa/Configempresa.jsx";

// Multimedia
import Multimediainscripciones from "./admin/pages/multimediainscripciones/multimediainscripciones.jsx";

// Público
import ContextContemporaneo from "./contexto-comtemporaneo/ContextContemporaneo.jsx";

// User
import UserLayout from "./user/pages/UserLayout.jsx";
import UserProfile from "./user/pages/UserProfile.jsx";

// Errores
import ErrorPage404 from "./pages/error/ERROR404page.jsx";
import ErrorPage400 from "./pages/error/ERROR400page.jsx";
import ErrorPage500 from "./pages/error/ERROR500page.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />,
    children: [
      { index: true, element: <Home /> },
      { path: "/organization", element: <Organization /> },
      { path: "/educational-offer", element: <EducationalOffer /> },
      { path: "/calls", element: <CallsEducational /> },
      { path: "/academy-activities", element: <AcademyActivities /> },
      { path: "/biblioteca", element: <Bibloteca /> },
      { path: "/login", element: <Login /> },
      { path: "/new-item/:id", element: <NewItemPage /> },
      { path: "/contexto-contemporaneo", element: <ContextContemporaneo /> },
      { path: "/historia", element: <HistoryDetail /> },
      { path: "/olvide-password", element: <Recuperar /> },
      { path: "/acercade", element: <Acercade /> },
      { path: "/contacto", element: <Contacto /> },

      { path: "/error-500", element: <ErrorPage500 /> },
      { path: "/error-400", element: <ErrorPage400 /> },
      { path: "*", element: <ErrorPage404 /> },
    ],
  },

  // ADMIN
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />,
    children: [
      { path: "/admin/home", element: <Dashboard /> },
      { path: "/admin/academy-activities", element: <AcademyActivitiesAdmin /> },
      { path: "/admin/news", element: <AdminNews /> },
      { path: "/admin/add-news", element: <AddNews /> },
      { path: "/admin/edit-news/:id", element: <EditNews /> },

      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/add-user", element: <AddUser /> },

      // About
      { path: "/admin/about", element: <About /> },
      { path: "/admin/about/deslinde", element: <Deslinde /> },
      { path: "/admin/about/politicas", element: <Politicas /> },
      { path: "/admin/about/terminos", element: <Terminos /> },

      // Empresa
      { path: "/admin/configempresa", element: <Empresa /> },

      // Oferta Educativa
      { path: "/admin/ofertaeducativa", element: <OfertaEducativa /> },
      { path: "/admin/add-oferta", element: <AddOfertaEducativa /> },
      { path: "/admin/edit-oferta/:id", element: <EditOfertaEducativa /> },

      // Becas
      { path: "/admin/becas", element: <Becas /> },
      { path: "/admin/add-beca", element: <AddBeca /> },
      { path: "/admin/edit-beca/:id", element: <EditBeca /> },

      { path: "/admin/quienesSomos", element: <QuienesSomos /> },
      { path: "/admin/historiacultura", element: <HistoriaCultura /> },

      // Marvinsh
      { path: "/admin/organizacion", element: <Organizacion /> },
      { path: "/admin/add-staff", element: <CreateStaff /> },
      { path: "/admin/edit-staff/:id", element: <EditStaff /> },
      { path: "/admin/zonas", element: <Zonas /> },
      { path: "/admin/multimediainscripciones", element: <Multimediainscripciones /> },

      // TEST-FRONT
      { path: "/admin/add-evento", element: <AddEventos /> },

      // Contexto contemporáneo
      { path: "/admin/contexto-contemporaneo-admin", element: <ContextContemporaneoAdmin /> },

      { path: "*", element: <ErrorPage404 /> },
    ],
  },

  // USER
  {
    path: "/user",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <UserLayout />
        </PrivateRoute>
      </AuthProvider>
    ),
    errorElement: <ErrorHandler />,
    children: [
      { path: "/user/profile", element: <UserProfile /> },
      { path: "*", element: <ErrorPage404 /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorProvider>
      <RouterProvider router={router} />
    </ErrorProvider>
  </React.StrictMode>
);
