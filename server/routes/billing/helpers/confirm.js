import { Shopify } from "@shopify/shopify-api";

const GET_ACTIVE_SUBSCRIPTION = `{ 
	appInstallation {
        activeSubscriptions {
            test
            createdAt
            currentPeriodEnd
            name
            trialDays
            status
        }
    }
}`;

export const confirm = async (req, res) => {
  const { db, analytics } = req;
  const { charge_id, shop } = req.query;

  try {
    // Create client
    const session = await Shopify.Utils.loadOfflineSession(shop);
    const client = new Shopify.Clients.Graphql(shop, session.accessToken);

    // Send API request to cancel the subscription
    const res = await client.query({
      data: GET_ACTIVE_SUBSCRIPTION,
    });
    if (
      !res?.body?.data?.appInstallation?.activeSubscriptions ||
      !res.body.data.appInstallation.activeSubscriptions.length
    ) {
      throw `Invalid payload returned for ${shop} on ${charge_id}`;
    }

    // Get the active subscription
    const activeSubscription =
      res?.body?.data?.appInstallation?.activeSubscriptions[0];
    if (activeSubscription.status !== "ACTIVE") {
      throw `${shop} subscription status is not active on charge_id ${charge_id}`;
    }

    // Update shopDoc
    await db.collection("shops").findOneAndUpdate(
      { shop },
      {
        $set: {
          subscription: {
            chargeId: charge_id,
            plan: "PRO",
            status: activeSubscription.status,
            test: activeSubscription.test,
            trialDays: activeSubscription.trialDays,
            currentPeriodEnd: activeSubscription.currentPeriodEnd,
            createdAt: activeSubscription.createdAt,
            upgradedAt: new Date(),
          },
        },
      },
      {
        returnOriginal: false,
      }
    );

    // Segment Analytics
    analytics.track({
      userId: shop,
      event: "Subscription activated",
      properties: {
        chargeId: charge_id,
        name: activeSubscription.name,
        price: activeSubscription.price,
        isTest: activeSubscription.test,
        status: activeSubscription.status,
        trialDuration: activeSubscription.trialDays,
        // trialEndsOn: charge.trial_ends_on
      },
    });

    return { success: true, shop };
  } catch (err) {
    throw err;
  }
};
