'use client';

import { useEffect, useState } from 'react';
import { merchants } from '@/lib/api';

export default function ProfilePage() {
  const [merchant, setMerchant] = useState<any>(null);
  const [form, setForm] = useState({ cuit: '', address: '', lat: '', lng: '', deliveryRadiusKm: 5, commissionPercent: 10, municipalQrUrl: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    merchants.get().then((m) => {
      setMerchant(m);
      setForm({
        cuit: m.cuit || '',
        address: m.address || '',
        lat: m.lat || '',
        lng: m.lng || '',
        deliveryRadiusKm: m.deliveryRadiusKm || 5,
        commissionPercent: m.commissionPercent || 10,
        municipalQrUrl: m.municipalQrUrl || '',
      });
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await merchants.update({
        cuit: form.cuit,
        address: form.address,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        deliveryRadiusKm: form.deliveryRadiusKm,
        commissionPercent: form.commissionPercent,
        municipalQrUrl: form.municipalQrUrl || undefined,
      });
      setMessage('Guardado correctamente');
    } catch (err: any) {
      setMessage(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Perfil del comercio</h1>
      {message && <p className={`mb-4 text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium mb-1">CUIT</label>
          <input value={form.cuit} onChange={(e) => setForm({ ...form, cuit: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitud</label>
            <input type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud</label>
            <input type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Radio de entrega (km)</label>
            <input type="number" value={form.deliveryRadiusKm} onChange={(e) => setForm({ ...form, deliveryRadiusKm: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comisión (%)</label>
            <input type="number" step="0.01" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL QR Municipal</label>
          <input value={form.municipalQrUrl} onChange={(e) => setForm({ ...form, municipalQrUrl: e.target.value })} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}
