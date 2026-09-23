
// src/pages/Productos.jsx
import { useEffect, useMemo, useState } from 'react';
import { useCrud } from '../hooks/useCrud';
import Modal from '../components/Modal';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { ShowAlert } from '../Functions';
import { api, unwrapList, unwrap } from '../api/client';

const emptyForm = { id: '', nombre: '', fotoUrl: '', precio: '', stock: '', categoria: '' };

export default function Productos() {
  const {
    items: products, form, setForm, loading, saving,
    load, openForm, updateField, save, remove,
  } = useCrud({ endpoint: '/productos', emptyForm });

  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  useEffect(() => {
    load();
    loadCategories();
  }, [load]);

  async function loadCategories() {
    try {
      const { data } = unwrapList(await api.get('/categorias'));
      setCategories(data);
    } catch (e) {
      console.error('Categorías no disponibles', e);
    }
  }

  const filtered = useMemo(() => products.filter((p) => {
    const q = query.toLowerCase();
    const matchQ = `${p.nombre} ${p.id}`.toLowerCase().includes(q);
    const matchC = categoryFilter === 'Todas' || (p.categoria || 'Sin categoría') === categoryFilter;
    return matchQ && matchC;
  }), [products, query, categoryFilter]);

  const totalStock = products.reduce((s, p) => s + Number(p.stock || 0), 0);
  const inventoryValue = products.reduce((s, p) => s + Number(p.precio || 0) * Number(p.stock || 0), 0);

  const handleOpen = (p = null) => { openForm(p); setIsFormOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.fotoUrl.trim() || form.precio === '' || form.stock === '') {
      ShowAlert('Campos incompletos', 'Completa todos los campos.', 'warning');
      return;
    }
    const ok = await save((f, isEditing) => ({
      ...(isEditing && { id: f.id }),
      nombre: f.nombre.trim(),
      fotoUrl: f.fotoUrl.trim(),
      precio: Number(f.precio),
      stock: Number(f.stock),
      categoria: f.categoria || null,
    }));
    if (ok) setIsFormOpen(false);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((c) => (c.nombre || '').toLowerCase() === name.toLowerCase())) {
      ShowAlert('Repetida', 'Ya existe esa categoría.', 'info');
      return;
    }
    try {
      const { success, message } = unwrap(await api.post('/categorias', {
        nombre: name,
        descripcion: categoryDescription.trim(),
      }));
      if (!success) throw new Error(message);
      await loadCategories();
      setNewCategory('');
      setCategoryDescription('');
      setIsCategoryOpen(false);
      ShowAlert('Creada', 'Categoría disponible.', 'success');
    } catch (err) {
      ShowAlert('Error', err.response?.data?.message || err.message, 'error');
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
      <header className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-coral">
            <span className="h-2 w-2 rounded-full bg-coral" /> Inventario
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">Productos</h1>
        </div>
        <button onClick={() => handleOpen()} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white shadow-soft hover:bg-ink/90">
          + Nuevo producto
        </button>
      </header>

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="Productos" value={products.length} detail="en catálogo" accent="mint" />
        <StatCard label="Unidades" value={totalStock.toLocaleString('es-PE')} detail="stock" accent="yellow" />
        <StatCard label="Valor" value={`$ ${inventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`} detail="precio x stock" accent="coral" />
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-lg font-bold">Catálogo · {filtered.length}</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="field w-full sm:w-56" placeholder="Buscar..." />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="field sm:w-40">
              <option>Todas</option>
              {categories.map((c) => <option key={c.id || c.nombre}>{c.nombre}</option>)}
            </select>
            <button onClick={() => setIsCategoryOpen(true)} className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:border-ink">
              + Categoría
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-12 text-center text-sm text-muted">Cargando...</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No hay productos" description="Agrega el primero al catálogo." onAdd={() => handleOpen()} />
          ) : (
            <table className="w-full min-w-[700px] text-left">
              <thead className="sticky top-0 bg-paper text-[11px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-3 font-bold">Producto</th>
                  <th className="px-5 py-3 font-bold">Categoría</th>
                  <th className="px-5 py-3 font-bold">Precio</th>
                  <th className="px-5 py-3 font-bold">Stock</th>
                  <th className="px-5 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const low = Number(p.stock) < 5;
                  return (
                    <tr key={p.id} className="group hover:bg-paper">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img className="h-10 w-10 rounded-lg object-cover" src={p.fotoUrl} alt="" />
                          <div>
                            <p className="font-bold text-ink">{p.nombre}</p>
                            <p className="max-w-[160px] truncate text-xs text-muted">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-mint px-2.5 py-1 text-xs font-bold text-ink">{p.categoria || 'Sin categoría'}</span>
                      </td>
                      <td className="px-5 py-3 text-sm font-bold">$ {Number(p.precio || 0).toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-bold ${low ? 'text-coral' : 'text-ink'}`}>{p.stock} {low && <span className="text-[10px] uppercase">Bajo</span>}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100">
                          <button onClick={() => handleOpen(p)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold hover:border-ink">Editar</button>
                          <button onClick={() => remove(p, 'producto')} className="rounded-lg px-3 py-1.5 text-xs font-bold text-coral hover:bg-[#fff0ec]">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {isFormOpen && (
        <Modal title={form.id ? 'Editar producto' : 'Nuevo producto'} onClose={() => setIsFormOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="nombre">Nombre</label>
                <input id="nombre" name="nombre" value={form.nombre} onChange={updateField} className="field" autoFocus />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fotoUrl">URL de imagen</label>
                <input id="fotoUrl" name="fotoUrl" value={form.fotoUrl} onChange={updateField} className="field" />
              </div>
              <div>
                <label className="label" htmlFor="precio">Precio</label>
                <input id="precio" name="precio" type="number" min="0" step="0.01" value={form.precio} onChange={updateField} className="field" />
              </div>
              <div>
                <label className="label" htmlFor="stock">Stock</label>
                <input id="stock" name="stock" type="number" min="0" value={form.stock} onChange={updateField} className="field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="categoria">Categoría</label>
                <select id="categoria" name="categoria" value={form.categoria} onChange={updateField} className="field">
                  <option value="">Sin categoría</option>
                  {categories.map((c) => <option key={c.id || c.nombre} value={c.nombre}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <button type="button" onClick={() => setIsFormOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted hover:bg-stone-100">Cancelar</button>
              <button disabled={saving} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isCategoryOpen && (
        <Modal title="Nueva categoría" onClose={() => setIsCategoryOpen(false)}>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="label" htmlFor="newCategory">Nombre</label>
              <input id="newCategory" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="field" autoFocus />
            </div>
            <div>
              <label className="label" htmlFor="catDesc">Descripción</label>
              <textarea id="catDesc" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} className="field min-h-24 resize-y" />
            </div>
            <div className="flex justify-end gap-3 border-t border-border pt-5">
              <button type="button" onClick={() => setIsCategoryOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-muted hover:bg-stone-100">Cancelar</button>
              <button className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white">Crear</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}