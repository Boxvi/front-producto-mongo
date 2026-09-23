// src/components/EmptyState.jsx
export default function EmptyState({ title, description, onAdd, hasQuery }) {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-2xl">+</div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{description}</p>
      {!hasQuery && onAdd && (
        <button onClick={onAdd} className="mt-5 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white">
          Agregar
        </button>
      )}
    </div>
  );
}