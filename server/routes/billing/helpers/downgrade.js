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
  const { db, session, analytics } = req;
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
    const res = await client.query({
      data: {
        query: APP_SUBSCRIPTION_CANCEL,
        variables: {
          id: `${composeGid("AppSubscription", chargeId)}`,
        },
      },
    });
    if (!res?.body?.data?.appSubscriptionCancel) {
      throw `Invalid payload returned for ${shop} on ${chargeId}`;
    }

    // Make sure the API call was successful
    const { status } = res.body.data.appSubscriptionCancel.appSubscription;
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

    // Segment Analytics
    analytics &&
      analytics.track({
        userId: shop,
        event: "Subscription deactivated",
        properties: {
          chargeId: shopDoc.subscription.chargeId,
          name: shopDoc.subscription.name,
          price: shopDoc.subscription.price,
          isTest: shopDoc.subscription.test,
          status: shopDoc.subscription.status,
          trialDuration: shopDoc.subscription.trialDays,
          // trialEndsOn: charge.trial_ends_on
        },
      });

    console.log(
      `${shopDoc.shop} downgraded to free plan. Cancelled charge id: ${chargeId}`
    );

    return { success: true };
  } catch (err) {
    console.warn("api/billing (downgrade)", err);
    throw err;
  }
};
