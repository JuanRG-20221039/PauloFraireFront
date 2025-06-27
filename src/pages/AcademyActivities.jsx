import React, { Suspense, lazy } from "react";
import Breadcrumbs from "../components/navbar/Breadcrumbs";

// Lazy load de la galería para optimizar bundle
const Galery = lazy(() => import("../components/home/Galery"));

// Error Boundary para capturar errores en Galery
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error en Galery:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="text-red-600 text-center py-10">
          Error cargando actividades académicas.
        </p>
      );
    }
    return this.props.children;
  }
}

const AcademyActivities = () => {
  const breadcrumbs = ["Actividades Académicas"];

  return (
    <div>
      <div className="flex m-10">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>

      <h1 className="font-extrabold text-4xl text-center uppercase my-10 text-gray-700">
        Actividades Académicas
      </h1>

      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-300" />
            </div>
          }
        >
          <Galery />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default AcademyActivities;
