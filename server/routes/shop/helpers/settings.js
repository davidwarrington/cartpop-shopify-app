export const updateSettings = async (req, res) => {
  const { session, db } = req;
  const shop = session.shop;
  const payload = req.body;

  try {
    // Update shop settings
    const updatedShopDoc = await db.collection("shops").updateOne(
      {
        shop,
      },
      {
        $set: {
          settings: {
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
