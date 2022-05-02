import { useShop } from "../hooks";

const ProductPrice = ({ shop, selectedVariant, quantity = 1 }) => {
  const { locale, currency } = useShop();

  if (!selectedVariant || !shop) {
    return null;
  }

  const productTotalPrice = (selectedVariant.price / 100) * parseInt(quantity);
  const productComparePrice =
    (selectedVariant.compare_at_price / 100) * parseInt(quantity);

  return (
    <div className="flex gap-2 items-center">
      <div className="text-gray-900 text-xl">
        {new Intl.NumberFormat(locale, {
          style: "currency",
          currency: currency,
          currencyDisplay: "narrowSymbol",
          maximumSignificantDigits: 4,
        }).format(productTotalPrice)}
      </div>
      {productComparePrice && productComparePrice !== productTotalPrice ? (
        <div className="line-through">
          {new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            currencyDisplay: "narrowSymbol",
            maximumSignificantDigits: 4,
          }).format(productComparePrice)}
        </div>
      ) : null}
    </div>
  );
};

export default ProductPrice;
