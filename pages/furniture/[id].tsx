import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { furnitureApi, Furniture, reviewApi, Review } from '../lib/api';
import Image from 'next/image';
import ImagePopup from '../components/ImagePopup';
import ReviewForm from '../components/ReviewForm';

export default function FurnitureDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [furniture, setFurniture] = useState<Furniture | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadFurniture();
      loadReviews();
    }
  }, [id]);

  const loadFurniture = async () => {
    try {
      const response = await furnitureApi.getById(id as string);
      setFurniture(response.data);
    } catch (error) {
      console.error('Error loading furniture:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await reviewApi.getByFurniture(id as string);
      setReviews(response.data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (furniture) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.furnitureId === furniture.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          furnitureId: furniture.id,
          furniture,
          quantity,
          price: furniture.price,
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      router.push('/cart');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!furniture) {
    return <div className="flex justify-center items-center min-h-screen">Furniture not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{furniture.name}</h1>
          </div>
          <button
            onClick={() => router.push('/cart')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cart
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative h-96 w-full mb-4">
                <Image
                  src={furniture.images[0] || '/placeholder.jpg'}
                  alt={furniture.name}
                  fill
                  className="object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedImage(furniture.images[0])}
                />
              </div>
              {furniture.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {furniture.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-20 w-full">
                      <Image
                        src={img}
                        alt={`${furniture.name} ${idx + 2}`}
                        fill
                        className="object-cover rounded cursor-pointer"
                        onClick={() => setSelectedImage(img)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4">{furniture.name}</h2>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                ${furniture.price.toFixed(2)}
              </p>
              <p className="text-gray-600 mb-6">{furniture.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Dimensions:</h3>
                <p className="text-gray-600">
                  Width: {furniture.width}cm × Height: {furniture.height}cm × Depth: {furniture.depth}cm
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Category:</h3>
                <p className="text-gray-600">{furniture.category}</p>
              </div>

              <div className="mb-6">
                <label className="font-semibold mr-4">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={furniture.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="border rounded px-3 py-2 w-20"
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!furniture.inStock}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white ${
                  furniture.inStock
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {furniture.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <ReviewForm furnitureId={furniture.id} onReviewAdded={loadReviews} />
          <div className="mt-8 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold">{review.user.name}</span>
                  <span className="ml-4 text-yellow-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {selectedImage && (
        <ImagePopup
          imageUrl={selectedImage}
          furniture={furniture}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

