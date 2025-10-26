import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import StudentSidebar from "../components/StudentSidebar";

export default function UserLayout() {
  return (
    <div>
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        {" "}
        {/* Ajusta la altura según el header */}
        <StudentSidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
