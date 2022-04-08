import { useEffect, useState } from "react";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Layout,
  Link,
  TextStyle,
  Page,
  Spinner,
  Stack,
  Image,
  Heading,
  Subheading,
  Icon,
  TextContainer,
} from "@shopify/polaris";
import { useAppBridge, TitleBar } from "@shopify/app-bridge-react";

import { PAGE_STATES } from "../constants";
import cashRegister from "../assets/cash_register_128.png";
import { AllLinksCard } from "../components/AllLinksTable";
import { userLoggedInFetch } from "../helpers";
import { FavoriteMajor, StarFilledMinor } from "@shopify/polaris-icons";

const Home = () => {
  const app = useAppBridge();

  const [pageState, setPageState] = useState(PAGE_STATES.loading);
  const [links, setLinks] = useState([]);

  async function getLinks() {
    const fetchFunction = userLoggedInFetch(app);
    const apiRes = await fetchFunction("/api/links").then((res) => res.json());

    if (!apiRes) {
      // TODO: fail
      setPageState(PAGE_STATES.idle);
      return;
    }

    // Set links
    const links = apiRes.links;
    setLinks(links);
    setPageState(PAGE_STATES.idle);
  }

  useEffect(() => {
    getLinks();
  }, []);

  if (pageState === PAGE_STATES.loading) {
    return (
      <Page>
        <Spinner accessibilityLabel="Loading links" />
      </Page>
    );
  }

  return (
    <Page
      title={links && links.length ? "Dashboard" : ""}
      primaryAction={
        links && links.length
          ? {
              content: "Create link",
              url: "/links/new",
            }
          : null
      }
    >
      {/* Empty TitleBar to reset when navigating from other pages like Settings */}
      <TitleBar />
      <Layout>
        {links && links.length ? (
          <Layout.Section fullWidth>
            <AllLinksCard links={links} />

            <Card
              title={
                <Stack vertical spacing="extraTight">
                  <Heading>
                    You're probably leaving free money on the table.
                  </Heading>
                  <TextContainer>
                    We've developed one of the top post purchase apps to easily
                    increase your average order value. Used by over 1600 Shopify
                    merchants like yourself.
                  </TextContainer>
                </Stack>
              }
            >
              <Card.Section>
                <Stack vertical spacing="tight">
                  <Stack>
                    <Image source="https://cdn.shopify.com/app-store/listing_images/e010202d5c2e2eb1c766f8cf8c78c52b/icon/CJqIi9CtyPYCEAE=.png?height=60&width=60" />
                    <Stack vertical spacing="none">
                      <Heading>
                        <Link
                          plain
                          monochrome
                          external
                          url="https://apps.shopify.com/checkout-promotions"
                        >
                          Checkout Promotions
                        </Link>
                      </Heading>
                      <TextContainer>
                        One Click Post Purchase Upsells
                      </TextContainer>
                      <Stack alignment="center" spacing="tight">
                        {/* <Icon source={StarFilledMinor} color="warning" /> */}
                        <Subheading>
                          <TextStyle variation="positive">
                            Rated a perfect 5.0/5.0 on the Shopify App Store
                          </TextStyle>
                        </Subheading>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
        ) : (
          <Layout.Section fullWidth>
            <Stack vertical spacing="tight">
              <Card>
                <EmptyState
                  image={cashRegister}
                  heading="Create a checkout link to get started"
                  action={{
                    content: "Create new checkout link",
                    url: "/links/new",
                  }}
                >
                  <p>
                    Create and manage one click checkout links that
                    automatically add products to a customer's cart and navigate
                    directly to checkout.
                  </p>
                </EmptyState>
              </Card>
              <Stack distribution="center">
                <TextStyle>
                  Learn more about{" "}
                  <Link
                    external
                    url="https://help.shopify.com/en/manual/products/details/checkout-link"
                  >
                    checkout links
                  </Link>
                </TextStyle>
              </Stack>
            </Stack>
          </Layout.Section>
        )}
        <Layout.Section>
          <br />
          <Banner>
            Made in New York City by{" "}
            <Link url="https://www.checkoutpromotions.com" external>
              Checkout Promotions
            </Link>
            .
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Home;
