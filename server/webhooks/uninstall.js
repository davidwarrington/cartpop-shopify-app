const MONGODB_DB = process.env.MONGODB_DB;

export const uninstall = async ({
  topic,
  shop,
  body,
  mongodb,
  analyticsClient,
}) => {
  try {
    // Update shop to show as uninstalled
    await mongodb
      .db(MONGODB_DB)
      .collection("shops")
      .updateOne(
        { shop: shop },
        {
          $set: {
            storefrontAccessToken: null,
            isInstalled: false,
            uninstalledAt: new Date(),
            subscription: null,
          },
        }
      );

    // Remove all sessions tied to shop
    await mongodb
      .db(MONGODB_DB)
      .collection("__session")
      .deleteMany({ shop: shop });

    // Disable all links
    await mongodb
      .db(MONGODB_DB)
      .collection("links")
      .updateMany(
        { shop: shop },
        {
          $set: {
            active: false,
          },
        }
      );

    // Fire reinstall event
    analyticsClient &&
      analyticsClient.track({
        event: "uninstall",
        userId: shop,
      });
    return;
  } catch (err) {
    console.warn(err);
    return;
  }
};
