export const get = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;

  try {
    // Fetch shopDoc
    const shopDoc = await db.collection("shops").findOne({ shop });
    if (!shopDoc) {
      throw `Can't find shop of ${shop}`;
    }

    return {
      settings: shopDoc.settings || {},
      shop: shop,
      name: shopDoc.shopData?.name || null,
      scopes: shopDoc.scopes,
      shopLocales: shopDoc.shopData?.shopLocales || null,
      primaryDomain: shopDoc.shopData?.primaryDomain?.url || null,
      shopifyPlan: shopDoc.shopData?.plan || null,
      subscription: shopDoc.subscription
        ? {
            active: true,
            plan: shopDoc.subscription.plan,
            updatedAt: shopDoc.subscription.upgradedAt,
          }
        : null,
    };
  } catch (err) {
    throw err;
  }
};
