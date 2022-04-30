const GallerySlider = ({ product }) => {
  if (!product.featured_image) {
    return null;
  }

  if (!product.images || !product.images.length) {
    return null;
  }

  if (product.images.length === 1) {
    return (
      <div className="relative bg-gray-50 flex justify-center">
        <div className="p-5">
          <img
            className="w-64 h-64 rounded-lg bg-white border object-contain"
            src={product.images[0]}
            alt=""
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-auto pt-2 bg-gray-50">
      <div className="relative w-full flex gap-6 snap-mandatory snap-x overflow-x-auto pb-2 pl-4">
        {product.images.map((image, imageIndex) => (
          <div
            className={`snap-center shrink-0 first:pl-${
              imageIndex === 0 ? "4" : "8"
            } last:pr-8`}
          >
            <img
              className="shrink-0 w-60 h-60 rounded-lg bg-white border object-contain"
              src={image}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySlider;
