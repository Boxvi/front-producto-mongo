// src/components/Layout.jsx
import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { to: '/',               label: 'Dashboard',      description: 'Resumen general',      icon: '📊', group: 'Operación' },
  { to: '/productos',      label: 'Productos',      description: 'Catálogo',             icon: '📦', group: 'Operación' },
  { to: '/categorias',     label: 'Categorías',     description: 'Organización',         icon: '🏷️', group: 'Operación' },
  { to: '/almacen',        label: 'Almacén',        description: 'Stock y movimientos',  icon: '🏬', group: 'Operación' },
  { to: '/notificaciones', label: 'Notificaciones', description: 'Alertas y avisos',     icon: '🔔', group: 'Sistema' },
  { to: '/empresa',        label: 'Empresa',        description: 'Datos y config',       icon: '🏢', group: 'Sistema' },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  const currentItem = navItems.find((i) => i.to === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-paper text-ink">
      {/* Overlay móvil */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-base font-bold text-ink">B</span>
            <div>
              <p className="font-display text-base font-bold leading-none">Store Boris</p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">Panel de control</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Navegación agrupada */}
        <nav className="flex-1 overflow-y-auto px-4 pb-2">
          {['Operación', 'Sistema'].map((group) => (
            <div key={group} className="mb-3">
              <p className="px-3 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                {group}
              </p>
              <div className="space-y-1">
                {navItems.filter((i) => i.group === group).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
                        isActive
                          ? 'bg-mint text-ink shadow-soft'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>
                      {item.label}
                      <span className="mt-0.5 block text-[11px] font-medium normal-case tracking-normal opacity-60">
                        {item.description}
                      </span>
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer con toggle de tema + versión */}
        <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-2">
          <button
            onClick={toggle}
            className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Cambiar tema"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
              <span>{isDark ? 'Modo oscuro' : 'Modo claro'}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              {isDark ? 'On' : 'Off'}
            </span>
          </button>

          <div className="px-3.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
            v1.0 · Store Boris
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-paper/90 px-5 py-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg border border-border bg-card p-2 text-ink shadow-soft"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <span className="font-display text-lg font-bold text-ink">{currentItem?.label || 'Store Boris'}</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// // src/components/Layout.jsx
// import { useEffect, useState } from 'react';
// import { NavLink, Outlet, useLocation } from 'react-router-dom';
// import { useTheme } from '../hooks/useTheme';

// const navItems = [
//     { to: '/', label: 'Dashboard', description: 'Resumen general', icon: '📊' },
//     { to: '/productos', label: 'Productos', description: 'Catálogo', icon: '📦' },
//     { to: '/categorias', label: 'Categorías', description: 'Organización', icon: '🏷️' },
//     { to: '/almacen', label: 'Almacén', description: 'Stock y movimientos', icon: '🏬' },
//     { to: '/notificaciones', label: 'Notificaciones', description: 'Alertas y avisos', icon: '🔔' },
//     { to: '/empresa', label: 'Empresa', description: 'Datos y config', icon: '🏢' },
// ];
// export default function Layout() {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const location = useLocation();
//     const { isDark, toggle } = useTheme();

//     useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

//     const currentItem = navItems.find((i) => i.to === location.pathname);

//     return (
//         <div className="flex h-screen overflow-hidden bg-paper">
//             {/* Overlay móvil */}
//             {isSidebarOpen && (
//                 <div
//                     onClick={() => setIsSidebarOpen(false)}
//                     className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
//                     aria-hidden="true"
//                 />
//             )}

//             {/* Sidebar */}
//             <aside
//                 className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink text-white transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                     }`}
//             >
//                 <div className="flex items-center justify-between px-6 py-6">
//                     <div className="flex items-center gap-2.5">
//                         <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint text-base font-bold text-ink">B</span>
//                         <div>
//                             <p className="font-display text-base font-bold leading-none">Store Boris</p>
//                             <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">Panel de control</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => setIsSidebarOpen(false)}
//                         className="rounded-lg p-1.5 text-white/70 hover:bg-card/10 lg:hidden"
//                         aria-label="Cerrar menú"
//                     >
//                         ✕
//                     </button>
//                 </div>

//                 <nav className="mt-2 flex-1 space-y-1 px-4">
//                     {navItems.map((item) => (
//                         <NavLink
//                             key={item.to}
//                             to={item.to}
//                             end={item.to === '/'}
//                             className={({ isActive }) =>
//                                 `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${isActive ? 'bg-mint text-ink shadow-soft' : 'text-white/70 hover:bg-card/10 hover:text-white'
//                                 }`
//                             }
//                         >
//                             <span className="text-lg">{item.icon}</span>
//                             <span>
//                                 {item.label}
//                                 <span className="mt-0.5 block text-[11px] font-medium normal-case tracking-normal text-current/60">
//                                     {item.description}
//                                 </span>
//                             </span>
//                         </NavLink>
//                     ))}
//                 </nav>

//                 <button
//                     onClick={toggle}
//                     className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-white/70 transition hover:bg-card/10 hover:text-white"
//                     aria-label="Cambiar tema"
//                 >
//                     <span className="flex items-center gap-3">
//                         <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
//                         <span>{isDark ? 'Modo oscuro' : 'Modo claro'}</span>
//                     </span>
//                     <span className="text-[10px] uppercase tracking-wider opacity-60">
//                         {isDark ? 'On' : 'Off'}
//                     </span>
//                 </button>

//                 <div className="border-t border-white/10 px-6 py-5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
//                     v1.0 · Store Boris
//                 </div>
//             </aside>

//             {/* Contenido */}
//             <div className="flex h-screen flex-1 flex-col overflow-hidden">
//                 <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-paper/90 px-5 py-4 backdrop-blur lg:hidden">
//                     <button
//                         onClick={() => setIsSidebarOpen(true)}
//                         className="rounded-lg border border-border bg-card p-2 text-ink shadow-soft"
//                         aria-label="Abrir menú"
//                     >
//                         ☰
//                     </button>
//                     <span className="font-display text-lg font-bold text-ink">{currentItem?.label || 'Store Boris'}</span>
//                 </header>

//                 {/* ⚠️ Aquí está la clave: overflow-y-auto SOLO en el main, no en el body */}
//                 <main className="flex-1 overflow-y-auto">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     );
// }