const ElectronicCard = ({ item }) => {
  console.log("Item data:", item); //console logging
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

  // Convert primaryCategories string to array
  const getCategoryArray = (categories) => {
    if (!categories) return [];
    // Check if it's a comma-separated string
    if (typeof categories === "string") {
      return categories.split(",").map((cat) => cat.trim());
    }
    return [];
  };

  return (
    <div className="w-full max-w-[450px] border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="aspect-square w-full max-w-[450px] relative">
        <img
          src={
            item.imageURLs || "https://via.placeholder.com/450?text=No+Image"
          }
          alt={item.name}
          className="w-full h-full object-contain p-4"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/450?text=No+Image";
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

        <div className="space-y-2">
          <div className="font-semibold">
            {item.prices?.amountMin && (
              <div>
                Price: {formatPrice(item.prices.amountMin)}
                {item.prices.amountMax &&
                  item.prices.amountMax !== item.prices.amountMin &&
                  ` - ${formatPrice(item.prices.amountMax)}`}
              </div>
            )}
          </div>

          {item.prices?.merchant && (
            <div className="text-sm text-gray-600">
              Seller: {item.prices.merchant}
            </div>
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
              className={`font-medium ${
                item.prices.availability.toLowerCase().includes("in stock") ||
                item.prices.availability.toLowerCase().includes("yes")
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {item.prices.availability.toLowerCase().includes("yes")
                ? item.prices.availability.replace(/yes/i, "In stock")
                : item.prices.availability}
            </div>
          )}
        </div>

        {/* Optional: Add date information */}
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
