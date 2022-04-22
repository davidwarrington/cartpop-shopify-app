export const updateSettings = async (req, res) => {
  const { session, db } = req;
  const shop = session.shop;
  const payload = req.body;

  try {
    // Get current shopDoc,
    const shopDoc = await db.collection("shops").findOne({
      shop,
    });

    // Update shop settings
    const updatedShopDoc = await db.collection("shops").updateOne(
      {
        shop,
      },
      {
        $set: {
          settings: {
            ...shopDoc.settings,
            ...payload,
          },
        },
      }
    );

    if (!updatedShopDoc || !updatedShopDoc.acknowledged) {
      throw `Could not save settings successfully`;
    }

    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
