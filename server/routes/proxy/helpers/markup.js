import { translationMetafield } from "../../../constants.js";
import { defaultTranslations } from "../../../default-translations.js";

export const getMarkup = ({
  link,
  isMobile = false,
  shopifyRequestId,
  bodyContent,
  scripts = null,
}) => {
  const randomId = "2602686fb8b88d94b8051bb6bb771e56";

  const cleanLink = link
    ? {
        type: link.type,
        lineItems: link.products
          ? link.products.map((lineItem) => ({
              variantId: lineItem.variantInfo?.id,
              productId: lineItem.variantInfo?.product?.id || null,
              quantity: lineItem.link_quantity
                ? parseInt(lineItem.link_quantity)
                : 1,
              selling_pan_id: lineItem.link_selling_plan_id
                ? parseInt(lineItem.link_selling_plan_id)
                : null,
              poperties: lineItem.link_line_properties || null,
            }))
          : null,
        customer: link.customer,
        order: link.order,
      }
    : {};

  return `{% layout none %} 
    <html lang="{{ request.locale.iso_code }}">
      <head>
        <meta charset="utf-8">
        <meta name="robots" content="noindex"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  
        <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0">
        <link rel="stylesheet" href="//cdn.shopify.com/app/services/{{shop.id}}/assets/{{theme.id}}/checkout_stylesheet/v2-ltr-edge-${randomId}-160" media="all" />
        <meta name="shopify-x-request-id" content="${shopifyRequestId}">
        <!-- <meta http-equiv="refresh" content="3;URL=?from_processing_page=1"> -->
      </head>
      <body>
        <script>
          const link = ${JSON.stringify(cleanLink)};
          const isMobile = ${isMobile === 1};
          const languageCode = "{{ request.locale.iso_code }}";
          const defaultTranslations = ${JSON.stringify(defaultTranslations)};
          const translations = {{ shop.metafields.${
            translationMetafield.namespace
          }.${translationMetafield.key}.value | json }};
        </script>
        ${scripts ? scripts : ""}
        ${bugsnagScript()}
        ${bodyContent}
      </body>
    </html>
    `;
};

export const translatedLiquid = (locale, property) => {
  if (!property) {
    return;
  }
  const { namespace, key } = translationMetafield;
  return `{{ shop.metafields.${namespace}.${key}.value[request.locale.iso_code].${property} | default: "${defaultTranslations[locale][property]}" }}`;
};

const bugsnagScript = () => {
  if (process.env.BUGSNAG_PROXY_KEY) {
    return;
  }

  return `<script src="//d2wy8f7a9ursnm.cloudfront.net/v7/bugsnag.min.js"></script>
    <script>
      Bugsnag.start({
        apiKey: '${process.env.BUGSNAG_PROXY_KEY}',
        user: {
          id: '{{ shop.permanent_domain }}',
          name: '{{ shop.name }}',
        },
        //appVersion: '4.10.0' // TODO:
      });
    </script>`;
};

export const getScriptMarkup = ({
  clearCart = false,
  redirectionType = "checkout",
  urlQueryString = "",
}) => {
  return `<script>
    const redirectionType = "${redirectionType}";
    const handleCart = async function () {
      if (!link) return;

      let cartRes = null;

        // Optionally clear cart before adding link items: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-clear-js
        const clearCart = ${clearCart};
        if (clearCart) {
            // Locale aware url: https://shopify.dev/themes/internationalization/multiple-currencies-languages#locale-aware-urls + https://shopify.dev/api/liquid/objects/routes#routes-cart_clear_url
            const clearCart = await fetch('{{ routes.cart_clear_url }}.js');
            const clearRes = await clearCart.json();
        }

        const cartItems = [];
        const { lineItems} = link;
       
        if (lineItems && lineItems.length) {
          lineItems.map(lineItem => {
            // Map line item properties
            let lineProperties = {};
            lineItem.poperties 
              && lineItem.poperties.length
              && lineItem.poperties.map(property => {
                lineProperties[property.label] = property.value
              });

            // Push line item to array
            cartItems.push({
              id: parseInt(lineItem.variantId.split("/")[4]),
              quantity: lineItem.quantity || 1,
              selling_plan: lineItem.selling_pan_id || null,
              properties: lineProperties || {},
            })
          })
        }

        // TODO: add conversion tracking attributes
        
        // Add new products to cart: https://shopify.dev/api/ajax/reference/cart#post-locale-cart-add-js
        const cartItemsRes = await fetch('{{ routes.cart_add_url }}.js',
            {
                headers: {
                  'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                  items: cartItems
                })
            }
        );
        cartRes = await cartItemsRes.json();

        // Add cart attributes, note, etc.
        // if (Object.keys(cartPayload).length) {
        //   const updateCartRes = await fetch('{{ routes.cart_update_url }}.js',
        //     {
        //         headers: {
        //           'Content-Type': 'application/json',
        //         },
        //         method: 'POST',
        //         body: JSON.stringify({
        //           ...cartPayload,
        //         })
        //     }
        //   );

        //   cartRes = await updateCartRes.json();
        // }

        if (!cartRes || !cartRes.items || !cartRes.items.length) {
          console.warn("No items!");
          return; // TODO: show error message and notify Bugsnag
        }

        let redirectionUrl = '';
        // Navigate to checkout or cart depending on setting
        if (redirectionType === "checkout") {
            // Checkout
            redirectionUrl = '/checkout?';
        } else if ("cart") {
            // Cart
            redirectionUrl = "{{ shop.secure_url }}{{ routes.cart_url }}?";
        } else {
            // Home
            redirectionUrl = "{{ shop.secure_url }}?";
        }

        redirectionUrl += "${urlQueryString}";

        window.location.replace(redirectionUrl);
        return true;
    };
    
    handleCart();  
</script>`;
};