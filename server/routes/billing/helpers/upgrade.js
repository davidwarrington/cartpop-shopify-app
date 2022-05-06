import { Shopify } from "@shopify/shopify-api";
import { subscriptionPlan } from "../../../../src/constants.js";

export const APP_SUBSCRIPTION_CREATE = `mutation appSubscribe(
  $name: String!
  $returnUrl: URL!
  $trialDays: Int!
  $test: Boolean!
  $price: Decimal!
) {
  appSubscriptionCreate(
    name: $name
    returnUrl: $returnUrl
    trialDays: $trialDays
    test: $test
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            price: { amount: $price, currencyCode: USD }
          }
        }
      },
    ]
  ) {
    userErrors {
      field
      message
    }
    confirmationUrl
    appSubscription {
      id
    }
  }
}`;

export const upgrade = async (req, res) => {
  const { db, session } = req;
  const shop = session.shop;

  try {
    // Fetch shopDoc
    const shopDoc = await db.collection("shops").findOne({ shop });
    if (!shopDoc) {
      throw `Can't find shop of ${shop}`;
    }

    // Create Graphql Client
    const client = new Shopify.Clients.Graphql(shop, session.accessToken);

    const isTestCharge = shopDoc.shopData?.plan?.partnerDevelopment
      ? true
      : false;

    const subscriptionInput = {
      name: `${subscriptionPlan.key}`,
      returnUrl: `${process.env.HOST}/api/billing/confirm?shop=${shop}`,
      trialDays: subscriptionPlan.trialDuration,
      test: isTestCharge,
      price: subscriptionPlan.price,
    };

    // Send Creation Query
    const res = await client.query({
      data: {
        query: APP_SUBSCRIPTION_CREATE,
        variables: subscriptionInput,
      },
    });

    if (!res?.body?.data?.appSubscriptionCreate?.confirmationUrl) {
      console.warn("api/billing (upgrade): _body_", res?.body);
      console.warn(
        "api/billing (upgrade) _subscriptionInput_:",
        subscriptionInput
      );
      throw `Invalid payload returned for ${shop}`;
    }

    return res.body.data.appSubscriptionCreate.confirmationUrl;
  } catch (err) {
    console.warn("api/billing (upgrade)", err);
    throw err;
  }
};
