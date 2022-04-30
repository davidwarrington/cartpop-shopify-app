import { parseGid } from "@shopify/admin-graphql-api-utilities";
import crypto from "crypto";

/*
    Helper function to build Shopify checkout links
    Learn more: https://help.shopify.com/en/manual/products/details/checkout-link
*/
export const generatedCheckoutLink = ({
  shop,
  link,
  discount,
  payment,
  email,
}) => {
  if (!link) return null;

  const { products } = link;

  // Products are required for chekout link
  if (!products || !products.length) {
    return null;
  }

  // Build Products String
  const productString = products
    .map(
      (lineItem) =>
        `${parseGid(lineItem.variantInfo && lineItem.variantInfo.id)}:${
          lineItem.link_quantity || 1
        }`
    )
    .join(",");

  // Build remainder of parameters
  const urlParameters = generateQueryString({
    link,
    discount,
    payment,
    email,
  });

  // Create full url
  let checkoutUrl = shop ? `https://${shop.replace("https://", "")}` : "";
  checkoutUrl += `/cart/${productString}?${urlParameters}`;
  return checkoutUrl;
};

/*
  Generate the url query string, specifically
*/
export const generateQueryString = ({ link, email, discount, payment }) => {
  const { customer, order } = link;
  let urlParameters = "";

  if (customer && Object.keys(customer).length) {
    if (email || customer.email) {
      urlParameters += `&checkout[email]=${email || customer.email}`;
    }

    if (customer.first_name) {
      urlParameters += `&checkout[shipping_address][first_name]=${customer.first_name}`;
    }

    if (customer.last_name) {
      urlParameters += `&checkout[shipping_address][last_name]=${customer.last_name}`;
    }

    if (customer.address1) {
      urlParameters += `&checkout[shipping_address][address1]=${customer.address1}`;
    }

    if (customer.address2) {
      urlParameters += `&checkout[shipping_address][address2]=${customer.address2}`;
    }

    if (customer.city) {
      urlParameters += `&checkout[shipping_address][city]=${customer.city}`;
    }

    if (customer.province) {
      urlParameters += `&checkout[shipping_address][province]=${customer.province}`;
    }

    if (customer.zipcode) {
      urlParameters += `&checkout[shipping_address][zip]=${customer.zipcode}`;
    }

    if (customer.country) {
      urlParameters += `&checkout[shipping_address][country]=${customer.country}`;
    }
  }

  if (discount || (order && Object.keys(order).length)) {
    if (discount || order?.discountCode) {
      urlParameters += `&discount=${discount || order.discountCode}`;
    }

    if (order?.note) {
      urlParameters += `&note=${encodeURIComponent(order.note)}`;
    }

    if (order?.ref) {
      urlParameters += `&ref=${encodeURIComponent(order.ref)}`;
    }

    if (payment || order?.useShopPay) {
      urlParameters += `&payment=${payment || "shop_pay"}`;
    }

    if (order?.attributes && order?.attributes.length) {
      urlParameters += `&${order.attributes
        .map(
          (attribute) =>
            attribute.label &&
            `attributes[${attribute.label}]=${attribute.value}`
        )
        .join("&")}`;
    }
  }

  // Add optional access token to attribute sales channel
  if (link.accessToken) {
    urlParameters += `&access_token=${accessToken}`;
  }

  return urlParameters;
};

export const verifyAppProxyExtensionSignature = (
  query = {},
  shopifyApiSecret
) => {
  const { signature = "", ...otherQueryParams } = query;

  const input = Object.keys(otherQueryParams)
    .sort()
    .map((key) => {
      const value = otherQueryParams[key];
      return `${key}=${value}`;
    })
    .join("");

  const hmac = crypto
    .createHmac("sha256", shopifyApiSecret)
    .update(input)
    .digest("hex");

  const digest = Buffer.from(hmac, "utf-8");
  const checksum = Buffer.from(signature, "utf-8");

  return (
    digest.length === checksum.length &&
    crypto.timingSafeEqual(digest, checksum)
  );
};

export const getHeaders = (req) => {
  const locale =
    req.headers &&
    req.headers["accept-language"] &&
    req.headers["accept-language"].split(",")[0];
  const shopifyRequestId = req.headers && req.headers["x-request-id"];
  const isMobile = req.headers && req.headers["x-is-mobile"];
  const shop = req.query && req.query.shop;

  return {
    isMobile,
    shopifyRequestId,
    locale,
    shop,
  };
};

export const getShopLinkSettings = (shopDoc) => {
  return {
    clearCart: shopDoc?.settings?.linksClearCart === false ? false : true,
    redirectLocation: shopDoc?.settings?.linksRedirectLocation || "checkout",
  };
};
