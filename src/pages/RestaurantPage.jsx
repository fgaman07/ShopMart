import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight, Loader2, ShoppingBag, ArrowLeft, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';

export default function RestaurantPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restRes, prodRes, revRes] = await Promise.all([
          fetch(`/api/restaurants/${id}`),
          fetch(`/api/products?restaurant=${id}`),
          fetch(`/api/reviews/restaurant/${id}`)
        ]);
        const restData = await restRes.json();
        const prodData = await prodRes.json();
        const revData = await revRes.json();
        setRestaurant(restData);
        setProducts(prodData);
        setReviews(Array.isArray(revData) ? revData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isOpen = (operatingHours) => {
    if (!operatingHours) return true;
    const { openTime, closeTime } = operatingHours;
    if (!openTime || !closeTime) return true;
    const now = new Date();
    const t = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    return t >= openTime && t <= closeTime;
  };

  const handleAddToCart = (product) => {
    addToCart({ id: product._id, title: product.title, price: product.price, image: product.image, weight: product.weight, restaurant: product.restaurant });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-xl font-semibold mb-4">Restaurant not found.</p>
        <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const open = isOpen(restaurant.operatingHours);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link to="/" className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">{restaurant.name}</h1>
              <p className="text-white/80 text-sm max-w-xl">{restaurant.description}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${open ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {open ? '● Open Now' : '● Closed'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-5 mt-3 text-sm text-white/80">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'} ({restaurant.numReviews} reviews)
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {restaurant.address}
            </span>
            {restaurant.operatingHours && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {restaurant.operatingHours.openTime} – {restaurant.operatingHours.closeTime}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-primary w-6 h-6" /> Menu
          </h2>
          <span className="text-sm text-gray-400">{products.length} items</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No menu items yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                <Link to={`/product/${product._id}`} className="block h-44 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${product._id}`} className="font-semibold text-gray-800 hover:text-primary line-clamp-2 mb-1">
                    {product.title}
                  </Link>
                  <p className="text-xs text-gray-400 mb-3">{product.weight}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-lg font-bold text-primary">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!open}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                        open
                          ? addedId === product._id
                            ? 'bg-green-500 text-white'
                            : 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {addedId === product._id ? '✓ Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-primary w-6 h-6" /> Reviews
          </h2>
          <span className="text-sm text-gray-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ReviewForm
              restaurantId={id}
              onReviewAdded={(newReview) => setReviews(prev => [newReview, ...prev])}
            />
          </div>
          <div className="lg:col-span-2 space-y-3">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map(r => <ReviewCard key={r._id} review={r} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
