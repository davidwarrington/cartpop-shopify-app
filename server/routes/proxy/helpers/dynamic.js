import {
  generateQueryString,
  getHeaders,
  getShopLinkSettings,
} from "../../../helpers/app-proxy.js";
import { contentLoader, getMarkup } from "./markup.js";

export const dynamic = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);
  const { products, product, customer, email, discount, payment } = req.query;
  const { clearCart, redirectLocation } = getShopLinkSettings(req.shopDoc);

  if (customer) {
    // TODO: look up customer given id. Check access scopes.
  }

  let lineItems = [];
  if (products) {
    lineItems = products.split(",").map((product) => {
      const productParts = product.split(":");

      return {
        variantId: parseInt(productParts[0]),
        quantity: productParts.length >= 2 ? parseInt(productParts[1]) : 1,
        selling_plan_id:
          productParts.length >= 3 ? parseInt(productParts[2]) : null,
      };
    });
  } else if (product) {
    // TODO: get product

    lineItems = [
      {
        variantId: null, // TODO:
        quantity: 1,
        selling_plan_id: null,
      },
    ];
  }

  const formattedLink = {
    id: null,
    type: "dynamic",
    lineItems: lineItems,
    customer: email
      ? {
          email,
        }
      : null,
    order:
      discount || payment
        ? {
            discountCode: discount || null,
            useShopPay: payment ? true : false,
          }
        : null,
  };

  const urlQueryString = generateQueryString(formattedLink);

  // const scripts = getScriptMarkup({
  //   clearCart,
  //   redirectLocation,
  //   urlQueryString,
  // });

  const markup = getMarkup({
    link: formattedLink,
    shop,
    locale,
    isMobile,
    shopifyRequestId,
    bodyContent: contentLoader(locale),
  });

  return { markup };
};
