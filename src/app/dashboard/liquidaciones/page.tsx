'use client';

import { useEffect, useState } from 'react';
import {
  Receipt,
  Download,
  DollarSign,
  Percent,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { orders } from '@/lib/api';

type Order = { id: string; status: string; total: string; commission: string; createdAt: string };

export default function LiquidacionesPage() {
  const [tab, setTab] = useState<'resumen' | 'detalle'>('resumen');
  const [list, setList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await orders.list();
        setList(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n: number) => `$ ${n.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

  const paid = list.filter((o) => ['PAID', 'KITCHEN', 'ROAD', 'DONE'].includes(o.status));
  const gross = paid.reduce((s, o) => s + Number(o.total || 0), 0);
  const commission = paid.reduce((s, o) => s + Number(o.commission || 0), 0);
  const net = gross - commission;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#10B981]">
            LIQUIDACIONES Y COMISIONES
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#281714]">
            Liquidaciones del comercio
          </h1>
          <p className="mt-1 text-sm text-[#5C403A]">
            Comisión transparente del 6% · Partida doble · Exportación contable
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#FF4D29] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4D29]/20 hover:bg-[#0B192C]">
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Ventas brutas (mes)', value: fmt(gross), icon: <DollarSign className="h-5 w-5" />, color: '#FF4D29' },
          { label: 'Comisión 6%', value: fmt(commission), icon: <Percent className="h-5 w-5" />, color: '#F59E0B' },
          { label: 'Neto a cobrar', value: fmt(net), icon: <Receipt className="h-5 w-5" />, color: '#10B981' },
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

      <div className="inline-flex rounded-xl bg-[#FFF0EE] p-1">
        {(['resumen', 'detalle'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-white text-[#281714] shadow-sm' : 'text-[#5C403A] hover:text-[#281714]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5BEB5] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5BEB5] text-left text-xs font-semibold uppercase tracking-wider text-[#906F68]">
                <th className="px-5 py-3">Pedido</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3">Bruto</th>
                <th className="px-5 py-3">Comisión 6%</th>
                <th className="px-5 py-3">Neto</th>
                <th className="px-5 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-5 py-4 text-center text-[#906F68]">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-4 text-center text-[#906F68]">
                    Sin pedidos
                  </td>
                </tr>
              )}
              {list.map((o) => {
                const t = Number(o.total || 0);
                const c = Number(o.commission || 0);
                return (
                  <tr key={o.id} className="border-b border-[#FFF0EE] last:border-0 hover:bg-[#FFF8F6]">
                    <td className="px-5 py-3 font-mono font-semibold text-[#FF4D29]">#{o.id.slice(0, 8)}</td>
                    <td className="px-5 py-3 text-[#281714]">{o.status}</td>
                    <td className="px-5 py-3 text-[#281714]">{fmt(t)}</td>
                    <td className="px-5 py-3 text-[#F59E0B] font-semibold">{fmt(c)}</td>
                    <td className="px-5 py-3 font-bold text-[#10B981]">{fmt(t - c)}</td>
                    <td className="px-5 py-3 font-mono text-xs text-[#906F68]">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-[#906F68]">
        <FileText className="h-3.5 w-3.5" />
        <span>Registros contables bajo partida doble · Auditoría disponible en módulo Auditoría.</span>
        <Calendar className="ml-2 h-3.5 w-3.5" />
        <span>Próxima liquidación: 15/12/2024</span>
      </div>
    </div>
  );
}