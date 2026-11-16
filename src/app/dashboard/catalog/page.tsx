'use client';

import { useEffect, useState } from 'react';
import { categories, products } from '@/lib/api';

interface Category {
  id: string;
  name: string;
  sortOrder: number;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  isAvailable: boolean;
  categoryId: string;
}

export default function CatalogPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newProd, setNewProd] = useState({ name: '', description: '', price: '', categoryId: '' });
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    const data = await categories.list();
    setCats(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await categories.create({ name: newCatName });
    setNewCatName('');
    loadCategories();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.categoryId) return;
    await products.create({
      name: newProd.name,
      description: newProd.description,
      price: Number(newProd.price),
      categoryId: newProd.categoryId,
    });
    setNewProd({ name: '', description: '', price: '', categoryId: '' });
    loadCategories();
  };

  const handleToggle = async (id: string) => {
    await products.toggle(id);
    loadCategories();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return;
    await products.delete(id);
    loadCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Eliminar categoría y sus productos?')) return;
    await categories.delete(id);
    loadCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      {/* Create category */}
      <form onSubmit={handleCreateCategory} className="mb-6 flex gap-2">
        <input
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="Nueva categoría"
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
          Agregar
        </button>
      </form>

      {/* Categories and products */}
      {cats.map((cat) => (
        <div key={cat.id} className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">{cat.name}</h2>
            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 text-sm hover:underline">
              Eliminar
            </button>
          </div>

          {/* Products */}
          <div className="space-y-2 mb-4">
            {(cat.products || []).map((prod) => (
              <div key={prod.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <span className={`font-medium ${!prod.isAvailable ? 'line-through text-gray-400' : ''}`}>
                    {prod.name}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">${prod.price}</span>
                  {prod.description && <p className="text-sm text-gray-400">{prod.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(prod.id)}
                    className={`text-sm px-3 py-1 rounded-lg ${prod.isAvailable ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-text-muted'}`}
                  >
                    {prod.isAvailable ? 'Disponible' : 'No disponible'}
                  </button>
                  <button onClick={() => handleDeleteProduct(prod.id)} className="text-red-500 text-sm hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add product to this category */}
          <form
            onSubmit={(e) => {
              setNewProd({ ...newProd, categoryId: cat.id });
              handleCreateProduct(e);
            }}
            className="flex gap-2"
          >
            <input
              value={newProd.categoryId === cat.id ? newProd.name : ''}
              onChange={(e) => setNewProd({ name: e.target.value, description: '', price: newProd.price, categoryId: cat.id })}
              placeholder="Nombre del producto"
              className="border rounded px-2 py-1 flex-1 text-sm"
            />
            <input
              type="number"
              value={newProd.categoryId === cat.id ? newProd.price : ''}
              onChange={(e) => setNewProd({ ...newProd, price: e.target.value, categoryId: cat.id })}
              placeholder="Precio"
              className="border rounded px-2 py-1 w-24 text-sm"
            />
            <button type="submit" className="bg-accent text-white px-3 py-1 rounded-lg text-sm hover:bg-accent-dark transition-colors">
              +
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
