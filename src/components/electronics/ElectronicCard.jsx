import { useState } from "react";
import { ShoppingCart } from "lucide-react";

const ElectronicCard = ({ item, onAddToCart }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  console.log("Item data:", item);

  const getCategoryBasedPlaceholder = (category) => {
    const categoryLower = (category || "").toLowerCase();

    if (
      categoryLower.includes("laptop") ||
      categoryLower.includes("computer")
    ) {
      return "https://placehold.co/450x300/4A90E2/FFFFFF/png?text=Laptop";
    } else if (
      categoryLower.includes("phone") ||
      categoryLower.includes("mobile")
    ) {
      return "https://placehold.co/450x300/50C878/FFFFFF/png?text=Smartphone";
    } else if (
      categoryLower.includes("gaming") ||
      categoryLower.includes("console")
    ) {
      return "https://placehold.co/450x300/FF6B6B/FFFFFF/png?text=Gaming";
    } else if (categoryLower.includes("camera")) {
      return "https://placehold.co/450x300/FFD93D/FFFFFF/png?text=Camera";
    } else if (
      categoryLower.includes("headphone") ||
      categoryLower.includes("audio")
    ) {
      return "https://placehold.co/450x300/9B59B6/FFFFFF/png?text=Audio";
    } else if (
      categoryLower.includes("tv") ||
      categoryLower.includes("monitor")
    ) {
      return "https://placehold.co/450x300/E74C3C/FFFFFF/png?text=Display";
    } else if (categoryLower.includes("tablet")) {
      return "https://placehold.co/450x300/3498DB/FFFFFF/png?text=Tablet";
    } else if (
      categoryLower.includes("watch") ||
      categoryLower.includes("wearable")
    ) {
      return "https://placehold.co/450x300/1ABC9C/FFFFFF/png?text=Wearable";
    } else if (
      categoryLower.includes("speaker") ||
      categoryLower.includes("streaming")
    ) {
      return "https://placehold.co/450x300/F39C12/FFFFFF/png?text=Media";
    } else if (
      categoryLower.includes("appliance") ||
      categoryLower.includes("vacuum")
    ) {
      return "https://placehold.co/450x300/8E44AD/FFFFFF/png?text=Appliance";
    } else {
      return "https://placehold.co/450x300/95A5A6/FFFFFF/png?text=Electronics";
    }
  };

  const getImageSrc = (item) => {
    // Check if imageUrl exists and is a valid URL format
    if (!item.imageUrl || item.imageUrl.trim() === "") {
      console.log(`No image URL for ${item.name}`);
      return getCategoryBasedPlaceholder(item.category);
    }

    // Basic URL validation
    try {
      const url = new URL(item.imageUrl);
      // Check for common problematic patterns
      if (
        url.hostname.includes("fitbit.com") ||
        url.hostname.includes("sony.scene7.com") ||
        url.pathname.includes("facebook")
      ) {
        console.log(
          `Known problematic image URL for ${item.name}: ${item.imageUrl}`
        );
        return getCategoryBasedPlaceholder(item.category);
      }
      return item.imageUrl;
    } catch (error) {
      console.log(`Invalid image URL for ${item.name}: ${item.imageUrl}`);
      return getCategoryBasedPlaceholder(item.category);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Price not available";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryArray = (categories) => {
    if (!categories) return [];
    if (typeof categories === "string") {
      return categories.split(",").map((cat) => cat.trim());
    }
    return [];
  };

  const getAvailabilityText = (availability) => {
    if (!availability) return "";

    const availabilityLower = availability.toLowerCase();
    if (
      availabilityLower === "yes" ||
      availabilityLower === "true" ||
      availabilityLower.includes("in stock")
    ) {
      return "In Stock";
    }
    return availability;
  };

  const getAvailabilityColor = (availability) => {
    if (!availability) return "text-gray-600";

    const availabilityLower = availability.toLowerCase();
    if (
      availabilityLower === "yes" ||
      availabilityLower === "true" ||
      availabilityLower.includes("in stock")
    ) {
      return "text-green-600";
    }
    return "text-yellow-600";
  };

  return (
    <div className="w-full max-w-[450px] border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="aspect-square w-full max-w-[450px] relative">
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <img
          src={getImageSrc(item)}
          alt={item.name}
          className={`w-full h-full object-contain p-4 ${
            imageLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          loading="lazy"
          onLoad={() => {
            setImageLoading(false);
            setImageError(false);
          }}
          onError={(e) => {
            console.log(
              `Image failed to load for ${item.name}: ${item.imageUrl}`
            );
            setImageLoading(false);
            setImageError(true);
            e.target.src = getCategoryBasedPlaceholder(item.category);
          }}
        />
        {item.prices?.isSale && (
          <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            On Sale
          </span>
        )}
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold line-clamp-2">
            {item.name || "No Name Available"}
          </h2>
          <p className="text-sm text-gray-500">
            Brand: {item.brand || "Unknown"}
          </p>
          {item.manufacturer && (
            <p className="text-sm text-gray-500">
              Manufacturer: {item.manufacturer}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            {item.prices?.amountMin && (
              <div className="text-2xl font-bold text-indigo-600">
                {formatPrice(item.prices.amountMin)}
                {item.prices.amountMax &&
                  item.prices.amountMax !== item.prices.amountMin &&
                  ` - ${formatPrice(item.prices.amountMax)}`}
              </div>
            )}
            {!item.prices?.amountMin && (
              <div className="text-xl font-semibold text-gray-500">
                Price not available
              </div>
            )}

            {item.prices?.merchant && (
              <div className="text-sm text-gray-600">
                Seller: {item.prices.merchant}
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          {item.prices?.amountMin && onAddToCart && (
            <button
              onClick={() =>
                onAddToCart({
                  id: item.id || Date.now(), // Use item ID or fallback
                  name: item.name || "Unknown Product",
                  price: item.prices.amountMin,
                  image: getImageSrc(item),
                  brand: item.brand,
                  category: item.primaryCategories,
                })
              }
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          )}
        </div>

        {item.primaryCategories && (
          <div className="flex flex-wrap gap-2">
            {getCategoryArray(item.primaryCategories).map((category, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        <div className="text-sm">
          {item.prices?.availability && (
            <div
              className={`font-medium ${getAvailabilityColor(
                item.prices.availability
              )}`}
            >
              {getAvailabilityText(item.prices.availability)}
            </div>
          )}
        </div>

        {item.dateAdded && (
          <div className="text-xs text-gray-400">
            Added: {formatDate(item.dateAdded)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectronicCard;
