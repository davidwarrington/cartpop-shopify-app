import {
  generatedCheckoutLink,
  getHeaders,
} from "../../../helpers/app-proxy.js";
import { getMarkup } from "./markup.js";

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
