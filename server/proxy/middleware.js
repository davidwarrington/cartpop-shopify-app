import crypto from "crypto";

//https://github.com/gil--/Store-Recon-Locator/blob/495da3ae3d92250e1e77430f1cf92579e03055e8/server/middleware/verify-proxy.js#L9

// const verifyAppProxyExtensionSignatureMiddleware = (ctx, next) => {
//     if (
//       verifyAppProxyExtensionSignature(
//         ctx.query,
//         process.env.SHOPIFY_API_SECRET
//       )
//     ) {
//       return next();
//     }
//     ctx.res.statusCode = 401;
// };

// Configuring an App Proxy Extension REST endpoint to handle review
// creation requests coming from the online store
// router.post(
//     "/proxy/links",
//     verifyAppProxyExtensionSignatureMiddleware,
//     koaBody(),
//     createReview
// );

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
