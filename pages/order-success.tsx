import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { orderApi, Order } from '../lib/api';
import Image from 'next/image';

export default function OrderSuccess() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderApi.getById(id as string);
      setOrder(response.data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!order) {
    return <div className="flex justify-center items-center min-h-screen">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          <div className="space-y-2 mb-4">
            <p><span className="font-semibold">Order ID:</span> {order.id}</p>
            <p><span className="font-semibold">Status:</span> {order.status}</p>
            <p><span className="font-semibold">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
            <p><span className="font-semibold">Shipping Address:</span> {order.shippingAddress}</p>
            <p><span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Items Ordered:</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-2 mb-2">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src={item.furniture.images[0] || '/placeholder.jpg'}
                    alt={item.furniture.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.furniture.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

