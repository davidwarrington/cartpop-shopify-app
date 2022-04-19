import {
  generatedCheckoutLink,
  getHeaders,
} from "../../../helpers/app-proxy.js";
import { getMarkup } from "./markup.js";

export const linkNotFound = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);

  const markup = getMarkup({
    shop,
    locale,
    isMobile,
    shopifyRequestId,
    showSpinner: false,
    buttonHomeType: "home", // TODO: turn into setting
    title: "not_found_title",
    message: "not_found_message",
  });

  return {
    markup,
  };
};

export const link = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);
  const link = req.link;

  // Generate checkout link
  const generatedLink = generatedCheckoutLink({
    link,
  });
  if (!generatedLink) {
    throw `Checkout link generation failed on ${link} on ${shop}`;
  }

  // Redirect to generated link
  const scripts = `
<script>
    window.location.replace("{{ shop.url }}${generatedLink}");
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
