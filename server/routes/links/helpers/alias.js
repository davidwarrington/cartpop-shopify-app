export const getWithAlias = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;
  const linkAlias = req.params.alias;

  try {
    const linkDoc = await db.collection("links").findOne({
      shop: shop,
      alias: linkAlias,
      // active: true, // TODO: add as optional flag
    });

    if (!linkDoc) {
      throw `Could not find link with alias ${linkAlias}`;
    }

    // TODO: Return specific fields
    const link = linkDoc;

    return {
      ...link,
    };
  } catch (err) {
    throw err;
  }
};
