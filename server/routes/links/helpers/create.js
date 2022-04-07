import { nanoid } from "nanoid";

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
      alias: nanoid(10), // TODO: unique index
      name, // required
      type: "checkout", // TODO: ["cart", "checkout", "reorder"]
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