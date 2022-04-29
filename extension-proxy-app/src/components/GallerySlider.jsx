const GallerySlider = ({ product }) => {
  if (!product.featured_image) {
    return null;
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
              className="shrink-0 w-60 h-60 rounded-lg bg-white border"
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
