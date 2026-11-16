import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">Utu Delivery</h1>
        <p className="text-text-secondary mb-6">Portal de comercios</p>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Ingresar
        </Link>
      </div>
    </div>
  );
}
