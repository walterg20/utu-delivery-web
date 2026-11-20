'use client';

import { useState } from 'react';
import { CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react';
import { payments } from '@/lib/api';

export default function PagarPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await payments.createPreference(orderId);
      setResult(data);
      if (data?.initPoint) {
        window.open(data.initPoint, '_blank');
      }
    } catch (e: any) {
      setError(e?.message || 'Error al crear preferencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-[#10B981]">
          PAGOS · MERCADO PAGO
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#281714]">
          Pagar pedido
        </h1>
        <p className="mt-1 text-sm text-[#5C403A]">
          Genera una preferencia de pago y redirige al checkout de Mercado Pago.
        </p>
      </div>

      {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>}

      <div className="rounded-xl border border-[#E5BEB5] bg-white p-5 shadow-sm space-y-4">
        <label className="block text-sm font-medium text-[#5C403A]">ID del pedido</label>
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="uuid del pedido"
          className="w-full rounded-xl border border-[#E5BEB5] bg-white py-2 px-3 text-sm outline-none focus:border-[#FF4D29] focus:ring-2 focus:ring-[#FF4D29]/20"
        />
        <button
          onClick={handlePay}
          disabled={loading || !orderId}
          className="flex items-center gap-2 rounded-xl bg-[#FF4D29] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#FF4D29]/20 hover:bg-[#0B192C] disabled:opacity-50"
        >
          <CreditCard className="h-4 w-4" />
          {loading ? 'Generando...' : 'Pagar con Mercado Pago'}
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-[#E5BEB5] bg-white p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-[#10B981]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-semibold">Preferencia creada</span>
          </div>
          {result.initPoint && (
            <a
              href={result.initPoint}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#FF4D29] hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir checkout
            </a>
          )}
          <pre className="text-xs text-[#906F68] overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}