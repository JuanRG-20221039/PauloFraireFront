import { useContext, useEffect, useState } from "react";
import clientAxios from "../../../config/clientAxios";
import { AuthContext } from "../../../context/AuthProvider";

const looksLikeImageUrl = (val) =>
  typeof val === "string" &&
  (val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("data:image"));

const InsigniasU = () => {
  const { token } = useContext(AuthContext);

  // Usuarios con insignias
  const [usersWithBadges, setUsersWithBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Modal: listado de insignias de un usuario (bandas)
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null); // { userId, name, badges: [] }

  // Modal: insignia individual (glow + confetti)
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);
  const [activeBadge, setActiveBadge] = useState(null);

  // Helper JWT
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

  // Cargar usuarios con insignias (endpoint admin)
  useEffect(() => {
    const fetchUsersWithBadges = async () => {
      try {
        setLoading(true);
        const jwt = getJwt();
        if (!jwt) {
          setErr("Debes iniciar sesión");
          setUsersWithBadges([]);
          return;
        }

        // GET /admin/badges/users -> [{ user: {...}, badges: [...] }]
        const res = await clientAxios.get("/admin/badges/users", {
          headers: { Authorization: `Bearer ${jwt}` },
        });

        const data = Array.isArray(res.data) ? res.data : [];
        const normalized = data.map((row) => {
          const u = row.user || row.usuario || row;
          const fullName =
            [u?.name, u?.lastName].filter(Boolean).join(" ") ||
            u?.fullName ||
            u?.email ||
            "Usuario";
          return {
            userId: u?._id || u?.id,
            name: fullName,
            badges: Array.isArray(row.badges)
              ? row.badges
              : row?.userBadges || [],
          };
        });

        setUsersWithBadges(normalized);
        setErr("");
      } catch (e) {
        console.error("Error al obtener usuarios con insignias:", e);
        setErr(
          e?.response?.data?.message || "No se pudieron cargar los usuarios"
        );
        setUsersWithBadges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Abrir modal de usuario (todas sus insignias en bandas)
  const openUserModal = (userRow) => {
    setActiveUser(userRow);
    setUserModalOpen(true);
  };
  const closeUserModal = () => {
    setUserModalOpen(false);
    setTimeout(() => setActiveUser(null), 200);
  };

  // Abrir modal de insignia individual (glow + confetti)
  const openBadgeModal = (badge) => {
    const libroNombre =
      typeof badge.libroId === "object" ? badge.libroId?.nombre : "";
    const fecha = badge.earnedAt ? new Date(badge.earnedAt) : null;
    setActiveBadge({
      ...badge,
      libroNombre,
      fechaLegible: fecha ? fecha.toLocaleDateString("es-MX") : "—",
      icon: badge.badgeIcon || "🏆",
      title: (badge.badgeName || "Insignia").trim(),
      desc:
        badge.badgeDescription || "Insignia obtenida por cuestionario perfecto",
    });
    setBadgeModalOpen(true);
  };
  const closeBadgeModal = () => {
    setBadgeModalOpen(false);
    setTimeout(() => setActiveBadge(null), 250);
  };

  // UI
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600" />
        <p className="mt-3 text-gray-600">Cargando usuarios con insignias...</p>
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

  if (usersWithBadges.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Usuarios con insignias
        </h1>
        <p className="text-gray-600">Aún no hay usuarios con insignias.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Usuarios con insignias
      </h1>

      {/* Tarjetas por usuario */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {usersWithBadges.map((row) => {
          const count = row.badges.length;
          const preview = row.badges.slice(0, 3); // muestra 3 bandas de ejemplo

          return (
            <div
              key={row.userId}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-500">Alumno</p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {row.name}
                  </h3>
                </div>
                <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full">
                  Insignias: {count}
                </div>
              </div>

              {/* Bandas estilo imagen (preview) */}
              <div className="space-y-2 mb-4">
                {preview.length === 0 ? (
                  <p className="text-gray-600 text-sm">Sin insignias</p>
                ) : (
                  preview.map((b) => {
                    const icon = b.badgeIcon || "🏆";
                    const title = (b.badgeName || "Insignia").trim();
                    const isImg = looksLikeImageUrl(icon);
                    return (
                      <button
                        key={b._id}
                        onClick={() => openBadgeModal(b)}
                        className="w-full text-left bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 hover:bg-yellow-100 transition flex items-center gap-3"
                        title="Ver insignia"
                      >
                        {isImg ? (
                          <img
                            src={icon}
                            alt="Insignia"
                            className="h-7 w-7 rounded-full object-cover ring-2 ring-yellow-300"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const s = document.createElement("span");
                              s.textContent = "🏆";
                              s.className = "text-3xl";
                              e.currentTarget.parentElement?.prepend(s);
                            }}
                          />
                        ) : (
                          <span className="text-3xl">{icon}</span>
                        )}
                        <div>
                          <p className="text-xs text-gray-600">Insignia:</p>
                          <p className="text-base font-semibold text-yellow-700">
                            {title}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => openUserModal(row)}
                  className="px-3 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 active:scale-95 transition"
                >
                  Ver más
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de usuario con TODAS sus bandas */}
      {userModalOpen && activeUser && (
        <UserBadgesListModal
          userRow={activeUser}
          onClose={closeUserModal}
          onOpenBadge={(b) => openBadgeModal(b)}
        />
      )}

      {/* Modal de insignia con iluminación y serpentina */}
      {badgeModalOpen && activeBadge && (
        <BadgeGlowModal badge={activeBadge} onClose={closeBadgeModal} />
      )}
    </div>
  );
};

/* Modal: listado completo de insignias de un usuario (bandas estilo ejemplo) */
const UserBadgesListModal = ({ userRow, onClose, onOpenBadge }) => {
  const safeBadges = Array.isArray(userRow.badges) ? userRow.badges : [];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-6 py-5">
            <h3 className="text-xl font-extrabold text-white drop-shadow">
              {userRow.name}
            </h3>
            <p className="text-sm text-yellow-50">
              Insignias: {safeBadges.length}
            </p>
          </div>

          <div className="p-5 space-y-3 max-h-[70vh] overflow-auto">
            {safeBadges.length === 0 ? (
              <p className="text-gray-600">Sin insignias.</p>
            ) : (
              safeBadges.map((b) => {
                const icon = b.badgeIcon || "🏆";
                const title = (b.badgeName || "Insignia").trim();
                const isImg = looksLikeImageUrl(icon);
                return (
                  <button
                    key={b._id}
                    onClick={() => onOpenBadge(b)}
                    className="w-full text-left bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 hover:bg-yellow-100 transition flex items-center gap-3"
                    title="Ver insignia"
                  >
                    {isImg ? (
                      <img
                        src={icon}
                        alt="Insignia"
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-yellow-300"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const s = document.createElement("span");
                          s.textContent = "🏆";
                          s.className = "text-3xl";
                          e.currentTarget.parentElement?.prepend(s);
                        }}
                      />
                    ) : (
                      <span className="text-3xl">{icon}</span>
                    )}
                    <div>
                      <p className="text-xs text-gray-600">Insignia:</p>
                      <p className="text-base font-semibold text-yellow-700">
                        {title}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="px-5 pb-5">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Modal: insignia individual con iluminación y confetti */
const BadgeGlowModal = ({ badge, onClose }) => {
  const iconVal = badge.badgeIcon || badge.icon || "🏆";
  const isImg = looksLikeImageUrl(iconVal);

  return (
    <div className="fixed inset-0 z-50">
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

      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <ConfettiBurst />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 h-20" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-yellow-300/30 blur-3xl pointer-events-none" />

          <div className="p-6 pt-0 text-center">
            <div className="relative -mt-12 mx-auto w-28 h-28 rounded-full bg-white flex items-center justify-center border-4 border-yellow-400 animate-[pulse-glow_2s_ease-in-out_infinite] overflow-hidden">
              {isImg ? (
                <img
                  src={iconVal}
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
                <span className="text-6xl drop-shadow-sm">{iconVal}</span>
              )}
            </div>

            <h3 className="mt-4 text-2xl font-extrabold text-yellow-700">
              {badge.badgeName || badge.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {badge.libroId?.nombre || badge.libroNombre || "—"} ·{" "}
              {badge.fechaLegible ||
                (badge.earnedAt
                  ? new Date(badge.earnedAt).toLocaleDateString("es-MX")
                  : "—")}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {badge.badgeDescription || badge.desc}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Confetti sencillo sin dependencias */
const ConfettiBurst = () => {
  const COLORS = [
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#EF4444",
    "#8B5CF6",
    "#F97316",
  ];
  const PIECES = 90;
  const pieces = Array.from({ length: PIECES }).map((_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 1.2 + Math.random() * 0.9;
    const size = 6 + Math.random() * 8;
    const rotate = Math.random() * 360;
    const color = COLORS[i % COLORS.length];
    const circle = Math.random() < 0.5;
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
          borderRadius: circle ? "999px" : "2px",
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

export default InsigniasU;
