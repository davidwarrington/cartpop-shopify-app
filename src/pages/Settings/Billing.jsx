import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  EmptyState,
  FooterHelp,
  Heading,
  Icon,
  Image,
  Link,
  Page,
  Stack,
  TextContainer,
  TextStyle,
} from "@shopify/polaris";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { TickMinor } from "@shopify/polaris-icons";
import { userLoggedInFetch } from "../../helpers";

import UpgradeIcon from "../../assets/icon-upgrade.png";
import BenefitUnlimited from "../../assets/benefit-unlimited.png";
import BenefitAnalytics from "../../assets/benefit-analytics.png";
import BenefitAlias from "../../assets/benefit-alias.png";
import BenefitReorder from "../../assets/benefit-reorder.png";
import BenefitSubscriptions from "../../assets/benefit-subscriptions.png";
import BenefitDynamic from "../../assets/benefit-dynamic.png";
import BenefitProperties from "../../assets/benefit-properties.png";

import { useShop } from "../../core/ShopProvider";

const pageTitle = "Billing";

const SettingsBillingPage = () => {
  const { shopData, setShopData } = useShop();
  let [searchParams, setSearchParams] = useSearchParams();
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const fetchFunction = userLoggedInFetch(app);

  const hasUpgraded = searchParams.get("upgraded") || false;
  const hasDowngraded = searchParams.get("downgraded") || false;

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [subscription, setSubscription] = useState(
    shopData ? shopData.subscription : hasUpgraded
  );

  useEffect(() => {
    if (hasUpgraded || hasDowngraded) {
      setToast({
        show: true,
        content: `Successfully ${hasUpgraded ? "upgraded" : "downgraded"}`,
      });
    }
  }, []);

  useEffect(() => {
    if (!shopData) {
      return;
    }

    setSubscription(shopData.subscription);
  }, [shopData]);

  const handleSubscription = useCallback(async () => {
    try {
      setSubmitting(true);
      const result = await fetchFunction(`/api/billing`, {
        method: "POST",
      }).then((res) => res.json());

      if (!result || !result.url) {
        throw `Plan change was unsuccessful`;
      }

      // Redirect to admin billing approval screen
      redirect.dispatch(Redirect.Action.REMOTE, result.url);
    } catch (err) {
      setSubmitting(false);

      // TODO: send to bugsnag
      console.warn(err);
    }
  }, []);

  const handleDowngrade = useCallback(async () => {
    try {
      setSubmitting(true);
      const result = await fetchFunction(`/api/billing`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (!result) {
        throw `Plan downgrade was unsuccessful`;
      }

      setShopData((currentShopData) => ({
        ...currentShopData,
        subscription: null,
      }));

      setToast({
        show: true,
        content: `Successfully downgraded`,
      });
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);

      // TODO: send to bugsnag
      console.warn(err);
    }
  }, []);

  return (
    <Page
      breadcrumbs={[
        { content: "Dashboard", url: "/" },
        { content: "Settings", url: "/settings" },
      ]}
      title={pageTitle}
    >
      <TitleBar
        title={pageTitle}
        breadcrumbs={[
          { content: "Dashboard", url: "/" },
          { content: "Settings", url: "/settings" },
        ]}
      />
      {toast && toast.show ? (
        <Toast
          content={toast.content}
          onDismiss={() => setToast({})}
          error={toast.error}
        />
      ) : null}
      {subscription || hasUpgraded ? (
        <Card sectioned>
          <Stack vertical>
            <Heading>Cancel subscription</Heading>
            <TextContainer spacing="tight">
              <p>Downgrade to the free plan and cancel your subscription.</p>
              <p>
                Note that some features will become disabled such as link
                aliases.
              </p>
            </TextContainer>
            <Button onClick={handleDowngrade} loading={submitting}>
              Cancel subscription
            </Button>
          </Stack>
        </Card>
      ) : (
        <>
          <Card>
            <EmptyState
              image={UpgradeIcon}
              heading="Upgrade to Pro for $10/mo"
              action={{
                content: "Upgrade to Pro",
                onAction: handleSubscription,
                loading: submitting,
              }}
            >
              <Stack>
                <Stack.Item>
                  Upgrade to unlock all features including link aliases and
                  analytics.
                </Stack.Item>
              </Stack>
            </EmptyState>
          </Card>
          <Card>
            <Card.Section>
              <Stack distribution="center">
                <Heading>Why Upgrade to Pro?</Heading>
              </Stack>
              <br />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridGap: "2rem",
                }}
              >
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitAlias} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Link aliases</Heading>
                      </Stack>
                      <Stack
                        alignment="center"
                        distribution="center"
                        wrap={false}
                      >
                        <div style={{ textAlign: "center" }}>
                          Share with customers memorable short checkout links
                          with link aliases.
                        </div>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitDynamic} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Dynamic links</Heading>
                      </Stack>
                    </Stack>
                    <Stack distribution="center" wrap={false}>
                      <div style={{ textAlign: "center" }}>
                        Dynamically pass in products, discount codes, and more.
                        Great for automated email and SMS flows.
                      </div>
                    </Stack>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitUnlimited} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Create unlimited links</Heading>
                      </Stack>
                    </Stack>
                    <Stack alignment="center" wrap={false}>
                      <div style={{ textAlign: "center" }}>
                        Create as many links as you need with no limitations.
                      </div>
                    </Stack>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitSubscriptions} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Subscription products</Heading>
                      </Stack>
                    </Stack>
                    <Stack distribution="center" wrap={false}>
                      <div style={{ textAlign: "center" }}>
                        Add subscription products. Dramatically increase
                        customer life time value.
                      </div>
                    </Stack>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitProperties} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Line Item Properties</Heading>
                      </Stack>
                    </Stack>
                    <Stack distribution="center" wrap={false}>
                      <div style={{ textAlign: "center" }}>
                        Add line item properties to products to support gift
                        cards, monogramming, and more.
                      </div>
                    </Stack>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight" distribution="center">
                    <Stack
                      vertical
                      distribution="center"
                      alignment="center"
                      spacing="extraTight"
                    >
                      <Image source={BenefitAnalytics} height="225" />
                      <Stack alignment="center" spacing="tight">
                        <Icon source={TickMinor} color="success" />
                        <Heading>Link analytics</Heading>
                      </Stack>
                    </Stack>
                    <Stack distribution="center" wrap={false}>
                      <div style={{ textAlign: "center" }}>
                        Get detailed analytics including clicks, qr code scans,
                        and more.
                      </div>
                    </Stack>
                  </Stack>
                </Stack.Item>

                {/* <Stack vertical>
                  <Image source={UpgradeIcon} />
                  <Stack alignment="center" >
                    <Icon source={MobileAcceptMajor} color="success" />
                    <Stack.Item>
                      <Stack vertical spacing="none">
                        <Heading>Excellent support</Heading>
                        <Stack.Item>Quick and responsive chat &amp; email support.</Stack.Item>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Stack> */}

                {/* <Stack alignment="center" spacing="">
                  <Icon source={MobileAcceptMajor} color="success" />
                  <Stack.Item>
                    <Stack vertical spacing="none">
                      <Heading>Reorder links</Heading>
                      <Stack.Item>Easily allow customers to reorder products they've previously purchased.</Stack.Item>
                    </Stack>
                  </Stack.Item>
                </Stack> */}
              </div>
              <br />
            </Card.Section>
          </Card>
          <FooterHelp>
            <TextStyle variation="subdued">
              All pricing is shown in USD. Learn more about{" "}
              <Link>CartPop Pro</Link>.
            </TextStyle>
          </FooterHelp>
        </>
      )}
    </Page>
  );
};

export default SettingsBillingPage;
