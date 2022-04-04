// Add payload into Mongodb
export const create = async (req, res) => {
  const { db, analytics } = req;

  try {
    await db.collection("links").insertOne({
      name: "example link",
      alias: "123abc", // TODO: unique index
      type: "checkout", // ["cart", "checkout"]
      // TODO: add payload
    });
    console.log("Inside create function");

    // TODO: fire event? analytics.create({ })
  } catch (err) {
    // TODO:
  }
};
