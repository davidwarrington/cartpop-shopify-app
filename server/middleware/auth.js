import { Shopify } from "@shopify/shopify-api";

import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";

const GET_SHOP_DATA = `{
  shop {
    id
    name
		ianaTimezone
    email
    url
    currencyCode
    primaryDomain {
      url
      sslEnabled
    }
    shopLocales {
      locale
      primary
      published
    }
    plan {
      displayName
      partnerDevelopment
      shopifyPlus
    }
  }
}`;

export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(
        `/auth/toplevel?${new URLSearchParams(req.query).toString()}`
      );
    }

    let redirectUrl = null;

    const offlineSession = await Shopify.Utils.loadOfflineSession(
      req.query.shop
    );
    if (!offlineSession) {
      // Missing offline token, let's redirect to offline
      redirectUrl = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        "/auth/offline/callback",
        false // isOnline -- app.get("use-online-tokens")
      );
    } else {
      // We have offline, let's continue to online
      redirectUrl = await Shopify.Auth.beginAuth(
        req,
        res,
        req.query.shop,
        "/auth/callback",
        true // isOnline -- app.get("use-online-tokens")
      );
    }

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
        host: req.query.host,
        query: req.query,
      })
    );
  });

  // Offline token callback
  app.get("/auth/offline/callback", async (req, res) => {
    await Shopify.Auth.validateAuthCallback(req, res, req.query);

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      true // isOnline -- app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  // Online token callback
  app.get("/auth/callback", async (req, res) => {
    const { db } = req;
    let fetchShopData = true;

    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );

      const host = req.query.host;

      // Register uninstall webhook
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

        // Fire install event
        req.analytics &&
          req.analytics.track({
            event: "install",
            userId: session.shop,
          });
      } else if (!shopDoc.isInstalled) {
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

        // Fire reinstall event
        req.analytics &&
          req.analytics.track({
            event: "reinstall",
            userId: session.shop,
          });
      } else {
        if (shopDoc.shopData) {
          fetchShopData = false;
        }
        // Fire reauth event
        req.analytics &&
          req.analytics.track({
            event: "reauth",
            userId: session.shop,
          });
      }

      if (fetchShopData) {
        // Set the shopData on the store during initial auth
        const client = new Shopify.Clients.Graphql(
          session.shop,
          session.accessToken
        );
        const res = await client.query({ data: GET_SHOP_DATA });
        // Check if data response was successful
        if (!res?.body?.data?.shop) {
          console.warn(`Missing shop data on ${shop}`);
        } else {
          const shopData = res.body.data.shop;

          // Save shopData to shop document
          await db.collection("shops").updateOne(
            {
              shop: session.shop,
            },
            {
              $set: {
                shopData,
              },
            }
          );
        }
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
