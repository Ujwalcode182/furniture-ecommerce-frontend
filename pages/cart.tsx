import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { orderApi, Order } from '../lib/api';
import Image from 'next/image';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState({ id: '11111111-1111-1111-1111-111111111111', name: 'John Doe', email: 'john@example.com', address: '123 Main St' });
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
    setShippingAddress(user.address);
  }, []);

  const updateQuantity = (furnitureId: string, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.furnitureId === furnitureId ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (furnitureId: string) => {
    const updatedCart = cart.filter((item) => item.furnitureId !== furnitureId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatPrice = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    return isFinite(num) ? num.toFixed(2) : '0.00';
  };

  const getLocalImageFor = (item: any) => {
    const furniture = item?.furniture;
    const name = (furniture?.name || '').toLowerCase();
    const category = (furniture?.category || '').toLowerCase();
    const text = `${name} ${category}`.trim();
    if (!text) return '/images/placeholder.svg';
    if (text.includes('sofa') || text.includes('couch')) return '/images/sofa.svg';
    if (text.includes('chair')) return '/images/chair.svg';
    if (text.includes('coffee') && text.includes('table')) return '/images/coffee-table.svg';
    if (text.includes('table')) return '/images/table.svg';
    if (text.includes('bed')) return '/images/bed.svg';
    return '/images/placeholder.svg';
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        userId: user.id,
        items: cart.map((item) => ({
          furnitureId: item.furnitureId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
      };

      const response = await orderApi.create(orderData);
      localStorage.removeItem('cart');
      router.push(`/order-success?id=${response.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <div></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Cart Items</h2>
              {cart.map((item) => (
                <div key={item.furnitureId} className="flex border-b pb-4 mb-4">
                  <div className="relative w-32 h-32 mr-4">
                    {(() => {
                      const imgSrc = getLocalImageFor(item);
                      const isPlaceholder = imgSrc.endsWith('/placeholder.svg');
                      return (
                        <>
                          <Image
                            src={imgSrc}
                            alt={item?.furniture?.name || 'Item'}
                            fill
                            className="object-cover rounded"
                          />
                          {isPlaceholder && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-xs rounded">
                              No image
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item?.furniture?.name || 'Item'}</h3>
                    <p className="text-gray-600">${formatPrice(item.price)}</p>
                    <div className="flex items-center mt-2">
                      <label className="mr-2">Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.furnitureId, parseInt(e.target.value) || 1)}
                        className="border rounded px-2 py-1 w-20"
                      />
                      <button
                        onClick={() => removeItem(item.furnitureId)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Shipping Address:</label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

