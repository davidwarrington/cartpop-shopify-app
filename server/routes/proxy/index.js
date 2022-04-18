import { generatedCheckoutLink, getHeaders } from "../../helpers/app-proxy.js";
import verifyAppProxyExtensionSignatureMiddleware from "../../middleware/verify-app-proxy.js";
import Proxy from "./helpers/index.js";

const apiRoutePrefix = `/proxy/links`;

export default function appProxyRoutes(app) {
  /*
        App proxy Routes
        > Note: we must verify the headers to ensure they are not being called outside the context of a specific store
        > Learn more: https://shopify.dev/apps/online-store/app-proxies#handling-proxy-requests
    */

  /*
        Dynamic link
        
        The root is reserved for dynamic links such as reorder scenarios
    */
  app.get(
    `${apiRoutePrefix}`,
    verifyAppProxyExtensionSignatureMiddleware(),
    async (req, res) => {
      const { order, customer, products } = req.query;
      const { shop } = getHeaders(req);

      if (!order && !products && !customer && shop) {
        res.redirect(`https://${shop}`);
        return;
      }

      res.set("Content-Type", "application/liquid");

      try {
        const { markup } = await Proxy.dynamic(req, res);
        res.status(200).send(markup);
      } catch (error) {
        // TODO: better error handling
        console.warn(error);

        // Rredirect to shop homepage
        if (shop) {
          res.redirect(`https://${shop}`);
          return;
        }

        // Fallback if somehow shop header is missing
        res.status(200).send(`There was an error.`);
      }
    }
  );

  /* 
        Generate dynamic link

        We call this in the dynamic link creator to getch the checkout link.
        We'll also log additional browser analytics like mobile vs desktop
    */
  app.get(
    `${apiRoutePrefix}/dynamic`,
    verifyAppProxyExtensionSignatureMiddleware(),
    async (req, res) => {
      //TODO:
      res.status(200).send({ url: null });
    }
  );

  /* 
        Specific link

        When a link alias is used we route logic here
    */
  app.get(
    `${apiRoutePrefix}/:alias`,
    verifyAppProxyExtensionSignatureMiddleware(),
    async (req, res) => {
      const { db } = req;
      const shop = req.headers && req.headers["x-shop-domain"];
      const shopifyRequestId = req.headers && req.headers["x-request-id"];
      const acceptLanguage = req.headers && req.headers["accept-language"];
      const isMobile = req.headers && req.headers["x-is-mobile"];
      const linkAlias = req.params.alias;

      // Detect QR Scan vs Link click
      const scan = req.query.scan;
      const eventType = scan ? "scans" : "clicks";

      res.set("Content-Type", "application/liquid");

      try {
        const link = await db.collection("links").findOne({
          alias: linkAlias, // Fetch link by Mongo document id
          shop, // Make sure link is from the same store proxy request originates
          active: true, // Make sure link is enabled
        });

        if (!link) {
          throw `Link ${linkAlias} on ${shop} not found or is not enabled`;
        }

        // Add link to req
        req.link = link;

        // Update total link click analytics
        await db.collection("links").updateOne(
          {
            _id: link._id,
          },
          {
            $inc: {
              [`analytics.${eventType}.${
                parseInt(isMobile) ? "mobile" : "desktop"
              }`]: 1,
            },
          },
          true
        );

        // Insert new event doc
        // await db.collection("events").insertOne(
        //   {
        //     _id: link._id,

        //   },
        //   {
        //     $inc: {
        //       [`analytics.clicks`]: 1,
        //       // TODO: track mobile vs desktop
        //     },
        //   },
        //   true
        // );

        const { markup } = await Proxy.link(req, res);
        res.status(200).send(markup);

        return;
      } catch (error) {
        // TODO: better error handling
        console.warn("error", error);

        // Rredirect to shop homepage
        if (shop) {
          res.redirect(`https://${shop}`);
          return;
        }

        // Fallback if somehow shop header is missing
        res.status(200).send("There was an error.");
      }
    }
  );
}
