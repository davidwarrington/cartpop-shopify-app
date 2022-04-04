// @ts-check
import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { MongoClient } from "mongodb";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";

import webhookGdprRoutes from "./webhooks/gdpr.js";
import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
import MongoStore from "./middleware/mongo-store.js";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const { MONGODB_DB, MONGODB_URI } = process.env;

// Connect to Mongodb and set to common connection variable for pooling
const mongodb = await MongoClient.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async (connection) => {
  console.log(`Successfully connected to ${MONGODB_DB}`);
  return connection;
});

// Create new isntance of session storage via Mongodb
const sessionStorage = new MongoStore(mongodb);

// Create Shopify API instance
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    sessionStorage.storeCallback.bind(sessionStorage),
    sessionStorage.loadCallback.bind(sessionStorage),
    sessionStorage.deleteCallback.bind(sessionStorage)
  ),
});

Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  webhookHandler: async (topic, shop, body) => {
    // TODO: isInstalled: false,
    // TODO: uninstalledAt: new Date(),
    // TODO: delete all mongodb sessions for store
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;

  // Expose mongodb on req
  app.use((req, res, next) => {
    req.db = mongodb.db(MONGODB_DB);
    next();
  });

  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);

  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

  applyAuthMiddleware(app);

  app.post("/webhooks", async (req, res) => {
    try {
      const webhookResponse = await Shopify.Webhooks.Registry.process(req, res);
      console.log(
        `Webhook processed, returned status code 200`,
        webhookResponse
      );
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  // TODO: Remove old starter api.
  // app.get("/products-count", verifyRequest(app), async (req, res) => {
  //   const session = await Shopify.Utils.loadCurrentSession(req, res, true);
  //   const { Product } = await import(
  //     `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
  //   );

  //   const countData = await Product.count({ session });
  //   res.status(200).send(countData);
  // });

  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.use(express.json());

  webhookGdprRoutes(app);

  // iFrame Security headers
  // See: https://shopify.dev/apps/store/security/iframe-protection
  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  // Make sure shop is installed
  app.use("/*", async (req, res, next) => {
    const { db } = req;
    const shop = req.query.shop;

    try {
      // If no shop then we continue
      if (!shop) {
        next();
        return;
      }

      // Check if shop is installed, otherwise redirect to oauth process
      const shopDoc = await db
        .collection("shops")
        .findOne({ shopDomain: shop, isInstalled: true });
      if (!shopDoc) {
        res.redirect(`/auth?shop=${shop}`);
        return;
      }

      // Check if active session, otherwise redirect to oauth process
      const session = await Shopify.Utils.loadCurrentSession(req, res);

      // BROKEN SESSION LOGIC
      console.log("session", session);

      // if (!session && shop) {
      //   res.redirect(`/auth?shop=${shop}`);
      //   return;
      // }

      // This is the way...
      next();
    } catch (err) {
      console.warn(JSON.stringify(err));
      res.send("An error occured on the server");
      return;
    }
  });

  if (!isProd) {
    // DEV ONLY - Hot module reload
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    app.use(vite.middlewares);
  } else {
    // PROD ONLY - Compress Output
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    app.use(compression());
    app.use(serveStatic(resolve("dist/client")));
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(PORT));
}
