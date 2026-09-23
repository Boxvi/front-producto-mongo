// src/pages/Categorias.jsx
import { useEffect, useMemo, useState } from 'react';
import { useCrud } from '../hooks/useCrud';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { ShowAlert } from '../Functions';

const emptyForm = { id: '', nombre: '', descripcion: '' };

export default function Categorias() {
  const {
    items: categories, form, loading, saving,
    load, openForm, updateField, save, remove,
  } = useCrud({ endpoint: '/categorias', emptyForm });

  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => `${c.nombre} ${c.descripcion || ''}`.toLowerCase().includes(q));
  }, [categories, query]);

  const handleOpen = (cat = null) => { openForm(cat); setIsModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      ShowAlert('Campo requerido', 'El nombre es obligatorio.', 'warning');
      return;
    }
    const ok = await save((f, isEditing) => ({
      ...(isEditing && { id: f.id }),
      nombre: f.nombre.trim(),
      descripcion: f.descripcion.trim(),
    }));
    if (ok) setIsModalOpen(false);
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
      <header className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-coral">
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Organización
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Categorías</h1>
        </div>
        <button
          onClick={() => handleOpen()}
          className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-ink/90"
        >
          + Nueva categoría
        </button>
      </header>

      {/* Stats — mismo ancho que Dashboard, 3 columnas */}
      <section className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Categorías" value={categories.length} detail="en total" accent="mint" icon="🏷️" />
        <StatCard label="Resultados" value={filtered.length} detail="visibles" accent="lilac" icon="🔍" />
        <StatCard label="Con descripción" value={categories.filter(c => c.descripcion).length} detail="documentadas" accent="sky" icon="📝" />
        <StatCard label="Sin descripción" value={categories.filter(c => !c.descripcion).length} detail="por completar" accent="coral" icon="⚠️" />
      </section>

      {/* Tabla */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-border p-4">
          <h2 className="font-display text-base font-bold">Todas las categorías</h2>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field w-56"
            placeholder="Buscar..."
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-muted">Cargando...</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={query ? 'Sin coincidencias' : 'No hay categorías'}
              description={query ? 'Prueba otro término.' : 'Crea la primera categoría.'}
              onAdd={() => handleOpen()}
              hasQuery={Boolean(query)}
            />
          ) : (
            <table className="w-full min-w-[600px] text-left">
              <thead className="sticky top-0 bg-paper text-[10px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-2.5 font-bold">Nombre</th>
                  <th className="px-5 py-2.5 font-bold">Descripción</th>
                  <th className="px-5 py-2.5 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((c) => (
                  <tr key={c.id} className="group hover:bg-paper">
                    <td className="px-5 py-3">
                      <p className="text-sm font-bold text-ink">{c.nombre}</p>
                      <p className="truncate text-[11px] text-muted">{c.id}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">{c.descripcion || '—'}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100">
                        <button onClick={() => handleOpen(c)} className="rounded-lg border border-border px-2.5 py-1 text-xs font-bold hover:border-ink">
                          Editar
                        </button>
                        <button onClick={() => remove(c, 'categoría')} className="rounded-lg px-2.5 py-1 text-xs font-bold text-coral hover:bg-[#fff0ec]">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isModalOpen && (
        <Modal title={form.id ? 'Editar categoría' : 'Nueva categoría'} onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label" htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" value={form.nombre} onChange={updateField} className="field" autoFocus />
            </div>
            <div>
              <label className="label" htmlFor="descripcion">Descripción</label>
              <textarea id="descripcion" name="descripcion" value={form.descripcion} onChange={updateField} className="field min-h-24 resize-y" />
            </div>
            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted hover:bg-stone-100">
                Cancelar
              </button>
              <button disabled={saving} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
