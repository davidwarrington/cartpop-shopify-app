const GallerySlider = ({ product }) => {
  if (!product.featured_image) {
    return null;
  }

  return (
    <div className="relative overflow-auto pt-2 bg-gray-50">
      <div className="relative w-full flex gap-6 snap-mandatory snap-x overflow-x-auto pb-2">
        <div className="snap-center shrink-0 first:pl-4 last:pr-8">
          <img
            className="shrink-0 w-72 h-72 rounded-lg bg-white border"
            src={product.featured_image}
          />
        </div>
        <div className="snap-center shrink-0 first:pl-8 last:pr-8">
          <img
            className="shrink-0 w-72 h-72 rounded-lg bg-white border"
            src={product.featured_image}
          />
        </div>
        <div className="snap-center shrink-0 first:pl-8 last:pr-8">
          <img
            className="shrink-0 w-72 h-72 rounded-lg bg-white border"
            src={product.featured_image}
          />
        </div>
        <div className="snap-center shrink-0 first:pl-8 last:pr-8">
          <img
            className="shrink-0 w-72 h-72 rounded-lg bg-white border"
            src={product.featured_image}
          />
        </div>
      </div>
    </div>
  );
};

export default GallerySlider;
