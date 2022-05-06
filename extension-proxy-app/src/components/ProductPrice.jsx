import { useShop } from "../hooks";

const ProductPrice = ({ selectedVariant, quantity = 1 }) => {
  const { locale, currency } = useShop();

  if (!selectedVariant) {
    return null;
  }

  const productTotalPrice = selectedVariant.price * parseInt(quantity);
  const productComparePrice =
    selectedVariant.compare_at_price * parseInt(quantity);

  return (
    <div className="flex gap-1 items-center">
      {productComparePrice && productComparePrice !== productTotalPrice ? (
        <div className="line-through text-xl text-gray-500">
          {new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            currencyDisplay: "narrowSymbol",
            maximumSignificantDigits: 4,
          }).format(productComparePrice)}
        </div>
      ) : null}
      <div className="text-gray-900 text-xl">
        {new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currency,
          currencyDisplay: "narrowSymbol",
          maximumSignificantDigits: 4,
        }).format(productTotalPrice)}
      </div>
    </div>
  );
};

export default ProductPrice;
