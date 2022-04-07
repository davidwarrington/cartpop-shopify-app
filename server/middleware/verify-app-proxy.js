import { verifyAppProxyExtensionSignature } from "../helpers/app-proxy.js";

// Learn more: https://shopify.dev/apps/online-store/app-proxies#handling-proxy-requests
export default function verifyAppProxyExtensionSignatureMiddleware(app) {
  return async (req, res, next) => {
    if (
      verifyAppProxyExtensionSignature(
        req.query,
        process.env.SHOPIFY_API_SECRET
      )
    ) {
      return next();
    }

    return res.status(401).send(`Invalid proxy`);
  };
}

//https://github.com/gil--/Store-Recon-Locator/blob/495da3ae3d92250e1e77430f1cf92579e03055e8/server/middleware/verify-proxy.js#L9
