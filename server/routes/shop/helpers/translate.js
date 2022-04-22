import { Shopify } from "@shopify/shopify-api";
import { translationMetafield } from "../../../constants.js";
import { defaultTranslations } from "../../../default-translations.js";

const GET_SHOP_METAFIELD = `query getShopTranslations($namespace: String!, $key: String!) {
    shop {
        metafield(namespace: $namespace, key: $key) {
            id
            value
        }
    }
}`;

const SET_SHOP_METAFIELD = `mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        key
        value
      }
      userErrors {
        code
        message
      }
    }
  }
`;

export const getTranslations = async (req, res) => {
  const { session } = req;
  const shop = session.shop;

  try {
    // Fetch translations from shop metafield(s) (do this in client?)
    const client = new Shopify.Clients.Graphql(shop, session.accessToken);

    // Send Query
    const res = await client.query({
      data: {
        query: GET_SHOP_METAFIELD,
        variables: {
          namespace: translationMetafield.namespace,
          key: translationMetafield.key,
        },
      },
    });

    const metafieldPayload = res?.body?.data?.shop?.metafield || null;

    return {
      defaultTranslations: defaultTranslations,
      translations:
        metafieldPayload && metafieldPayload.value
          ? JSON.parse(metafieldPayload.value)
          : null,
      translationsMetafieldId: metafieldPayload ? metafieldPayload.id : null,
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
    // Fetch shopDoc
    const shopDoc = await db.collection("shops").findOne({ shop });
    if (!shopDoc) {
      throw `Can't find shop of ${shop}`;
    }

    const { translations } = payload;
    // Save translations on shop metafield(s)
    const client = new Shopify.Clients.Graphql(shop, session.accessToken);

    // Send Creation/Update Query
    const res = await client.query({
      data: {
        query: SET_SHOP_METAFIELD,
        variables: {
          metafields: {
            ownerId: shopDoc.shopData?.id,
            namespace: translationMetafield.namespace,
            key: translationMetafield.key,
            type: translationMetafield.type,
            value: JSON.stringify(payload.translations),
          },
        },
      },
    });

    if (!res?.body?.data?.metafieldsSet) {
      throw `Did not save metafield on store properly`;
    }

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

    if (!updatedShopDoc || !updatedShopDoc.acknowledged) {
      throw `Could not save translations successfully`;
    }

    return true;
  } catch (err) {
    throw err;
  }
};
