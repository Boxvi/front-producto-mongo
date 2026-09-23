// src/hooks/useCrud.js
import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ShowAlert } from '../Functions';
import { api, unwrap, unwrapList } from '../api/client';

const MySwal = withReactContent(Swal);

export function useCrud({ endpoint, listKey = 'data', emptyForm = {} }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, success, message } = unwrapList(await api.get(endpoint));
      if (!success) throw new Error(message || 'Error al cargar');
      setItems(data);
    } catch (err) {
      ShowAlert('No se pudo cargar', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const openForm = useCallback((item = null) => {
    setForm(item ? { ...emptyForm, ...item } : emptyForm);
  }, [emptyForm]);

  const updateField = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const save = useCallback(async (payloadBuilder) => {
    setSaving(true);
    try {
      const isEditing = Boolean(form.id);
      const payload = payloadBuilder ? payloadBuilder(form, isEditing) : form;
      const method = isEditing ? 'put' : 'post';
      const { success, message } = unwrap(await api[method](endpoint, payload));
      ShowAlert(success ? 'Listo' : 'Error', message || 'Respuesta del servidor', success ? 'success' : 'error');
      if (success) { await load(); return true; }
      return false;
    } catch (err) {
      ShowAlert('Error', err.response?.data?.message || err.message, 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }, [form, endpoint, load]);

  const remove = useCallback(async (item, label = 'elemento') => {
    const res = await MySwal.fire({
      title: `¿Eliminar ${label}?`,
      text: `${item.nombre} se quitará del catálogo.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef765f',
    });
    if (!res.isConfirmed) return;
    try {
      const { success, message } = unwrap(await api.delete(`${endpoint}/${item.id}`));
      ShowAlert(success ? 'Eliminado' : 'Error', message || 'Respuesta del servidor', success ? 'success' : 'error');
      if (success) await load();
    } catch (err) {
      ShowAlert('Error', err.response?.data?.message || err.message, 'error');
    }
  }, [endpoint, load]);

  return { items, setItems, form, setForm, loading, saving, load, openForm, updateField, save, remove };
}