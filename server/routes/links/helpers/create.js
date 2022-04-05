// Add payload into Mongodb
export const create = async (req, res) => {
  const { db, analytics, session } = req;
  const shop = session.shop;
  const payload = req.body;

  try {
    // TODO: sanitize input
    const { name, products, customer, order } = payload;

    const newLink = await db.collection("links").insertOne({
      shop: shop,
      active: true,
      alias: "123abc", // TODO: unique index
      name, // required
      type: "checkout", // TODO: ["cart", "checkout"]
      products, // required
      customer: customer || null,
      order: order || null,
      createdAt: new Date(),
    });

    if (!newLink || !newLink.acknowledged) {
      // TODO: improve error
      throw "Link creation failed";
    }

    analytics &&
      analytics.track({
        event: "link created",
        userId: shop,
      });

    return newLink.insertedId;
  } catch (err) {
    // TODO: improve
    throw err;
  }
};
