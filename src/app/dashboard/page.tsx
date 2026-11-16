'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndex() {
  const router = useRouter();
  useEffect(() => {
    router.push('/dashboard/profile');
  }, [router]);
  return <div className="p-8">Redirigiendo...</div>;
}
