import { parseGid } from "@shopify/admin-graphql-api-utilities";
import crypto from "crypto";

/*
    Helper function to build Shopify checkout links
    Learn more: https://help.shopify.com/en/manual/products/details/checkout-link
*/
export const generatedCheckoutLink = ({ shop, link }) => {
  if (!shop || !link) return null;

  const { products, customer, order } = link;

  // Products are required for chekout link
  if (!products || !products.length) {
    return null;
  }

  // Build Products
  const productString = products
    .map((product) =>
      product.variants
        .map((variant) => `${parseGid(variant.id)}:${variant.quantity || 1}`)
        .join(",")
    )
    .join(",");

  // Build remainder of parameters
  let urlParameters = "";

  if (customer && Object.keys(customer).length) {
    if (customer.email) {
      urlParameters += `&checkout[email]=${customer.email}`;
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
  }

  if (order && Object.keys(order).length) {
    if (order.discountCode) {
      urlParameters += `&discount=${order.discountCode}`;
    }

    if (order.note) {
      urlParameters += `&note=${encodeURIComponent(order.note)}`;
    }

    if (order.ref) {
      urlParameters += `&ref=${encodeURIComponent(order.ref)}`;
    }

    if (order.useShopPay) {
      urlParameters += `&payment=shop_pay`;
    }

    if (order.attributes && order.attributes.length) {
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

  // Create full url
  let checkoutUrl = `https://${shop.replace(
    "https://",
    ""
  )}/cart/${productString}?${urlParameters}`;

  return checkoutUrl;
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
