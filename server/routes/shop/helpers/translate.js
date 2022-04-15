import { defaultTranslations } from "../../../translations.js";

export const getTranslations = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;

  try {
    // Fetch shopDoc
    const shopDoc = await db.collection("shops").findOne({ shop });
    if (!shopDoc) {
      throw `Can't find shop of ${shop}`;
    }

    // TODO: fetch translations from shop metafield(s) (do this in client?)

    // TODO: merge  defaultTranslations["en"]

    return {
      translations: shopDoc.translations,
    };
  } catch (err) {
    throw err;
  }
};

export const updateTranslations = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;
  const payload = req.body;

  try {
    const { translations } = payload;
    // TODO: save translations on shop metafield(s)

    // Save translations on shopDoc
    const updatedShopDoc = await db.collection("shops").updateOne(
      {
        shop,
      },
      {
        $set: {
          translations,
        },
      }
    );

    if (!updatedShopDoc || !updatedShopDoc.ok) {
      throw `Could not save translations successfully`;
    }

    return true;
  } catch (err) {
    throw err;
  }
};
