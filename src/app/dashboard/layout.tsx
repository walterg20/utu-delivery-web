'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setUser(data);
        }
      });
  }, [router]);

  if (!user) return <div className="p-8">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-dark shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-lg text-white">Utu Delivery</span>
          <div className="flex gap-4">
            <Link href="/dashboard/profile" className="text-white/80 hover:text-white">Perfil</Link>
            <Link href="/dashboard/catalog" className="text-white/80 hover:text-white">Catálogo</Link>
            <button
              onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
              className="text-white/70 hover:text-white"
            >
              Salir
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
