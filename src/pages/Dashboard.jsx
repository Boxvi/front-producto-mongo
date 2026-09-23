// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { api, unwrapList } from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ productos: 0, categorias: 0, unidades: 0, valor: 0 });
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/categorias')])
      .then(([p, c]) => {
        const productos = unwrapList(p).data;
        const categorias = unwrapList(c).data;
        setStats({
          productos: productos.length,
          categorias: categorias.length,
          unidades: productos.reduce((s, x) => s + Number(x.stock || 0), 0),
          valor: productos.reduce((s, x) => s + Number(x.precio || 0) * Number(x.stock || 0), 0),
        });
        setLowStock(productos.filter((x) => Number(x.stock) < 5).slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      {/* Header */}
      <header className="mb-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-coral">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Resumen general
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
      </header>

      {/* Stats compactas — 4 en una fila */}
      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Productos" value={stats.productos} detail="en catálogo" accent="mint" icon="📦" />
        <StatCard label="Categorías" value={stats.categorias} detail="registradas" accent="lilac" icon="🏷️" />
        <StatCard label="Stock" value={stats.unidades.toLocaleString('es-PE')} detail="unidades" accent="yellow" icon="📊" />
        <StatCard label="Valor" value={`$ ${stats.valor.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`} detail="inventario" accent="coral" icon="💰" />
      </section>

      {/* Grid principal */}
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        {/* Accesos rápidos */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">Accesos rápidos</h2>
            <span className="text-[11px] text-muted">6 módulos</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <QuickLink to="/productos"      icon="📦" label="Productos"       desc="Inventario" />
            <QuickLink to="/categorias"     icon="🏷️" label="Categorías"      desc="Organizar" />
            <QuickLink to="/almacen"        icon="🏬" label="Almacén"         desc="Movimientos" />
            <QuickLink to="/notificaciones" icon="🔔" label="Notificaciones"  desc="Alertas" />
            <QuickLink to="/empresa"        icon="🏢" label="Empresa"         desc="Config" />
            <QuickLink to="/productos"      icon="➕" label="Nuevo producto"  desc="Crear" />
          </div>
        </section>

        {/* Alertas */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-bold">⚠️ Bajo stock</h2>
            <Link to="/almacen" className="text-[11px] font-bold text-coral hover:underline">Ver todo</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted">Todo en orden ✓</p>
          ) : (
            <ul className="space-y-1.5">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg bg-paper px-3 py-1.5">
                  <span className="truncate text-xs font-semibold">{p.nombre}</span>
                  <span className="ml-2 shrink-0 text-[11px] font-bold text-coral">{p.stock} u.</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label, desc }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-border p-3 transition hover:-translate-y-0.5 hover:border-ink hover:shadow-soft"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-mint text-base">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{label}</p>
        <p className="truncate text-[11px] text-muted">{desc}</p>
      </div>
    </Link>
  );
}
