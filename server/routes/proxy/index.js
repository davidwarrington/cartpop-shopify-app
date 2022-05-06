import vision from "@google-cloud/vision";

import { getHeaders } from "../../helpers/app-proxy.js";
import verifyAppProxyExtensionSignatureMiddleware from "../../middleware/verify-app-proxy.js";
import Proxy from "./helpers/index.js";

const apiRoutePrefix = `/proxy/links`;

export default function appProxyRoutes(app) {
  /* 
        Specific link

        When a link alias is used we route logic here
    */

  app.post(
    `${apiRoutePrefix}/scan`,
    verifyAppProxyExtensionSignatureMiddleware(),
    async (req, res) => {
      const { db } = req;

      if (!req.body) {
        console.warn("No query");
        res.set("Content-Type", "application/liquid");
        res.status(200).send(`There was an error.`);
        return;
      }

      const imageBase64 = req.body.image;

      // Creates a client
      const client = new vision.ImageAnnotatorClient();

      // Buffer image
      const image = Buffer.from(imageBase64, "base64");

      // Performs label detection on the image file
      const [result] = await client.textDetection(image);
      const labels = result.textAnnotations;

      if (labels) {
        console.log("Labels:", labels[0].description);
      }

      // labels.forEach(label => {
      //     console.log(label);
      //     console.log("Description: ", label.description.split("\n"));
      // });

      res.status(200).send({
        description: labels[0].description,
      });
      return;

      // TODO:
    }
  );

  /*
        App proxy Routes
        > Note: we must verify the headers to ensure they are not being called outside the context of a specific store
        > Learn more: https://shopify.dev/apps/online-store/app-proxies#handling-proxy-requests
    */

  /*
        Dynamic link
        
        The root is reserved for dynamic links for marketing and automation flows.
        It accepts the following url parameters:
        - products=variantId:quantity:sellingPlanId:variantId:quantity:sellingPlanId
        - email=example@email.com
        - discount=FREESHIP
        - payment=shop_pay

        Note: For reorder links, use the /order:id subroute.
    */
  app.get(
    `${apiRoutePrefix}`,
    verifyAppProxyExtensionSignatureMiddleware(),
    async (req, res) => {
      const { order, customer, products } = req.query;
      const { shop } = getHeaders(req);

      if (!order && !products && !customer && shop) {
        const randomId = "2602686fb8b88d94b8051bb6bb771e9";

        res.set("Content-Type", "application/liquid");
        res.status(200).send(`
              {% layout none %}
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="robots" content="noindex"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">  
                <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, user-scalable=0">
                <link rel="stylesheet" href="${
                  process.env.HOST
                }/src/assets/scanner/index.css?v=${
          process.env.SOURCE_VERSION || randomId
        }" media="all" />
              </head>
                <body>
                  <div id="app"></div>
                  <script type="module" src="${
                    process.env.HOST
                  }/src/assets/scanner/index.js?v=${
          process.env.SOURCE_VERSION || randomId
        }"></script>
                </body>
              </html>
            `);

        //res.redirect(`https://${shop}`);
        return;
      }

      try {
        const { markup } = await Proxy.dynamic(req, res);
        res.set("Content-Type", "application/liquid");
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
        res.set("Content-Type", "application/liquid");
        res.status(200).send(`There was an error.`);
      }
    }
  );

  /* 
        Generate repeat order based on an order's id

        Merchant can call this link to generate reorder links for replenishment flows
    */
  app.get(
    `${apiRoutePrefix}/order/:id`,
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
      const { shop, isMobile } = getHeaders(req);

      // Parse link alias
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
          console.warn(
            `Could not find an active link of ${linkAlias} on ${shop}`
          );
          const { markup } = await Proxy.linkNotFound(req, res);
          res.set("Content-Type", "application/liquid");
          res.status(200).send(markup);
          return;
          //throw `Link ${linkAlias} on ${shop} not found or is not enabled`;
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

        // Get shopDoc for link settings
        const shopDoc = await db.collection("shops").findOne({
          shop,
        });
        req.shopDoc = shopDoc;

        const { markup } = await Proxy.link(req, res);
        res.set("Content-Type", "application/liquid");
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
        res.set("Content-Type", "application/liquid");
        res.status(200).send("There was an error.");
      }
    }
  );
}
