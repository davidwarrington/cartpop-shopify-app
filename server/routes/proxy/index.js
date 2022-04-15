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
      const { order, customer, products } = req.query;

      if (!order && !products && !customer && shop) {
        res.redirect(`https://${shop}`);
        return;
      }

      try {
        res.set("Content-Type", "application/liquid");
        res.status(200).send(`{% layout none %} 
        <html>
          <head>
            <link rel="stylesheet" href="//cdn.shopify.com/app/services/{{shop.id}}/assets/{{theme.id}}/checkout_stylesheet/v2-ltr-edge-2602686fb8b88d94b8051bb6bb771e56-160" media="all" />
          </head>
          <body>
            <div class="full-page-overlay">
              <div class="full-page-overlay__wrap">
                <!-- <meta http-equiv="refresh" content="3;URL=?from_processing_page=1"> -->
                <div data-processing-order="" class="full-page-overlay__content" role="region" aria-describedby="full-page-overlay__processing-text" aria-label="Processing order" tabindex="-1">
                  <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" aria-hidden="true" focusable="false">
                    <use xlink:href="#spinner-large"></use>
                  </svg>
                  <div id="full-page-overlay__processing-text">
                    <svg class="icon-svg icon-svg--color-accent icon-svg--size-64 icon-svg--spinner full-page-overlay__icon" xmlns="http://www.w3.org/2000/svg" viewBox="-270 364 66 66"><path d="M-237 428c-17.1 0-31-13.9-31-31s13.9-31 31-31v-2c-18.2 0-33 14.8-33 33s14.8 33 33 33 33-14.8 33-33h-2c0 17.1-13.9 31-31 31z"></path></svg>
                    <h3 class="full-page-overlay__title">
                      Loading checkout
                    </h3>
                    <p class="full-page-overlay__text">Please wait while we load your checkout.</p>
                    <!-- <p class="full-page-overlay__text"> If you’re not automatically redirected, <a href="?from_processing_page=1">refresh this page</a>. </p> -->
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>`);
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
        res.status(200).send(`There was an error.`);
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
      
      // Detect QR Scan vs Link click
      const scan = req.query.scan;
      const eventType = scan ? "scans" : "clicks";

      try {
        const link = await db.collection("links").findOne({
          alias: linkAlias, // Fetch link by Mongo document id
          shop, // Make sure link is from the same store proxy request originates
          active: true, // Make sure link is enabled
        });

        if (!link) {
          throw `Link ${linkAlias} on ${shop} not found or is not enabled`;
        }

        // Update total link click analytics
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
