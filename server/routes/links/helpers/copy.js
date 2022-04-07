import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

export const copy = async (req, res) => {
  const { db, session, analytics } = req;
  const linkId = req.params.id;
  const shop = session.shop;

  try {
    const linkToCopy = await db.collection("links").findOne({
      _id: ObjectId(linkId),
      shop: shop,
    });

    if (!linkToCopy) {
      throw `Can't find link`;
    }

    // Clean up
    delete linkToCopy._id;
    delete linkToCopy.createdAt;
    delete linkToCopy.updatedAt;
    delete linkToCopy.analytics;

    const newLink = await db.collection("links").insertOne(
      {
        ...linkToCopy,
        name: linkToCopy.name ? `Copy of ${linkToCopy.name}` : null,
        alis: nanoid(10), // TODO: generate a new one if somehow an existing one does not exist.
        isEnabled: false,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        upsert: true,
        returnOriginal: false,
      }
    );

    if (!newLink || !newLink.acknowledged) {
      // TODO: improve error
      throw "Link creation failed";
    }

    analytics &&
      analytics.track({
        event: "link copied",
        userId: shop,
        // TODO: link properties like type
      });

    return newLink.insertedId;
  } catch (err) {
    throw err;
  }
};
