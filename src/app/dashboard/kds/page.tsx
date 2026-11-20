'use client';

import { useEffect, useState } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  Flame,
  Bell,
  Maximize2,
} from 'lucide-react';
import { orders } from '@/lib/api';

type OrderItem = { id: string; productName: string; quantity: number };
type Order = {
  id: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
  deliveryAddress?: string;
};

const STATUS_COLUMNS = [
  { key: 'CREATED', title: 'Nuevos', color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'KITCHEN', title: 'En cocina', color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'ROAD', title: 'Listo para despacho', color: '#10B981', bg: '#D1FAE5' },
];

const NEXT_STATUS: Record<string, string> = {
  CREATED: 'KITCHEN',
  PAID: 'KITCHEN',
  KITCHEN: 'ROAD',
  ROAD: 'DONE',
};

export default function KdsPage() {
  const [dark, setDark] = useState(false);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await orders.list();
      setOrdersList(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (id: string, status: string) => {
    const next = NEXT_STATUS[status];
    if (!next) return;
    try {
      await orders.updateStatus(id, next);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Error al actualizar estado');
    }
  };

  const columns = STATUS_COLUMNS.map((col) => ({
    ...col,
    orders: ordersList.filter((o) => o.status === col.key || (col.key === 'CREATED' && o.status === 'PAID')),
  }));

  return (
    <div className={`-m-4 min-h-screen p-4 lg:-m-8 lg:p-6 ${dark ? 'bg-[#0B1020] text-white' : 'bg-[#FFF8F6]'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Kitchen Display System</h1>
            <p className="font-mono text-xs text-[#906F68]">Comandera táctil · Tiempo real · Sala #1</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((v) => !v)}
            className="rounded-lg border border-[#E5BEB5] bg-white px-3 py-2 text-xs font-semibold text-[#5C403A] hover:bg-[#FFF0EE] dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {dark ? 'Modo claro' : 'Modo cocina (oscuro)'}
          </button>
          <button
            onClick={load}
            className="rounded-lg border border-[#E5BEB5] bg-white px-3 py-2 text-xs font-semibold text-[#5C403A] hover:bg-[#FFF0EE]"
          >
            Refrescar
          </button>
          <button className="relative rounded-lg bg-[#FF4D29] p-2 text-white">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold">
              {ordersList.filter((o) => o.status === 'CREATED' || o.status === 'PAID').length}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
      )}
      {loading && <p className="text-sm text-[#906F68]">Cargando pedidos...</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col">
            <div
              className="mb-3 flex items-center justify-between rounded-xl px-4 py-3"
              style={{ backgroundColor: col.bg }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-sm font-bold" style={{ color: col.color }}>
                  {col.title}
                </span>
              </div>
              <span className="font-mono text-xs font-bold" style={{ color: col.color }}>
                {col.orders.length}
              </span>
            </div>

            <div className="space-y-3">
              {col.orders.map((o) => (
                <div
                  key={o.id}
                  className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md ${
                    dark ? 'border-white/10 bg-white/5' : 'border-[#E5BEB5] bg-white'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-base font-extrabold text-[#FF4D29]">
                      #{o.id.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-xs text-[#906F68]">
                      <Clock className="h-3 w-3" />
                      {new Date(o.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {o.items?.map((it, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
                        <span>
                          {it.quantity}x {it.productName}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {o.deliveryAddress && (
                    <p className="mt-2 rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                      Dir: {o.deliveryAddress}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => advance(o.id, o.status)}
                      disabled={!NEXT_STATUS[o.status]}
                      className="flex-1 rounded-lg bg-[#10B981] py-2 text-xs font-bold text-white hover:bg-[#047857] disabled:opacity-40"
                    >
                      <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />
                      Avanzar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}