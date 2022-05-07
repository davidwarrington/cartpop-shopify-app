import { ObjectId } from "mongodb";
import { generateLinkAlias } from "../../../helpers/index.js";

export const update = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;
  const linkId = req.params.id;
  const payload = req.body;

  try {
    // TODO: sanitize input
    const { name, active, alias, products, customer, order, settings } =
      payload;

    const updatedLinkDoc = await db.collection("links").findOneAndUpdate(
      {
        shop: shop,
        _id: ObjectId(linkId),
      },
      {
        $set: {
          active,
          name,
          products,
          customer,
          order,
          settings: settings,
          alias: alias || generateLinkAlias(),
          updatedAt: new Date(),
        },
      },
      {
        returnNewDocument: true,
      }
    );

    if (!updatedLinkDoc || !updatedLinkDoc.ok) {
      throw `Could not update link with id ${linkId}`;
    }

    // TODO: Return specific fields
    //const link = updatedLinkDoc;

    return true;
  } catch (err) {
    throw err;
  }
};
