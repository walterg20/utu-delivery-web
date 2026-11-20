'use client';

import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { merchants } from '@/lib/api';

type Merchant = { businessName?: string; cuit?: string; address?: string; municipalQrUrl?: string };

const statusStyles: Record<string, { badge: string; icon: React.ReactNode }> = {
  ok: { badge: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  warn: { badge: 'bg-amber-50 text-amber-700', icon: <AlertTriangle className="h-3 w-3" /> },
  danger: { badge: 'bg-red-50 text-red-700', icon: <XCircle className="h-3 w-3" /> },
};

export default function FiscalizacionPage() {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await merchants.get();
        setMerchant(data);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const merchantsList = merchant
    ? [
        {
          name: merchant.businessName || 'Comercio',
          cuit: merchant.cuit || '—',
          ley: merchant.municipalQrUrl ? 'Habilitado' : 'Pendiente',
          seguro: '—',
          antecedentes: '—',
          status: merchant.municipalQrUrl ? 'ok' : 'warn',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#10B981]">
            FISCALIZACIÓN LEY 2608-L
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#281714]">
            Comercios y habilitación municipal
          </h1>
          <p className="mt-1 text-sm text-[#5C403A]">
            Bloqueo automático de repartidores sin inscripción, seguro comercial ni antecedentes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#E5BEB5] bg-white px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-[#906F68]" />
          <span className="font-mono text-xs text-[#5C403A]">Corte: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: 'Comercios adheridos', value: merchantsList.length.toString(), color: '#FF4D29', icon: <Building2 className="h-5 w-5" /> },
          { label: 'Habilitados Ley 2608-L', value: merchantsList.filter((m) => m.status === 'ok').length.toString(), color: '#10B981', icon: <ShieldCheck className="h-5 w-5" /> },
          { label: 'Pendientes de revisión', value: merchantsList.filter((m) => m.status === 'warn').length.toString(), color: '#F59E0B', icon: <AlertTriangle className="h-5 w-5" /> },
          { label: 'Bloqueados', value: merchantsList.filter((m) => m.status === 'danger').length.toString(), color: '#EF4444', icon: <XCircle className="h-5 w-5" /> },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-[#E5BEB5] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#5C403A]">{k.label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${k.color}15`, color: k.color }}>
                {k.icon}
              </span>
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[#281714]">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5BEB5] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5BEB5] px-5 py-4">
          <h2 className="text-base font-bold text-[#281714]">Padrón de comercios</h2>
          <button className="flex items-center gap-2 rounded-lg bg-[#FF4D29] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0B192C]">
            <FileCheck className="h-3.5 w-3.5" />
            Verificar QR Municipal
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5BEB5] text-left text-xs font-semibold uppercase tracking-wider text-[#906F68]">
                <th className="px-5 py-3">Comercio</th>
                <th className="px-5 py-3">CUIT</th>
                <th className="px-5 py-3">Ley 2608-L</th>
                <th className="px-5 py-3">Seguro comercial</th>
                <th className="px-5 py-3">Antecedentes</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-4 text-center text-[#906F68]">Cargando...</td>
                </tr>
              )}
              {!loading && merchantsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-4 text-center text-[#906F68]">Sin datos</td>
                </tr>
              )}
              {merchantsList.map((m) => {
                const st = statusStyles[m.status];
                return (
                  <tr key={m.cuit} className="border-b border-[#FFF0EE] last:border-0 hover:bg-[#FFF8F6]">
                    <td className="px-5 py-3 font-semibold text-[#281714]">{m.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-[#5C403A]">{m.cuit}</td>
                    <td className="px-5 py-3 text-[#281714]">{m.ley}</td>
                    <td className="px-5 py-3 text-[#281714]">{m.seguro}</td>
                    <td className="px-5 py-3 text-[#281714]">{m.antecedentes}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}>
                        {st.icon}
                        {m.status === 'ok' ? 'OK' : m.status === 'warn' ? 'Revisar' : 'Bloqueado'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[#EF4444]/20 bg-[#FEF2F2] p-4 text-sm text-[#991B1B]">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          Bloqueo automático activo
        </div>
        <p className="mt-1 text-xs">
          Los repartidores sin inscripción, seguro comercial vigente o antecedentes aprobados son bloqueados
          automáticamente del sistema de asignación de pedidos.
        </p>
      </div>
    </div>
  );
}