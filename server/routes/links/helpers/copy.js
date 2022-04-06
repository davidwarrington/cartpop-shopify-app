import { ObjectId } from "mongodb";

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
    delete linkToCopy.alias; // TODO:

    const newLink = await db.collection("links").insertOne(
      {
        ...linkToCopy,
        name: linkToCopy.name ? `Copy of ${linkToCopy.name}` : null,
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
