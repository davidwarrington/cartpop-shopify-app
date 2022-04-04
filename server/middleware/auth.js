import { Shopify } from "@shopify/shopify-api";

import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";

export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop,
      })
    );
  });

  app.get("/auth/callback", async (req, res) => {
    const { db } = req;

    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const host = req.query.host;

      const response = await Shopify.Webhooks.Registry.register({
        shop: session.shop,
        accessToken: session.accessToken,
        topic: "APP_UNINSTALLED",
        path: "/webhooks",
      });

      if (!response["APP_UNINSTALLED"].success) {
        console.log(
          `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        );
      }

      // Check if Shop has app installed
      let shopDoc = await db.collection("shops").findOne({
        shop: session.shop,
      });

      if (!shopDoc) {
        // This shop has never been installed
        await db.collection("shops").insertOne({
          shopId: null, // TODO:
          shop: session.shop,
          scopes: session.scope,
          isInstalled: true,
          subscription: null,
          settings: null,
          installedAt: new Date(),
          uninstalledAt: null,
        });

        // TODO: fire Segment event INSTALL
        console.log("INSTALL", session.shop);
      } else if (!shopDoc.isInstalled) {
        console.log("REINSTALL");
        // This is a REINSTALL
        await db.collection("shops").updateOne(
          {
            shop: session.shop,
          },
          {
            $set: {
              isInstalled: true,
              installedAt: new Date(),
            },
          }
        );

        // TODO: fire Segment event REINSTALL
        console.log("REINSTALL", session.shop);
      } else {
        console.log("REAUTH", session.shop);
      }

      // Redirect to app with shop parameter upon auth
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
