import { useState, useEffect } from 'react';
import { furnitureApi, Furniture, reviewApi, Review, orderApi, Order } from '../lib/api';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [recommended, setRecommended] = useState<Furniture[]>([]);
  const [userId, setUserId] = useState<string>('11111111-1111-1111-1111-111111111111');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFurniture();
    loadRecommended();
  }, [userId]);

  const loadFurniture = async () => {
    try {
      const response = await furnitureApi.getAll();
      setFurniture(response.data);
    } catch (error) {
      console.error('Error loading furniture:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommended = async () => {
    try {
      const response = await furnitureApi.getRecommended(userId);
      setRecommended(response.data);
    } catch (error) {
      console.error('Error loading recommended:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-gray-800 cursor-pointer">Furniture Store</h1>
          </Link>
          <Link href="/cart">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Cart
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {recommended.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((item) => (
                <Link key={item.id} href={`/furniture/${item.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.images[0] || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">All Furniture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {furniture.map((item) => (
              <Link key={item.id} href={`/furniture/${item.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.images[0] || '/placeholder.jpg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

