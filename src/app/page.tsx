import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Utu Delivery</h1>
        <p className="text-gray-600 mb-6">Portal de comercios</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Ingresar
        </Link>
      </div>
    </div>
  );
}
