import { createContext, useContext, useEffect, useState } from "react";
import { useShop } from "./useShop";

const CartContext = createContext({});

const CartProvider = ({ link, setStatus, children }) => {
  const { routes } = useShop();

  const [lineItems, setLineItems] = useState(link.lineItems || []);

  useEffect(() => {
    if (!lineItems || !lineItems.length) {
      return;
    }

    // Add initial line item properties
    const initialAdd = async () => {
      try {
        setStatus("loading");

        await add({
          routes,
          cartItems: lineItems.map((lineItem) => ({
            id: lineItem.variantId,
            quantity: lineItem.quantity,
            properties: lineItems.properties,
            selling_plan: lineItem.selling_plan_id,
          })),
        });
        setStatus("idle");
      } catch (e) {
        setStatus("error");
      }
    };
    // TODO: initialAdd();
  }, []);

  const handleCheckout = async () => {
    // Clear cart on load
    if (link.clearCart) {
      await clear();
    }

    const newCartRes = await add(
      lineItems.map((lineItem) => ({
        id: lineItem.variantId,
        quantity: lineItem.quantity,
        properties: lineItems.properties,
        selling_plan: lineItem.selling_plan_id,
      }))
    );
    console.log("newCartRes", newCartRes);
    // TODO:setCartRes(newCartRes);
  };

  //   // Update linte item
  const handleLineItemChange = ({ index, value }) => {
    if (index < 0) {
      return;
    }

    setLineItems((lineItems) => {
      const cachedLineItems = [...lineItems];

      // Make sure line item at index exists
      if (!cachedLineItems[index]) {
        return cachedLineItems;
      }

      cachedLineItems[index] = value;
      return cachedLineItems;
    });
  };

  // Add new lineItems to cart
  const add = async (cartItems) => {
    // Add new products to cart: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-add-js
    const cartItemsRes = await fetch(`${routes.cartAdd}.js`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        items: cartItems,
      }),
    });
    const cartRes = await cartItemsRes.json();
    return cartRes;
  };

  // Update quantity, properties
  const update = async (body) => {
    const clearCart = await fetch(`${routes.cartUpdate}.js`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    const clearRes = await clearCart.json();
    return clearRes;
  };

  // Clear cart
  const clear = async () => {
    const clearCartItems = await fetch(`${routes.cartClear}.js`);
    const clearRes = await clearCartItems.json();

    const cartNote = clearRes.note ? true : false;
    const cartAttributes =
      clearRes.attributes && Object.keys(clearRes.attributes).length
        ? true
        : false;

    // If cart already has a note or attributes, clear them
    if (cartNote || cartAttributes) {
      await update({
        routes,
        payload: {
          note: null,
          attributes: null,
        },
      });
    }
    return;
  };

  return (
    <CartContext.Provider
      value={{
        lineItems,
        link,
        clear,
        add,
        update,
        handleLineItemChange,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const {
    add,
    clear,
    update,
    lineItems,
    link,
    handleLineItemChange,
    handleCheckout,
  } = useContext(CartContext);

  return {
    add,
    clear,
    update,
    lineItems,
    link,
    handleLineItemChange,
    handleCheckout,
  };
};

export { CartProvider, useCart };
