import { useCart } from "../hooks/useCart";
import { LineItem } from "./index";

const LineItems = ({ products }) => {
  const { lineItems } = useCart();

  if (!lineItems || !lineItems.length) {
    return null;
  }

  return lineItems.map((lineItem, lineItemIndex) => (
    <LineItem
      key={lineItemIndex}
      lineItem={lineItem}
      lineItemIndex={lineItemIndex}
      products={products}
    />
  ));
};

export default LineItems;
