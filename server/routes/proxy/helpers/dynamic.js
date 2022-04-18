import { getHeaders } from "../../../helpers/app-proxy.js";
import { getMarkup } from "./markup.js";

export const dynamic = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);

  const clearCart = true; // TODO:
  const redirectionType = "cart"; // TODO: cart,checkout,home

  // TODO: TEMP Logic to add to cart
  const scripts = `
<script>
    const redirectionType = "${redirectionType}";
    const handleCart = async function () {
        // Optionally clear cart before adding link items: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-clear-js
        const clearCart = ${clearCart};
        if (clearCart) {
            // Locale aware url: https://shopify.dev/themes/internationalization/multiple-currencies-languages#locale-aware-urls + https://shopify.dev/api/liquid/objects/routes#routes-cart_clear_url
            const clearCart = await fetch('{{ routes.cart_clear_url }}.js');
            const clearRes = await clearCart.json();
        }
        
        // Add new products to cart: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-add-js
        const updateCart = await fetch('{{ routes.cart_update_url }}.js',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    attributes: {
                        bob: 'bob',
                    },
                })
            }
        );
        const updateRes = await updateCart.json();
        console.log("updateRes", updateRes);

        // Navigate to checkout or cart depending on setting
        if (redirectionType === "checkout") {
            // Checkout
            window.location.replace("{{ shop.secure_url }}/checkout");
        } else if ("cart") {
            // Cart
            window.location.replace("{{ shop.secure_url }}{{ routes.cart_url }}");
        } else {
            // Home
            window.location.replace("{{ shop.secure_url }}");
        }
        return true;
    };
    
    handleCart();  
</script>`;

  const markup = getMarkup({
    shop,
    locale,
    isMobile,
    shopifyRequestId,
    scripts,
  });

  return { markup };
};
