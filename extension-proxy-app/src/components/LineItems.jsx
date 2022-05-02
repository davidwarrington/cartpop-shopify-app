import { useState } from "react";
import { LineItem } from "./index";

const LineItems = ({ lineItems, products }) => {
  const [cartLineItems, setCartLineItems] = useState(lineItems || []);

  const handleLineItemChange = ({ index, value }) => {
    if (index < 0) {
      return;
    }

    setCartLineItems((lineItems) => {
      const cachedLineItems = [...lineItems];

      if (!cachedLineItems[index]) {
        return cachedLineItems;
      }

      cachedLineItems[index] = value;
      return cachedLineItems;
    });
  };

  if (!cartLineItems || !cartLineItems.length) {
    return null;
  }

  return cartLineItems.map((lineItem, lineItemIndex) => (
    <LineItem
      key={lineItemIndex}
      lineItem={lineItem}
      lineItemIndex={lineItemIndex}
      products={products}
      handleLineItemChange={handleLineItemChange}
    />
  ));
};

export default LineItems;
