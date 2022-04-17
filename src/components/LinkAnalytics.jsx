import {
  Banner,
  Card,
  DisplayText,
  Heading,
  Icon,
  Stack,
  Subheading,
  TextStyle,
} from "@shopify/polaris";
import { DesktopMajor, MobileMajor } from "@shopify/polaris-icons";
import { roundTwoPlaces } from "../helpers";
import { Tooltip } from "./Tooltip";

export function LinkAnalytics({ link, hasSubscription }) {
  const clicks = {
    mobile:
      (link.analytics &&
        link.analytics.clicks &&
        link.analytics.clicks.mobile) ||
      0,
    desktop:
      (link.analytics &&
        link.analytics.clicks &&
        link.analytics.clicks.desktop) ||
      0,
  };
  clicks.total = clicks.mobile + clicks.desktop;

  const scans = {
    mobile:
      (link.analytics && link.analytics.scans && link.analytics.scans.mobile) ||
      0,
    desktop:
      (link.analytics &&
        link.analytics.scans &&
        link.analytics.scans.desktop) ||
      0,
  };
  scans.total = scans.mobile + scans.desktop;

  return (
    <Card
      title={
        <Stack distribution="equalSpacing" alignment="center">
          <Heading>Analytics</Heading>
          <TextStyle variation="subdued">All time</TextStyle>
        </Stack>
      }
    >
      <Card.Section
        title={
          <Tooltip subheading content="Links viewed count as a click.">
            Clicks
          </Tooltip>
        }
      >
        {clicks.total ? (
          <>
            <br />
            <Stack distribution="fillEvenly" vertical>
              <Stack alignment="center" distribution="fillEvenly">
                <Stack alignment="center" spacing="extraTight">
                  <Icon source={MobileMajor} color="subdued" />
                  <Subheading>
                    <TextStyle variation="subdued">Mobile</TextStyle>
                  </Subheading>
                </Stack>
                <Stack alignment="center" spacing="tight">
                  <DisplayText size="small">{clicks.mobile}</DisplayText>
                  {clicks.total ? (
                    <TextStyle>
                      ({roundTwoPlaces((clicks.mobile / clicks.total) * 100)}%)
                    </TextStyle>
                  ) : null}
                </Stack>
              </Stack>

              <Stack alignment="center" distribution="fillEvenly">
                <Stack alignment="center" spacing="extraTight">
                  <Icon source={DesktopMajor} color="subdued" />
                  <Subheading>
                    <TextStyle variation="subdued">Desktop</TextStyle>
                  </Subheading>
                </Stack>
                <Stack alignment="center" spacing="tight">
                  <DisplayText size="small">{clicks.desktop}</DisplayText>
                  {clicks.total ? (
                    <TextStyle>
                      ({roundTwoPlaces((clicks.desktop / clicks.total) * 100)}%)
                    </TextStyle>
                  ) : null}
                </Stack>
              </Stack>
            </Stack>
          </>
        ) : (
          <DisplayText size="small">0</DisplayText>
        )}
      </Card.Section>
      <Card.Section
        title={
          <Tooltip
            subheading
            content="Links scanned via QR Code will register as a scan rather than a click."
          >
            Scans
          </Tooltip>
        }
      >
        {scans.total ? (
          <>
            <br />
            <Stack distribution="fillEvenly" vertical>
              <Stack alignment="center" distribution="fillEvenly">
                <Stack alignment="center" spacing="extraTight">
                  <Icon source={MobileMajor} color="subdued" />
                  <Subheading>
                    <TextStyle variation="subdued">Mobile</TextStyle>
                  </Subheading>
                </Stack>
                <Stack alignment="center" spacing="tight">
                  <DisplayText size="small">{scans.mobile}</DisplayText>
                  {scans.total ? (
                    <TextStyle>
                      ({roundTwoPlaces((scans.mobile / scans.total) * 100)}%)
                    </TextStyle>
                  ) : null}
                </Stack>
              </Stack>

              <Stack alignment="center" distribution="fillEvenly">
                <Stack alignment="center" spacing="extraTight">
                  <Icon source={DesktopMajor} color="subdued" />
                  <Subheading>
                    <TextStyle variation="subdued">Desktop</TextStyle>
                  </Subheading>
                </Stack>
                <Stack alignment="center" spacing="tight">
                  <DisplayText size="small">{scans.desktop}</DisplayText>
                  {scans.total ? (
                    <TextStyle>
                      ({roundTwoPlaces((scans.desktop / scans.total) * 100)}%)
                    </TextStyle>
                  ) : null}
                </Stack>
              </Stack>
            </Stack>
          </>
        ) : (
          <DisplayText size="small">0</DisplayText>
        )}
      </Card.Section>
      <Card.Section
        title={
          <Tooltip
            subheading
            content="If a customer converts from a CartPop link alias, it will count as an order."
          >
            Orders
          </Tooltip>
        }
      >
        {/* Track order total, desktop vs mobile, and conversion % based on total clicks and orders placed */}
        <TextStyle variation="subdued">Coming soon.</TextStyle>
      </Card.Section>
      <Card.Section
        title={
          <Tooltip
            subheading
            content="Orders that were placed and originated from a CartPop link."
          >
            Revenue
          </Tooltip>
        }
      >
        {/* Track revenue based on currency code. Support multi-currency. */}
        <TextStyle variation="subdued">Coming soon.</TextStyle>
      </Card.Section>
      {/* Referral sources? Countries? Languages? */}
      {hasSubscription ? null : (
        <Card.Section>
          <Banner
            status="info"
            action={{
              url: "/settings/billing",
              content: "Learn more",
            }}
          >
            Link analytics require upgrading to{" "}
            <TextStyle variation="strong">PRO</TextStyle>.
          </Banner>
        </Card.Section>
      )}
      <Card.Section subdued>
        Analytics can only be tracked when customers arrive using a link alias.
      </Card.Section>
    </Card>
  );
}
