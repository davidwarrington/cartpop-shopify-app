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
      scopes: shopDoc.scopes,
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
