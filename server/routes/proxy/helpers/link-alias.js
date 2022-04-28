import { parseGid } from "@shopify/admin-graphql-api-utilities";
import {
  generatedCheckoutLink,
  generateQueryString,
  getHeaders,
  getShopLinkSettings,
} from "../../../helpers/app-proxy.js";
import {
  contentLoader,
  contentNotFound,
  getMarkup,
  getScriptMarkup,
  translatedLiquid,
} from "./markup.js";

export const linkNotFound = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);

  const bodyContent = contentNotFound(locale);

  const markup = getMarkup({
    shop,
    isMobile,
    shopifyRequestId,
    bodyContent,
  });

  return {
    markup,
  };
};

export const link = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);
  const { email, discount, payment } = req.query;
  const link = req.link;
  const { clearCart, redirectLocation } = getShopLinkSettings(req.shopDoc);
  let scripts = ``;

  // TODO: fix this...
  const hasLineProperties = true;
  const hasSubscription = false;

  // We need to use cart api if a link has one of these
  if (hasLineProperties || hasSubscription) {
    const urlQueryString = generateQueryString({
      link,
      email,
      discount,
      payment,
    });

    scripts = getScriptMarkup({
      clearCart,
      redirectLocation,
      urlQueryString,
    });
  } else {
    // Generate checkout link
    const generatedLink = generatedCheckoutLink({
      shop,
      link,
      email,
      discount,
      payment,
    });
    if (!generatedLink) {
      throw `Checkout link generation failed on ${link} on ${shop}`;
    }

    // Redirect to generated link
    scripts = `
      <script>
        window.location.replace("{{ shop.url }}${generatedLink}");
      </script>`;
  }

  const bodyContent = contentLoader(locale);

  const formattedLink = link
    ? {
        id: link._id,
        type: link.type,
        lineItems: link.products
          ? link.products.map((lineItem) => ({
              variantId: lineItem.variantInfo?.id
                ? parseGid(lineItem.variantInfo.id)
                : "",
              productId: lineItem.variantInfo?.product?.id || null,
              quantity: lineItem.link_quantity
                ? parseInt(lineItem.link_quantity)
                : 1,
              selling_plan_id: lineItem.link_selling_plan_id
                ? parseGid(lineItem.link_selling_plan_id)
                : null,
              poperties: lineItem.link_line_properties || null,
            }))
          : null,
        customer: link.customer,
        order: link.order,
      }
    : {};

  const markup = getMarkup({
    link: formattedLink,
    shop,
    isMobile,
    shopifyRequestId,
    scripts,
    bodyContent,
  });

  return { markup };
};
