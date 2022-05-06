import { ObjectId } from "mongodb";

export const remove = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;
  const linkId = req.params.id;

  try {
    // Validate valid Mongodb id
    if (!ObjectId.isValid(linkId)) {
      throw "Invalid link id.";
    }

    // Delete promotion
    const mongoRes = await db
      .collection("links")
      .deleteOne({ _id: ObjectId(`${linkId}`) });

    if (!mongoRes || !mongoRes.acknowledged) {
      throw `Could not delete link`;
    }

    return true;
  } catch (err) {
    throw err;
  }
};
