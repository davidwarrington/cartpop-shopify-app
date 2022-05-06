const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const findVariant = (product, variantId) =>
  product.variants.find((variant) => variant.id == variantId);

export { classNames, findVariant };
