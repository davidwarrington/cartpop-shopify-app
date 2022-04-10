import { composeGid } from "@shopify/admin-graphql-api-utilities";
import { Shopify } from "@shopify/shopify-api";

export const APP_SUBSCRIPTION_CANCEL = `mutation appSubscriptionCancel(
    $id: ID!
  ) {
    appSubscriptionCancel(
      id: $id
    ) {
      appSubscription {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
}`;

export const downgrade = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;

  try {
    // Retrieve shop record
    const shopDoc = await db.collection("shops").findOne({ shop });
    if (!shopDoc) {
      throw `Shop ${shop} not found`;
    }

    // Store the active subscription charge id
    const chargeId = shopDoc.subscription?.chargeId;
    if (!chargeId) {
      throw `No charge id on ${shop}`;
    }

    // Create client
    const client = new Shopify.Clients.Graphql(shop, session.accessToken);

    // Send API request to cancel the subscription
    const data = await client.query({
      data: {
        query: APP_SUBSCRIPTION_CANCEL,
        varaibles: {
          id: `${composeGid("AppSubscription", chargeId)}`,
        },
      },
    });
    if (!data || !data.appSubscriptionCancel) {
      throw `Invalid payload returned for ${shop} on ${chargeId}`;
    }

    // Make sure the API call was successful
    const { status } = data.appSubscriptionCancel.appSubscription;
    if (status !== "CANCELLED") {
      throw `Status of CENCELLED expected but received ${status}`;
    }

    // Delete subscription
    const mongoRes = await db.collection("shops").updateOne(
      {
        shop: shop,
      },
      {
        $set: {
          subscription: null,
          // So that we know if they upgrade that they've previously been subscribers
          hasSubscribed: true,
        },
      }
    );

    // if (!mongoRes) {
    //   throw `Could not delete link`;
    // }

    console.log(
      `${shopDoc.shopDomain} downgraded to free plan. Cancelled charge id: ${chargeId}`
    );

    return true;
  } catch (err) {
    console.warn("err!!");
    throw err;
  }
};
