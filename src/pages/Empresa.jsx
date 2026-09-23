import { useState } from 'react';
import StatCard from '../components/StatCard';

export default function Empresa() {
  const [data, setData] = useState({
    nombre: 'Store Boris',
    ruc: '',
    direccion: '',
    telefono: '',
    email: '',
    moneda: 'PEN',
  });

  const update = (e) => setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-4">
        <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-coral">
          <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Configuración
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">Empresa</h1>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Razón social" value="—" detail="por configurar" accent="mint" icon="🏢" />
        <StatCard label="RUC" value="—" detail="sin registrar" accent="yellow" icon="📄" />
        <StatCard label="Moneda" value={data.moneda} detail="base" accent="sky" icon="💱" />
        <StatCard label="Sucursales" value={1} detail="activas" accent="lilac" icon="📍" />
      </section>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="mb-4 font-display text-base font-bold">Datos de la empresa</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre"      name="nombre"    value={data.nombre}    onChange={update} />
            <Field label="RUC"         name="ruc"       value={data.ruc}       onChange={update} />
            <Field label="Teléfono"    name="telefono"  value={data.telefono}  onChange={update} />
            <Field label="Email"       name="email"     value={data.email}     onChange={update} />
            <div className="sm:col-span-2">
              <Field label="Dirección" name="direccion" value={data.direccion} onChange={update} />
            </div>
            <div>
              <label className="label">Moneda</label>
              <select name="moneda" value={data.moneda} onChange={update} className="field">
                <option value="PEN">Soles (PEN)</option>
                <option value="USD">Dólares (USD)</option>
                <option value="EUR">Euros (EUR)</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-3 border-t border-border pt-4">
            <button className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white">Guardar cambios</button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="mb-3 font-display text-base font-bold">Sobre el sistema</h2>
          <ul className="space-y-2 text-xs text-muted">
            <li className="flex justify-between"><span>Versión</span><span className="font-bold text-ink">1.0.0</span></li>
            <li className="flex justify-between"><span>Backend</span><span className="font-bold text-ink">Spring Boot</span></li>
            <li className="flex justify-between"><span>API</span><span className="font-bold text-ink">v2</span></li>
            <li className="flex justify-between"><span>DB</span><span className="font-bold text-ink">MongoDB</span></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange }) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input id={name} name={name} value={value} onChange={onChange} className="field" />
    </div>
  );
}