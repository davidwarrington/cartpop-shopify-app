import { generatedCheckoutLink } from "../../helpers/app-proxy.js";
import verifyAppProxyExtensionSignatureMiddleware from "../../middleware/verify-app-proxy.js";

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
      const { db } = req;
      const shop = req.headers && req.headers["x-shop-domain"];
      const shopifyRequestId = req.headers && req.headers["x-request-id"];

      try {
        res.status(200).send("Link proxy");
      } catch (error) {
        // TODO: better error handling
        console.warn(JSON.stringify(error));

        // Rredirect to shop homepage
        if (shop) {
          res.redirect(`https://${shop}`);
          return;
        }

        // Fallback if somehow shop header is missing
        res.set("Content-Type", "application/liquid");
        res.status(200).send("There was an error.");
      }
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
      const linkAlias = req.params.alias;

      try {
        const link = await db.collection("links").findOne({
          alias: linkAlias, // Fetch link by Mongo document id
          shop, // Make sure link is from the same store proxy request originates
          active: true, // Make sure link is enabled
        });

        if (!link) {
          throw `Link ${linkAlias} on ${shop} not found or is not enabled`;
        }

        // TODO: increase click count on link doc
        // Update total promotion analytics
        await db.collection("links").updateOne(
          {
            _id: link._id,
          },
          {
            $inc: {
              [`analytics.clicks`]: 1,
              // TODO: track mobile vs desktop
            },
          },
          true
        );

        // Generate checkout link
        const generatedLink = generatedCheckoutLink({
          shop, // TODO: TEMP use primary domain. we need to save this to the shop doc
          link,
        });

        console.log("generatedLink", generatedLink);

        if (!generatedLink) {
          throw `Checkout link generation failed on ${link} on ${shop}`;
        }

        // TODO: TEMP
        res.redirect(generatedLink);

        // TODO: RETURN HTML LOADER
        //res.status(200).send("Link proxy");

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
        res.set("Content-Type", "application/liquid");
        res.status(200).send("There was an error.");
      }
    }
  );
}
