const ProductImage = ({ product }) => {
  if (!product.images || !product.images.length) {
    return <div className="w-50 bg-slate-500" />;
  }

  return (
    <>
      <img
        className="h-full aspect-square object-cover w-1/3 rounded-2xl box-border"
        src={product.images[0].src}
        alt=""
      />
    </>
  );
};

export default ProductImage;
