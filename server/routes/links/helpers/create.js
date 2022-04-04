// Add payload into Mongodb
export const create = async (req, res) => {
  const { db, analytics, session } = req;
  const shop = session.shop;

  try {
    await db.collection("links").insertOne({
      shop: shop,
      name: "example link",
      alias: "123abc", // TODO: unique index
      type: "checkout", // ["cart", "checkout"]
      // TODO: add payload
    });
    console.log("Inside create function");

    // TODO: check if created successfully otherwise throw

    analytics &&
      analytics.track({
        event: "link created",
        userId: shop,
      });

    // TODO: fire event? analytics.create({ })
  } catch (err) {
    // TODO:
    res.status(500).send("");
  }
};
