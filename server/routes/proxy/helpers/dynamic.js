import { getHeaders } from "../../../helpers/app-proxy.js";
import { getMarkup, getScriptMarkup } from "./markup.js";

export const dynamic = async (req, res) => {
  const { shop, locale, isMobile, shopifyRequestId } = getHeaders(req);

  const scripts = getScriptMarkup({
    clearCart: true, // TODO:
    redirectionType: "cart", // TODO: cart,checkout,home
  });

  const markup = getMarkup({
    link: req.link,
    shop,
    locale,
    isMobile,
    shopifyRequestId,
    scripts,
  });

  return { markup };
};
