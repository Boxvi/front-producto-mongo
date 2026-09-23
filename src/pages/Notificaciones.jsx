import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { api, unwrapList } from '../api/client';

export default function Notificaciones() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/productos'), api.get('/categorias')])
      .then(([p, c]) => {
        setProductos(unwrapList(p).data);
        setCategorias(unwrapList(c).data);
      })
      .catch(() => {});
  }, []);

  const alerts = [
    ...productos.filter((p) => Number(p.stock) === 0).map((p) => ({
      id: `ns-${p.id}`, type: 'danger', icon: '🚫',
      title: `${p.nombre} agotado`, desc: 'Sin stock disponible',
    })),
    ...productos.filter((p) => Number(p.stock) > 0 && Number(p.stock) < 5).map((p) => ({
      id: `ls-${p.id}`, type: 'warning', icon: '⚠️',
      title: `${p.nombre} con stock bajo`, desc: `Quedan ${p.stock} unidades`,
    })),
    ...categorias.filter((c) => !c.descripcion).map((c) => ({
      id: `cd-${c.id}`, type: 'info', icon: '📝',
      title: `Categoría "${c.nombre}" sin descripción`, desc: 'Complétala para mejor organización',
    })),
  ];

  const byType = (t) => alerts.filter((a) => a.type === t).length;

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-coral">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Centro de avisos
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Notificaciones</h1>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total" value={alerts.length} detail="alertas" accent="mint" icon="🔔" />
        <StatCard label="Críticas" value={byType('danger')} detail="requieren acción" accent="coral" icon="🚫" />
        <StatCard label="Advertencias" value={byType('warning')} detail="revisar" accent="yellow" icon="⚠️" />
        <StatCard label="Sugerencias" value={byType('info')} detail="opcionales" accent="sky" icon="💡" />
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {alerts.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">Sin notificaciones ✓</p>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.id} className={`flex items-start gap-3 rounded-xl p-3 ${
                  a.type === 'danger' ? 'bg-[#fff0ec]' :
                  a.type === 'warning' ? 'bg-[#fff8e6]' : 'bg-paper'
                }`}>
                  <span className="text-xl">{a.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink">{a.title}</p>
                    <p className="text-[11px] text-muted">{a.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}