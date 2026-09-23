import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { api, unwrapList } from '../api/client';

export default function Almacen() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    api.get('/productos').then((r) => setProductos(unwrapList(r).data)).catch(() => {});
  }, []);

  const sinStock = productos.filter((p) => Number(p.stock) === 0);
  const bajo = productos.filter((p) => Number(p.stock) > 0 && Number(p.stock) < 5);
  const ok = productos.filter((p) => Number(p.stock) >= 5);

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-coral">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Inventario
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Almacén</h1>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total SKU" value={productos.length} detail="productos" accent="mint" icon="📦" />
        <StatCard label="OK" value={ok.length} detail="stock ≥ 5" accent="sky" icon="✅" />
        <StatCard label="Bajo" value={bajo.length} detail="stock < 5" accent="yellow" icon="⚠️" />
        <StatCard label="Sin stock" value={sinStock.length} detail="agotados" accent="coral" icon="🚫" />
      </section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <StockList title="⚠️ Stock bajo" items={bajo} accent="text-amber-600" />
        <StockList title="🚫 Agotados" items={sinStock} accent="text-coral" />
      </div>
    </div>
  );
}

function StockList({ title, items, accent }) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      <div className="border-b border-border p-4">
        <h2 className="font-display text-base font-bold">{title}</h2>
        <p className="text-[11px] text-muted">{items.length} productos</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted">Sin registros</p>
        ) : (
          <ul className="space-y-1.5">
            {items.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-lg bg-paper px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <img src={p.fotoUrl} alt="" className="h-8 w-8 rounded-md object-cover" />
                  <span className="truncate text-sm font-semibold">{p.nombre}</span>
                </div>
                <span className={`ml-2 shrink-0 text-xs font-bold ${accent}`}>{p.stock} u.</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}