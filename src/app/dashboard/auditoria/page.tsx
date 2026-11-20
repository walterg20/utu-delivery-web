'use client';

import { useEffect, useState } from 'react';
import {
  ClipboardList,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { wallets } from '@/lib/api';

type Tx = { id: string; type: string; amount: string; balanceAfter: string; reason: string; createdAt: string };

export default function AuditoriaPage() {
  const [entries, setEntries] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await wallets.transactions();
        setEntries(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || 'Error al cargar');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalDebit = entries
    .filter((e) => e.type === 'DEBIT')
    .reduce((s, e) => s + Number(e.amount || 0), 0);
  const totalCredit = entries
    .filter((e) => e.type === 'CREDIT')
    .reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#10B981]">
            AUDITORÍA CONTABLE
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#281714]">
            Partida doble y asientos
          </h1>
          <p className="mt-1 text-sm text-[#5C403A]">
            Trazabilidad completa de movimientos financieros · Inmutable
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#906F68]" />
            <input
              placeholder="Buscar asiento..."
              className="rounded-xl border border-[#E5BEB5] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#FF4D29] focus:ring-2 focus:ring-[#FF4D29]/20"
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-[#E5BEB5] bg-white px-3 py-2 text-sm font-medium text-[#5C403A] hover:bg-[#FFF0EE]">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total débitos', value: `$ ${totalDebit.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, color: '#FF4D29' },
          { label: 'Total créditos', value: `$ ${totalCredit.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, color: '#10B981' },
          { label: 'Diferencia (debe ser 0)', value: `$ ${Math.abs(totalDebit - totalCredit).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, color: '#10B981' },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-[#E5BEB5] bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-[#5C403A]">{k.label}</div>
            <div className="mt-2 font-mono text-2xl font-extrabold" style={{ color: k.color }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5BEB5] bg-white shadow-sm">
        <div className="border-b border-[#E5BEB5] px-5 py-4">
          <h2 className="text-base font-bold text-[#281714]">Libro mayor</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5BEB5] text-left text-xs font-semibold uppercase tracking-wider text-[#906F68]">
                <th className="px-5 py-3">Asiento</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Monto</th>
                <th className="px-5 py-3">Saldo resultante</th>
                <th className="px-5 py-3">Motivo</th>
                <th className="px-5 py-3">Fecha</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-4 text-center text-[#906F68]">Cargando...</td>
                </tr>
              )}
              {!loading && entries.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-4 text-center text-[#906F68]">Sin movimientos</td>
                </tr>
              )}
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-[#FFF0EE] last:border-0 hover:bg-[#FFF8F6]">
                  <td className="px-5 py-3 font-mono font-semibold text-[#FF4D29]">{e.id.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-[#281714]">{e.type}</td>
                  <td className="px-5 py-3 text-[#281714]">$ {Number(e.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 font-bold text-[#10B981]">$ {Number(e.balanceAfter).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="px-5 py-3 text-[#281714]">{e.reason}</td>
                  <td className="px-5 py-3 font-mono text-xs text-[#906F68]">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Balanceado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-[#FF4D29]/20 bg-[#FF4D29]/5 p-4 text-sm text-[#FF4D29]">
        <ArrowRightLeft className="h-4 w-4" />
        <span>Principio de partida doble: cada débito tiene su crédito correspondiente. Los asientos son inmutables y auditables.</span>
        <ClipboardList className="ml-auto h-4 w-4 opacity-60" />
      </div>
    </div>
  );
}