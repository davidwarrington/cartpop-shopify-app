export const all = async (req, res) => {
  const { db, session } = req;
  console.log(`Inside all function for ${session.shop}`);

  try {
    const links = await db
      .collection("links")
      .find({
        shop: session.shop,
      })
      .toArray();

    return {
      links: links || [],
    };
  } catch (err) {
    // TODO:
    throw err;
  }
};
