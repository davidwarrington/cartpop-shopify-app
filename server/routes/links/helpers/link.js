import { ObjectId } from "mongodb";

export const get = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;
  const linkId = req.params.id;

  try {
    const linkDoc = await db.collection("links").findOne({
      shop: shop,
      _id: ObjectId(linkId),
    });

    if (!linkDoc) {
      throw `Could not find link with id ${linkId}`;
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
