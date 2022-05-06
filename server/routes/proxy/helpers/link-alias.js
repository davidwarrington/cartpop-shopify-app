import { parseGid } from "@shopify/admin-graphql-api-utilities";
import { Shopify } from "@shopify/shopify-api";
import { Product } from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

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
  const link = req.link;
  const { clearCart, redirectLocation } = getShopLinkSettings(req.shopDoc);
  const generatedLink = generatedCheckoutLink({
    link,
  });
  const urlQueryString = generateQueryString(link);

  // Extrapolate product ids
  const productIds = link.products
    .map((product) => parseGid(product.variantInfo.product.id))
    .join(",");
  // Load the current session to get the `accessToken`.
  const session = await Shopify.Utils.loadOfflineSession(shop);
  // Create a new client for the specified shop.
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
  const productsRes = await client.get({
    path: "products",
    query: { ids: productIds },
  });

  const formattedLink = link
    ? {
        id: link._id,
        type: link.type,
        lineItems: link.products
          ? link.products.map((lineItem) => ({
              variantId: lineItem.variantInfo?.id
                ? parseGid(lineItem.variantInfo.id)
                : "",
              productId: lineItem.variantInfo?.product?.id
                ? parseGid(lineItem.variantInfo.product.id)
                : null,
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
        products: productsRes.body ? productsRes.body.products : [],
        clearCart,
        redirectLocation,
        queryString: urlQueryString || null,
        redirectionUrl: generatedLink, // TODO:
      }
    : {};

  const markup = getMarkup({
    link: formattedLink,
    shop,
    isMobile,
    shopifyRequestId,
  });

  return { markup };
};
