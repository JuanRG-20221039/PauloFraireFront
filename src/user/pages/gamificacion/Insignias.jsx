import { useContext, useEffect, useState } from "react";
import clientAxios from "../../../config/clientAxios";
import { AuthContext } from "../../../context/AuthProvider";

const looksLikeImageUrl = (val) =>
  typeof val === "string" &&
  (val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("data:image"));

const Insignias = () => {
  const { token } = useContext(AuthContext);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Modal de insignia
  const [modalOpen, setModalOpen] = useState(false);
  const [activeBadge, setActiveBadge] = useState(null);

  // Helper para obtener JWT en ambos formatos
  const getJwt = () => {
    if (token) return token;
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    try {
      const parsed = JSON.parse(stored);
      return parsed?.token || stored;
    } catch {
      return stored;
    }
  };

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const jwt = getJwt();
        if (!jwt) {
          setErr("Debes iniciar sesión para ver tus insignias");
          setBadges([]);
          return;
        }

        const res = await clientAxios.get("/badges", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setBadges(data);
        setErr("");
      } catch (e) {
        console.error("Error al obtener insignias:", e);
        setErr(
          e?.response?.data?.message || "No se pudieron cargar las insignias"
        );
        setBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openBadgeModal = (badge, libroNombre) => {
    const fecha = badge.earnedAt ? new Date(badge.earnedAt) : null;
    setActiveBadge({
      ...badge,
      libroNombre: libroNombre || "",
      fechaLegible: fecha ? fecha.toLocaleDateString("es-MX") : "—",
      icon: badge.badgeIcon || "🏆",
      title: (badge.badgeName || "Lector Destacado").trim(),
      desc:
        badge.badgeDescription || "Insignia obtenida por cuestionario perfecto",
    });
    setModalOpen(true);
  };

  const closeBadgeModal = () => {
    setModalOpen(false);
    setTimeout(() => setActiveBadge(null), 250);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600" />
        <p className="mt-3 text-gray-600">Cargando insignias...</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">
          {err}
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-2">🏅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Aún no tienes insignias
        </h2>
        <p className="text-gray-600">
          Completa cuestionarios con puntuación perfecta para desbloquearlas.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis insignias</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((b) => {
          const libroObj = b.libroId || {};
          const libroNombre =
            typeof libroObj === "object"
              ? libroObj?.nombre
              : String(libroObj || "");
          const fecha = b.earnedAt ? new Date(b.earnedAt) : null;
          const icon = b.badgeIcon || "🏆";
          const isImg = looksLikeImageUrl(icon);
          const desc =
            b.badgeDescription || "Insignia obtenida por cuestionario perfecto";
          const badgeTitle = (b.badgeName || "Lector Destacado").trim();

          return (
            <div
              key={b._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col"
            >
              {/* Línea superior decorativa */}
              <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 h-2 w-full" />

              {/* Contenido */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Título de la insignia */}
                <h3 className="flex items-center gap-3 mb-3">
                  {isImg ? (
                    <img
                      src={icon}
                      alt="Insignia"
                      className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-yellow-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const s = document.createElement("span");
                        s.textContent = "🏆";
                        s.className = "text-4xl md:text-5xl drop-shadow-sm";
                        e.currentTarget.parentElement?.prepend(s);
                      }}
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl drop-shadow-sm">
                      {icon}
                    </span>
                  )}
                  <span className="text-xl md:text-2xl font-extrabold tracking-tight text-yellow-700">
                    {badgeTitle}
                  </span>
                </h3>

                {/* Datos del libro y fecha */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500">Libro</p>
                  <p className="font-semibold text-gray-900 leading-tight">
                    {libroNombre || "—"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ganada {fecha ? fecha.toLocaleDateString("es-MX") : "—"}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 line-clamp-4">{desc}</p>

                {/* Footer acciones */}
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => openBadgeModal(b, libroNombre)}
                    className="px-3 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 active:scale-95 transition shadow"
                  >
                    Ver insignia
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de insignia con iluminación y serpentina */}
      {modalOpen && activeBadge && (
        <div className="fixed inset-0 z-50">
          {/* Estilos para confetti y glow */}
          <style>{`
            @keyframes confetti-fall {
              0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0.9; }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 30px rgba(250, 204, 21, 0.5), 0 0 60px rgba(250, 204, 21, 0.35); }
              50% { box-shadow: 0 0 45px rgba(250, 204, 21, 0.75), 0 0 90px rgba(250, 204, 21, 0.5); }
            }
          `}</style>

          {/* Fondo oscurecido */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeBadgeModal}
          />

          {/* Confetti */}
          <ConfettiBurst />

          {/* Contenedor modal */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
              {/* Header con degradado */}
              <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 h-20" />

              {/* Círculo de iluminación detrás de la insignia */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />

              <div className="p-6 pt-0 text-center">
                {/* Insignia con glow */}
                <div className="relative -mt-12 mx-auto w-28 h-28 rounded-full bg-white flex items-center justify-center border-4 border-yellow-400 animate-[pulse-glow_2s_ease-in-out_infinite] overflow-hidden">
                  {looksLikeImageUrl(activeBadge.icon) ? (
                    <img
                      src={activeBadge.icon}
                      alt="Insignia"
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const s = document.createElement("span");
                        s.textContent = "🏆";
                        s.style.fontSize = "56px";
                        e.currentTarget.parentElement?.appendChild(s);
                      }}
                    />
                  ) : (
                    <span className="text-6xl drop-shadow-sm">
                      {activeBadge.icon}
                    </span>
                  )}
                </div>

                {/* Título */}
                <h3 className="mt-4 text-2xl font-extrabold text-yellow-700">
                  {activeBadge.title}
                </h3>

                {/* Libro y fecha */}
                <p className="mt-1 text-sm text-gray-500">
                  {activeBadge.libroNombre || "—"} · {activeBadge.fechaLegible}
                </p>

                {/* Descripción */}
                <p className="mt-4 text-gray-700 leading-relaxed">
                  {activeBadge.desc}
                </p>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={closeBadgeModal}
                    className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Renderiza un estallido de confetti/serpentina simple con CSS
 * Sin dependencias externas.
 */
const ConfettiBurst = () => {
  const COLORS = [
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
  ];
  const PIECES = 80;

  const pieces = Array.from({ length: PIECES }).map((_, i) => {
    const left = Math.random() * 100; // %
    const delay = Math.random() * 0.6; // s
    const duration = 1.2 + Math.random() * 0.9; // s
    const size = 6 + Math.random() * 8; // px
    const rotate = Math.random() * 360;
    const color = COLORS[i % COLORS.length];
    const shape = Math.random() < 0.5 ? "square" : "circle";
    const borderRadius = shape === "circle" ? "999px" : "2px";

    return (
      <span
        key={i}
        style={{
          position: "absolute",
          top: "-10vh",
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius,
          transform: `rotate(${rotate}deg)`,
          animation: `confetti-fall ${duration}s linear ${delay}s forwards`,
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    );
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]">{pieces}</div>
  );
};

export default Insignias;
